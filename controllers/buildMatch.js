const BuildMatch = require('../models/buildMatch')

const show = async (req, res) => {
    try {
        const match = await BuildMatch.findById(req.params.matchId)
            .populate('users', 'username avatar')

        if (!match) {
            return res.status(404).json({ err: 'Match not found.' })
        }

        const isParticipant = match.users.some((user) => user._id.toString() === req.user._id)
        if (!isParticipant) {
            return res.status(403).json({ err: 'Unauthorized.' })
        }

        res.json(match)
    } catch (err) {
        res.status(500).json({ err: err.message })
    }
}

const update = async (req, res) => {
    try {
        const match = await BuildMatch.findById(req.params.matchId)

        if (!match) {
            return res.status(404).json({ err: 'Match not found.' })
        }

        const isParticipant = match.users.some((userId) => userId.toString() === req.user._id)
        if (!isParticipant) {
            return res.status(403).json({ err: 'Unauthorized.' })
        }

        const updateData = {}
        if (req.body.currentStep !== undefined) updateData.currentStep = req.body.currentStep
        if (req.body.totalSteps !== undefined) updateData.totalSteps = req.body.totalSteps
        if (req.body.status !== undefined) updateData.status = req.body.status

        const updatedMatch = await BuildMatch.findByIdAndUpdate(
            req.params.matchId,
            updateData,
            { new: true }
        ).populate('users', 'username avatar')

        res.json(updatedMatch)
    } catch (err) {
        res.status(400).json({ err: err.message })
    }
}

module.exports = {
    show,
    update,
}