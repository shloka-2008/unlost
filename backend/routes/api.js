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
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

const adminRequired = async (req, res, next) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user && user.is_admin) {
        req.user = user;
        next();
      } else {
        res.status(403).json({ success: false, message: 'Forbidden. Admin privileges required.' });
      }
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  } else {
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
};

// --- Helper for Google OAuth URL construction ---
const getGoogleRedirectUri = (req) => {
  const configuredUri = process.env.GOOGLE_REDIRECT_URI;
  if (configuredUri) return configuredUri;

  const referer = req.headers.referer;
  if (referer) {
    try {
      const parsed = new URL(referer);
      if (parsed.protocol && parsed.host) {
        return `${parsed.protocol}//${parsed.host}/api/auth/google/callback`;
      }
    } catch (e) {}
  }
  
  const protocol = req.secure || req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
  return `${protocol}://${req.headers.host}/api/auth/google/callback`;
};

// --- Google OAuth Config Endpoint ---
router.get('/api/oauth/google/config', (req, res) => {
  res.status(200).json({
    google_client_id_configured: !!process.env.GOOGLE_CLIENT_ID,
    google_client_secret_configured: !!process.env.GOOGLE_CLIENT_SECRET,
    google_redirect_uri: getGoogleRedirectUri(req)
  });
});

// --- Google OAuth Redirect ---
router.get('/api/login/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(400).send('Google OAuth is not configured. Please set credentials.');
  }

  // Save the frontend URL to redirect back to after auth completes
  const referer = req.headers.referer;
  if (referer) {
    try {
      const parsed = new URL(referer);
      req.session.frontendUrl = `${parsed.protocol}//${parsed.host}`;
    } catch (e) {}
  }

  const redirectUri = getGoogleRedirectUri(req);
  req.session.oauthRedirectUri = redirectUri;

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20email%20profile&prompt=select_account`;
  res.redirect(authUrl);
});

// --- Google OAuth Callback ---
router.get(['/api/auth/google/callback', '/auth/google/callback'], async (req, res) => {
  const code = req.query.code;
  const redirectUri = req.session.oauthRedirectUri;

  if (!code) {
    return res.status(400).send('Missing code parameter from Google callback.');
  }

  try {
    // Exchange Authorization Code for Tokens
    const tokenRes = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    });

    const { id_token, access_token } = tokenRes.data;

    // Retrieve User Profile
    const profileRes = await axios.get('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    });

    const userInfo = profileRes.data;
    const email = userInfo.email;
    const username = userInfo.name || email.split('@')[0];

    // Find or create Google User in database
    let user = await User.findOne({ email });
    if (!user) {
      // Create user with a dummy password since they are logged via OAuth
      const dummyPassword = Math.random().toString(36).slice(-10);
      const hashedPassword = await bcrypt.hash(dummyPassword, 10);
      
      user = new User({
        username,
        email,
        password: hashedPassword,
        is_admin: false,
        auth_provider: 'google',
        google_id: userInfo.sub
      });
      await user.save();
    }

    req.session.userId = user._id.toString();

    // Redirect back to frontend
    const frontendUrl = req.session.frontendUrl || '/';
    res.redirect(frontendUrl);
  } catch (err) {
    console.error('Google OAuth error:', err.response?.data || err.message);
    res.status(500).send('Google OAuth authentication failed.');
  }
});

// --- Regular Local Authentication ---

// GET /api/user
router.get('/api/user', async (req, res) => {
  if (req.session && req.session.userId) {
    try {
      const user = await User.findById(req.session.userId);
      if (user) {
        return res.status(200).json({
          authenticated: true,
          user: {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            is_admin: user.is_admin
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
      req.session.userId = user._id.toString();

      res.status(200).json({
        success: true,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          is_admin: user.is_admin
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
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Could not log out' });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ success: true, message: 'Logged out successfully.' });
    });
  } else {
    res.status(200).json({ success: true });
  }
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
    const currentUser = await User.findById(req.session.userId);
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
    const user = await User.findById(req.session.userId);
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

    res.status(200).json({
      success: true,
      stats: {
        total_items: totalItems,
        lost_items: lostItems,
        found_items: foundItems,
        archived_items: archivedItems
      }
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
