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

module.exports = {
    create
}