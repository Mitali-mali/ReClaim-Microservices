const Item = require('../models/Item');

exports.reportItem = async (req, res) => {
  try {
    const { type, category, name, description, location, date, color, brand, imageUrl } = req.body;
    
    const newItem = new Item({
      reporterId: req.user.id,
      type,
      category,
      name,
      description,
      location,
      date,
      color,
      brand,
      imageUrl
    });

    await newItem.save();
    res.status(201).json({ message: type + ' item reported successfully', item: newItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { type, category, status, keyword } = req.query;
    
    let query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (status) query.status = status;
    if (keyword) {
      query.name = { $regex: keyword, $options: 'i' };
    }

    const items = await Item.find(query).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateItemStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await Item.findById(req.params.id);
    
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    item.status = status;
    await item.save();
    
    res.json({ message: 'Item status updated', item });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
