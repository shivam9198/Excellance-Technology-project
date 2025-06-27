const express = require("express");
const authRouter = express.Router();
const {validateSignupdata} = require("../utils/validation")
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

authRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    validateSignupdata(req); // ✅ throws if invalid

    const hashPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashPassword,
    });
    const savedUser = await user.save();

    const token = jwt.sign({ id: user._id }, "ScretKey");

    res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
      httpOnly: true,
    });

 res.status(200).json({
  user: {
    _id: savedUser._id,
    username: savedUser.username,
    email: savedUser.email
  }
});
  } catch (error) {
    res.status(400).json({ message: error.message }); // ✅ proper error response
  }
});


authRouter.post("/login",async(req,res)=>{
    const {email,password} = req.body;
    try {
        if(!email){
        throw new error("email is reuired")
        }
          if(!password){
        throw new error("email is reuired")
        }
       const user =  await User.findOne({email});
       if(!user){
        throw new error("user Not found");
       }
       const hashPassword = user.password;
      const isMatch =  await bcrypt.compare(password,hashPassword);
      if(!isMatch){
        throw new Error("invalid credentials")
      }
       const token = await jwt.sign({id:user._id},"ScretKey");

      res.cookie("token", token, {
      expires: new Date(Date.now() + 8 * 3600000),
    });
    res.status(200).send(user);
        
    } catch (error) {
        res.status(400).send(error.message);
    }
})
authRouter.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "Lax", 
    secure: false,   
  });
  return res.status(200).json({ message: "Logged out successfully" });
});

module.exports = authRouter;