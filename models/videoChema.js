const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({  
    title:{
        type:String,
        required:true,
    },
    ref:{
        type:String,
        required:true,
    },
    currentTime:{
        type:Number,
        required:true,
    },
    date:{
        type:Date,
    }
});
module.exports = mongoose.model("videos", videoSchema)