import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false
  },
  is_admin: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: 'user'
  },
  profilePicture: {
    type: String
  },
  lastLogin: {
    type: Date
  },
  auth_provider: {
    type: String,
    default: 'local'
  },
  google_id: {
    type: String
  },
  is_2fa_enabled: {
    type: Boolean,
    default: false
  },
  date_created: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', userSchema, 'users');

export default User;
