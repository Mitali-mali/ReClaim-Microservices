const Notification = require('../models/Notification');

exports.createNotification = async (req, res) => {
  try {
    const { userId, title, message } = req.body;
    
    const newNotification = new Notification({
      userId,
      title,
      message
    });

    await newNotification.save();
    res.status(201).json({ message: 'Notification created successfully', notification: newNotification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    
    if (!notification) return res.status(404).json({ error: 'Notification not found' });
    
    if (notification.userId !== req.user.id) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    notification.isRead = true;
    await notification.save();
    
    res.json({ message: 'Notification marked as read', notification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
