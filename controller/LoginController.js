const verifyLogin = async (req, res) => {
  const data = {
    username: "jubair123",
    password: "12345",
  };
  if (
    req.body.username === data.username &&
    req.body.password === data.password
  ) {
    res.status(200).send("successfully loged");
  } else {
    res.status(403).send("access denied");
  }
};
module.exports = { verifyLogin };
