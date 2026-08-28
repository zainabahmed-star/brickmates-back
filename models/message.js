
const messageSchema =new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true },
  sender: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true },
    username: String,
    text: String,      
}, { timestamps: true })

const Message = mongoose.model('Message', messageSchema)

module.exports = Message