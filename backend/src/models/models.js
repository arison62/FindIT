const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password_hash: { type: String, required: true },
  is_anonymous: { type: Boolean, default: false },
  is_verified: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
})
const postSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  address: String,
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    },
  },
  date_found: { type: Date },
  is_anonymous: { type: Boolean, default: false },
  status: { type: String, enum: ['found', 'lost', 'reported', 'closed'], default: 'found' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  images: [{
    image_url: { type: String, required: true },
    uploaded_at: { type: Date, default: Date.now },
  }],
  finder_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  closed_at: { type: Date },
  resolution_type: {
    type: String,
    enum: ['lost_and_found', 'found_and_returned'],
  },
});
postSchema.index({ location: '2dsphere' });

const messageSchema = new mongoose.Schema({
  sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  content: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  sent_at: { type: Date, default: Date.now },
});

const reportSchema = new mongoose.Schema({
  reporter_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reported_type: { type: String, enum: ['user', 'post', 'message'], required: true },
  reported_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  description: { type: String },
  review_status: { type: String, enum: ['pending', 'reviewed', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
});

const notificationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  message: { type: String, required: true },
  is_read: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);
const Category = mongoose.model('Category', categorySchema);
const Post = mongoose.model('Post', postSchema);
const Message = mongoose.model('Message', messageSchema);
const Report = mongoose.model('Report', reportSchema);
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = { User, Post, Message, Report, Notification, Category };