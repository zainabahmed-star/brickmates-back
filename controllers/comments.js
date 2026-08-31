const Build = require("../models/build")

const create = async (req, res) => {
try {

    const build = await Build.findById(req.params.buildId)
    if (!build){
        return res.status(400).json({ err: 'Build not found.' })
    }
    req.body.author = req.user._id
    console.log( req.user._id,"userID");
    console.log(req.body.author,"author");
    
    
    build.comment.push(req.body)
    await build.save()

    await build.populate('comment.author')

    const newComment = build.comment[build.comment.length - 1 ]

        res.status(201).json(newComment)
} catch (err) {
    res.status(500).json({ err: err.message })
}
}


const deleteComment = async (req, res) => {
    try {
    const build = await Build.findById(req.params.buildId)
     if (!build){
        return res.status(400).json({ err: 'Build not found.' })
    }
    const comment = build.comment.id(req.params.commentId)
    if (!comment){
            return res.status(400).json({err: 'Comment not found'})
        }

    if (comment.author.toString() !== req.user._id) {
      return res.status(403).json({ message: "You are not authorized to edit this comment" })}

    build.comment.pull({ _id: req.params.commentId })
    await build.save()
    res.status(200).json({message: 'comment deleted'})
    } catch (err) {
        res.status(500).json({ err: err.message })
    }

}

module.exports = {
    create,
    deleteComment,

}