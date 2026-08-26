const mongoose = require('mongoose')
buildSchema = new mongoose.Schema({
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    image: {
        type:{
            type:String,
        },
      url: {
        type: String,
      },
      publicId: {
        type: String,
      },
      },
      isMOC:{
        type:Boolean
      },
      status:{
        type:String,
        enum:['in progress','completed'],
        default:'in progress'
      },
      caption:{
        type:String,
      },
      timeTaken:{
        type:Number
      },
      like:[{
         type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      }],
      setId:{
        type:String,
        enum:[],
      }
},{ timestamps: true })
const Build = mongoose.model('Build', buildSchema)
module.exports = Build


