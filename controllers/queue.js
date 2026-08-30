const QueueEntry = require('../models/queueEntry')
const BuildMatch = require('../models/buildMatch')

const create = async (req, res) => {
    try {
        const { setNum, setName } = req.body
        const userId = req.user._id

        const alreadyQueued = await QueueEntry.findOne({
            user: userId,
            setNum,
            status: 'waiting',
        })
        if (alreadyQueued) {
            return res.status(400).json({ err: 'You are already in the queue for this set.' })
        }

        const waitingEntry = await QueueEntry.findOne({
            setNum,
            status: 'waiting',
            user: { $ne: userId },
        })

        if (waitingEntry) {
            const match = await BuildMatch.create({
                users: [waitingEntry.user, userId],
                setNum,
                setName,
            })

            waitingEntry.status = 'matched'
            await waitingEntry.save()

            const newEntry = await QueueEntry.create({
                user: userId,
                setNum,
                setName,
                status: 'matched',
            })

            return res.status(201).json({ matched: true, match })
        }

        const newEntry = await QueueEntry.create({
            user: userId,
            setNum,
            setName,
            status: 'waiting',
        })

        res.status(201).json({ matched: false, entry: newEntry })
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}

const deleteQueue = async (req, res) => {
    try {
        const entry = await QueueEntry.findById(req.params.queueId)
        if (!entry) {
            return res.status(404).json({ err: 'Queue entry not found.' })
        }
        if (entry.user.toString() !== req.user._id) {
            return res.status(403).json({ err: 'Unauthorized.' })
        }

        entry.status = 'cancelled'
        await entry.save()

        res.json({ message: 'Left the queue.' })
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

module.exports = {
    create,
    deleteQueue
}