const Item = require('../models/Item');

exports.getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(400).json({ message: 'Failed to fetch items', error: error.message });
    }
};

exports.addItem = async (req, res) => {
    const { name, category, quantity, condition } = req.body;
    try {
        const item = await Item.create({ name, category, quantity, condition });
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: 'Failed to add item', error: error.message });
    }
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;
    try {
        const item = await Item.findByIdAndUpdate(id, req.body, { new: true });
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update item', error: error.message });
    }
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;
    try {
        await Item.findByIdAndDelete(id);
        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Failed to delete item', error: error.message });
    }
};
