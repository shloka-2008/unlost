import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  user: {
    type: String
  },
  admin: {
    type: String
  }
});

const Log = mongoose.model('Log', logSchema, 'logs');

export default Log;
