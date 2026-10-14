const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // The user receiving the notification
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
