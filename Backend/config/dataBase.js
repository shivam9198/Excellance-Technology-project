const mongoose = require("mongoose");

const connectDb = async()=>{
    await mongoose.connect("mongodb+srv://shivamkashyap9198:Bangtk9198@excellancetechnology.dslrwmt.mongodb.net/")
}
module.exports = connectDb;