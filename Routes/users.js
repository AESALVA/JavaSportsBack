const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require('bcryptjs');

router
  .get("/all", async (req, res) => {
    console.log("GET /users/all");

    try {
      const allUsers = await User.find();
      res.status(200).json(allUsers);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })
  .post("/login", async (req, res) => {
    const { body } = req;
    const user = await User.findOne({ name: body.name });
    const passOK = await bcrypt.compare(body.password, user.password);

    if (user && passOK) {
      return res.status(200).json({
        error: null,
        role: user.role,
        message: "User and password OK",
      });
    } else {
      return res.status(400).json({
        error: true,
        message: "Wrong Credentials",
      });
    }
  })
  .post("/register", async (req, res) => {
    console.log("POST /users/register");
    const { body } = req;

    const newUserName = await User.findOne({
      name: body.name,
    });

    const newUserMail = await User.findOne({
      mail: body.mail,
    });

    if (newUserName || newUserMail) {
      return res.status(400).json({
        error: true,
        message: "User or email already exists",
      });
    }
    // bcrypt
    const salt = await bcrypt.genSalt(6);
    const encrytedPassword = await bcrypt.hash(body.password, salt);

    try {
      const newUser = new User({
        name: body.name,
        mail: body.mail,
        password: encrytedPassword,
        role:"user",
      });
      await newUser.save();
      newUser.password = body.password;
      res.status(200).json(newUser);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })
  .put("/update/:username", async (req, res) => {
    console.log("PUT /users/update");
    const { body } = req;
    const { username } = req.params;
    try {
      const modUser = await User.findOneAndUpdate(username, body, {
        useFindAndModify: false,
      });
      res.status(200).json(modUser);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })
  .delete("/delete/:username", async (req, res) => {
    const { username } = req.params;
    const { body } = req;
    console.log("DELETE /users/delete"+ body.role);
    console.log(body.role);
    const SUPER_USER = "admin";
    if (body.role === SUPER_USER) {
      return res.status(400).json({
        error: true,
        message: "This user cannot be erased!",
      });
    }

    try {
      const delUser = await User.findOneAndDelete({ name: username });
      res.status(200).json(delUser);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  });

module.exports = router;
