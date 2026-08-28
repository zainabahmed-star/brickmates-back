const Message = require('../models/message')

const index = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort('createdAt')
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  index,
}