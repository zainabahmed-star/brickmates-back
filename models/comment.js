commentSchema =new mongoose.Schema({
    comment:{
        type:String,
        required: true,

    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        
},
buildId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Build'
},

},{ timestamps: true })

const Comment = mongoose.model('Comment', commentSchema)
module.exports = Comment