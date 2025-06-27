const validator = require("validator");

const validateSignupdata = (req) => {
  const { username, email, password } = req.body;

  if (!username) {
    throw new Error("Name is not valid");
  }
  if (!validator.isEmail(email)) {
    throw new Error("Email is not valid");
  }
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  }

  return true;
};

module.exports = {
  validateSignupdata,
};
