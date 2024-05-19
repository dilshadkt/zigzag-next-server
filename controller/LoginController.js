const jwt = require("jsonwebtoken");
const verifyLogin = async (req, res) => {
  const { email, password } = req.body;
  // user data
  const data = {
    username: "jubair@gmail.com",
    password: "12345",
  };
  if (email === data.username && password === data.password) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ token });
  } else {
    res.status(403).send("access denied");
  }
};
module.exports = { verifyLogin };
