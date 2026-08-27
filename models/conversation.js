conversationSchema =new mongoose.Schema({
    participant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        
},
},{ timestamps: true })

const Conversation = mongoose.model('Conversation', conversationSchema)
module.exports = Conversation