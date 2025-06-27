const jwt = require("jsonwebtoken");
const User = require("../models/user")

const authMiddleware = async(req, res, next) => {
  console.log("MIDDLEWARE HIT");
console.log("Cookies received:", req.cookies);
console.log("Token received:", req.cookies.token);

  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, "ScretKey");
   const {id} = decoded;

    //find the user
    const foundUser = await User.findById(id);
    if(!foundUser){
        throw new Error("User not found");
    }
    req.user = foundUser;
    next();
    
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware