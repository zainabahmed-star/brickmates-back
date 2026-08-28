const Message = require('../models/message')
const User = require('../models/user')

const index = async (req, res) => {
  try {
    const messages = await Message.find({ roomId: req.params.roomId }).sort('createdAt')
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

const conversations = async (req, res) => {
    try {
        const currentUserId = req.user._id.toString()

        const rooms = await Message.distinct('roomId', {
            roomId: { $regex: currentUserId },
        })

        const conversationList = await Promise.all(
            rooms.map(async (roomId) => {
                const ids = roomId.split('_')
                const otherUserId = ids.find((id) => id !== currentUserId)

                if (!otherUserId) return null

                const otherUser = await User.findById(otherUserId).select('username avatar')

                const lastMessage = await Message.findOne({ roomId }).sort({ createdAt: -1 })

                return {
                    roomId,
                    otherUser,
                    lastMessage,
                }
            })
        )

        const filteredList = conversationList.filter((c) => c !== null)

         filteredList.sort((a, b) => {
            return new Date(b.lastMessage?.createdAt) - new Date(a.lastMessage?.createdAt)
        })

        res.json(filteredList)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports = {
  index,
  conversations
}