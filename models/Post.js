const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    title:{
        type:String,
        required:true,
        unique:true
    },
    notes:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true,
    },
    userId:{
        type:String,
        required:true,
    }
},{timestamps:true})

module.exports=mongoose.model('Post',PostSchema)