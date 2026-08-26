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
      },
      caption:{
        type:String,
      },
      timeTacken:{
        type:int
      },
      like:{
         type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      },
},{ timestamps: true })
