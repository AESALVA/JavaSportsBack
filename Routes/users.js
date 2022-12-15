const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

router
  .get("/all", async (req, res) => {
    console.log("GET /users/all");
    let Users = [];
    try {
      const allUsers = await User.find();
      allUsers.map((users) => {
        user = { name: users.name, role: users.role };
        Users = [...Users, user];
      });
      res.status(200).json(Users);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })
  .post("/login", async (req, res) => {
    const { body } = req;

    try {
      const user = await User.findOne({ name: body.name });
      const passOK = await bcrypt.compare(body.password, user.password);
      if (user && passOK) {
        return res.status(200).json({
          error: null,
          role: user.role,
          message: "User and password OK",
        });
      }
    } catch (error) {
      res.status(400).json({ error: true, message: error });
      if(!passOK){
        return res.status(400).json({error:true,message:"Wrong Credentials"});
      }
      if (!user) {
        return res.status(400).json({
          error: true,
          message: "User not found",
        });
      }
      return res.status(400).json({
        error: true,
        message: "Wrong Credentials",
      });
    }
  })
  .post(
    "/register",
    body("name").matches("^[a-zA-Z ]*$").isLength({ min: 5, max: 36 }),
    body("mail").trim().notEmpty().isEmail(),
    body("password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
      })
      .isLength({ min: 8, max: 20 })
      .matches("^[a-zA-Z ]*$"),
    async (req, res) => {
      console.log("POST /users/register");

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res
          .status(400)
          .json({ errors: errors.array(), message: "validation error" });
      }

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
          role: "user",
        });
        await newUser.save();
        newUser.password = body.password;
        res.status(200).json(newUser);
      } catch (error) {
        res.status(400).json({ error: true, message: error });
      }
    }
  )
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
    console.log("DELETE /users/delete" + body.role);

    const Admin_1 = "Eduardo";
    const Admin_2 = "Valentina";
    const SUPER_USER = "admin";

    if (
      body.role === SUPER_USER ||
      username === Admin_1 ||
      username === Admin_2
    ) {
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
