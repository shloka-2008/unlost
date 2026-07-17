import express from 'express';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Item from '../models/Item.js';
import Log from '../models/Log.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer file upload
const uploadFolder = path.join(__dirname, '..', 'static', 'uploads');
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
    cb(null, `${timestamp}_${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedExts = ['.png', '.jpg', '.jpeg', '.gif'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only images (png, jpg, jpeg, gif) are allowed'));
    }
  }
});

// --- Authentication Middlewares ---
const loginRequired = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'jwtsecret123');
    req.userId = decoded.id;
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
};

const adminRequired = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'jwtsecret123');
    if (decoded.role === 'admin' || decoded.is_admin) {
      req.userId = decoded.id;
      req.user = decoded;
      next();
    } else {
      res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
    }
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
};

// --- Google OAuth / JWT Auth ---
const client = new OAuth2Client();

const generateJWT = (user) => {
  return jwt.sign(
    { id: user._id.toString(), email: user.email, role: user.role, is_admin: user.is_admin },
    process.env.JWT_SECRET_KEY || 'jwtsecret123',
    { expiresIn: '7d' }
  );
};

router.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, message: 'No ID token provided.' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;
    
    let user = await User.findOne({ email });
    if (user) {
      // Update profile picture and lastLogin if user exists
      if (picture && user.profilePicture !== picture) {
        user.profilePicture = picture;
      }
      user.lastLogin = new Date();
      await user.save();
    } else {
      const username = name || email.split('@')[0];
      user = new User({
        username,
        email,
        auth_provider: 'google',
        google_id: sub,
        profilePicture: picture,
        role: 'user',
        is_admin: false,
        lastLogin: new Date()
      });
      await user.save();
    }

    const jwtToken = generateJWT(user);
    res.cookie('token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({
      success: true,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
        is_admin: user.is_admin,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error('Google OAuth error:', err);
    res.status(401).json({ success: false, message: 'Google authentication failed.' });
  }
});

// --- Regular Local Authentication ---

// GET /api/user
router.get('/api/user', async (req, res) => {
  const token = req.cookies?.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'jwtsecret123');
      const user = await User.findById(decoded.id);
      if (user) {
        return res.status(200).json({
          authenticated: true,
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            is_admin: user.is_admin,
            role: user.role,
            profilePicture: user.profilePicture
          }
        });
      }
    } catch (e) {}
  }
  res.status(200).json({ authenticated: false });
});

// POST /api/register
router.post('/api/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'Missing username, email or password' });
  }

  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
      is_admin: false
    });
    await user.save();

    res.status(200).json({ success: true, message: 'Account created successfully! You can now log in.' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Database registration failed.' });
  }
});

// POST /api/login
router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Missing email or password' });
  }

  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      const jwtToken = generateJWT(user);
      res.cookie('token', jwtToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      user.lastLogin = new Date();
      await user.save();

      res.status(200).json({
        success: true,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          is_admin: user.is_admin,
          role: user.role,
          profilePicture: user.profilePicture
        }
      });
    } else {
      res.status(401).json({ success: false, message: 'Bad email or password' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Authentication error' });
  }
});

// GET /api/logout
router.get('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

// --- Items and Claims ---

const buildItemsFilter = (query) => {
  const filter = {};

  if (query.q) {
    const regex = new RegExp(query.q, 'i');
    filter.$or = [{ title: regex }, { description: regex }];
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.date) {
    const startOfDay = new Date(query.date);
    if (!isNaN(startOfDay.getTime())) {
      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);
      filter.date = {
        $gte: startOfDay,
        $lt: endOfDay
      };
    }
  }

  if (!query.status) {
    filter.status = { $ne: 'Archived' };
  }

  return filter;
};

// GET /api/items
router.get('/api/items', loginRequired, async (req, res) => {
  try {
    const filter = buildItemsFilter(req.query);
    const items = await Item.find(filter).sort({ date: -1 });

    const formattedItems = items.map(doc => ({
      id: doc._id.toString(),
      title: doc.title,
      description: doc.description,
      category: doc.category,
      location: doc.location,
      status: doc.status,
      date: doc.date ? doc.date.toISOString() : null,
      image_file: doc.image_file,
      security_question: doc.security_question,
      has_security_answer: !!doc.security_answer,
      reporter_email: doc.reporter_email || 'Anonymous'
    }));

    res.status(200).json({ success: true, items: formattedItems });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to retrieve items.' });
  }
});

// POST /api/report
router.post('/api/report', loginRequired, upload.single('image'), async (req, res) => {
  const { title, description, category, location, status, contact_info, date } = req.body;
  if (!title || !description || !category || !location || !status || !contact_info) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  try {
    const currentUser = await User.findById(req.userId);
    const dateObj = date ? new Date(date) : new Date();

    const newItem = new Item({
      title,
      description,
      category,
      location,
      status,
      contact_info,
      date: isNaN(dateObj.getTime()) ? new Date() : dateObj,
      image_file: req.file ? req.file.filename : null,
      security_question: req.body.security_question,
      security_answer: req.body.security_answer,
      reporter_email: currentUser.email
    });
    await newItem.save();

    // Log the report activity
    const newLog = new Log({
      action: `Reported item: ${title}`,
      user: currentUser.email
    });
    await newLog.save();

    res.status(200).json({ success: true, message: 'Report submitted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to submit report.' });
  }
});

// POST /api/verify_claim
router.post('/api/verify_claim', loginRequired, async (req, res) => {
  const { item_id, answer } = req.body;
  if (!item_id || !answer) {
    return res.status(400).json({ success: false, message: 'Missing item_id or answer' });
  }

  try {
    const item = await Item.findById(item_id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const cleanInput = answer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").toLowerCase().trim();
    const cleanDb = item.security_answer ? item.security_answer.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").toLowerCase().trim() : "";

    if (cleanInput === cleanDb) {
      res.status(200).json({
        success: true,
        message: 'Security check passed! Please use the contact details below to claim the item.',
        contact_info: item.contact_info
      });
    } else {
      res.status(200).json({ success: false, message: 'Incorrect answer. Please try again.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Verification error' });
  }
});

// GET /api/profile
router.get('/api/profile', loginRequired, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const logs = await Log.find({
      $or: [{ user: user.email }, { admin: user.email }]
    }).sort({ timestamp: -1 }).limit(10);

    const formattedLogs = logs.map(doc => ({
      action: doc.action,
      timestamp: doc.timestamp.toISOString(),
      user: doc.user,
      admin: doc.admin
    }));

    res.status(200).json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        date_created: user.date_created ? user.date_created.toISOString() : null
      },
      logs: formattedLogs
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to load profile logs.' });
  }
});

// --- Admin Endpoints ---

// GET /api/admin/stats
router.get('/api/admin/stats', adminRequired, async (req, res) => {
  try {
    const totalItems = await Item.countDocuments({});
    const lostItems = await Item.countDocuments({ status: 'Lost' });
    const foundItems = await Item.countDocuments({ status: 'Found' });
    const archivedItems = await Item.countDocuments({ status: 'Archived' });
    const totalUsers = await User.countDocuments({});

    const recentItems = await Item.find({ status: { $ne: 'Archived' } }).sort({ date: -1 }).limit(20);
    const trashItems = await Item.find({ status: 'Archived' }).sort({ date: -1 }).limit(20);
    const logs = await Log.find().sort({ timestamp: -1 }).limit(20);

    res.status(200).json({
      success: true,
      stats: {
        total_items: totalItems,
        total_users: totalUsers,
        lost_items: lostItems,
        found_items: foundItems,
        archived_items: archivedItems,
        new_today: 0,
        security_alerts: 0
      },
      recent_items: recentItems.map(i => ({
        id: i._id.toString(),
        title: i.title,
        category: i.category,
        status: i.status,
        location: i.location,
        date: i.date,
        reporter_email: 'Anonymous'
      })),
      trash_items: trashItems.map(i => ({
        id: i._id.toString(),
        title: i.title,
        previous_status: 'Unknown',
        deleted_at: i.date,
        days_deleted: 0
      })),
      logs: logs.map(l => ({
        action: l.action,
        item_title: l.item_title || 'N/A',
        timestamp: l.timestamp || new Date(),
        user: l.admin || 'System',
        item_id: 'N/A'
      }))
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin stats.' });
  }
});

// POST /api/admin/delete/:item_id
router.post('/api/admin/delete/:item_id', adminRequired, async (req, res) => {
  const { item_id } = req.params;
  try {
    const item = await Item.findById(item_id);
    if (item) {
      item.status = 'Archived';
      await item.save();

      const newLog = new Log({
        action: `Deleted item (ID: ${item_id})`,
        admin: req.user.email
      });
      await newLog.save();

      res.status(200).json({ success: true, message: 'Item archived successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Item not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to archive item.' });
  }
});

// POST /api/admin/recover/:item_id
router.post('/api/admin/recover/:item_id', adminRequired, async (req, res) => {
  const { item_id } = req.params;
  try {
    const item = await Item.findById(item_id);
    if (item && item.status === 'Archived') {
      // Default back to Found as per Flask implementation
      item.status = 'Found';
      await item.save();

      const newLog = new Log({
        action: `Recovered item (ID: ${item_id})`,
        admin: req.user.email
      });
      await newLog.save();

      res.status(200).json({ success: true, message: 'Item recovered successfully.' });
    } else {
      res.status(404).json({ success: false, message: 'Item not found or not in archived state.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to recover item.' });
  }
});

export default router;
