const Request = require('../models/Request');
const Item = require('../models/Item');

exports.sendRequest = async (req, res) => {
    const { itemId } = req.body;
    try {
        let isExisting = false;
        // Check if a request for the same item by the same student already exists
        const existingRequests = await Request.find({ item: itemId, student: req.user._id });
        isExisting = existingRequests.some(request =>
            request.status === "Pending" || request.status === "Approved"
        );
        console.log(isExisting);

        if (isExisting) {
            return res.status(400).json({ message: 'You have already requested this item.' });
        }

        // Create a new request
        const request = await Request.create({
            item: itemId,
            student: req.user._id,
        });

        res.status(201).json(request);
    } catch (error) {
        res.status(400).json({ message: 'Failed to send request', error: error.message });
    }
};


exports.getRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate('item').populate('student');
        res.json(requests);
    } catch (error) {
        res.status(400).json({ message: 'Failed to fetch requests', error: error.message });
    }
};

exports.updateRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // const request = await Request.findByIdAndUpdate(id, { status }, { new: true });
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        const itemId = request.item;  // Assuming the request schema has a reference to the item

        if (status === "Approved") {
            const item = await Item.findById(itemId);
            if (item.status === "Available") {
                await Item.findByIdAndUpdate(itemId, { status: 'Allocated', borrowedBy: req.user._id });
                await Request.findByIdAndUpdate(id, { status }, { new: true });
            } else {
                return res.status(400).json({ message: 'Item is not available' });
            }
        } else if (status === "Item Returned") {
            await Request.findByIdAndUpdate(id, { status }, { new: true });
            await Item.findByIdAndUpdate(itemId, { status: 'Available', borrowedBy: null });
        }
        else {
            await Request.findByIdAndUpdate(id, { status }, { new: true });
        }

        res.json(request);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update request status', error: error.message });
    }
};

// no need
exports.returnItem = async (req, res) => {
    const { id } = req.params;
    try {
        const request = await Request.findByIdAndUpdate(id, { returned: true }, { new: true });
        await Item.findByIdAndUpdate(request.item, { status: 'Available', borrowedBy: null });
        res.json(request);
    } catch (error) {
        res.status(400).json({ message: 'Failed to return item', error: error.message });
    }
};
