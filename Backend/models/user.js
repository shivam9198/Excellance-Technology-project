const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
username: String,

email:{type:String,
    unique: true,
},
password:{
    type: String,

}

},{timestamp:true})

module.exports = mongoose.model("User",userSchema);