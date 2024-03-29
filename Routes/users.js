const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const nodemailer = require("nodemailer");
const process = require("process");
require("dotenv").config();

router
  .get("/all", async (req, res) => {
    console.log("GET /users/all");
    let Users = [];
    try {
      const allUsers = await User.find();
      allUsers.map((users) => {
        user = { name: users.name, role: users.role, mail:users.mail };
        Users = [...Users, user];
      });
      res.status(200).json(Users);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })
  .post("/login", async (req, res) => {
    const { body } = req;

    const user = await User.findOne({ name: body.name });
    if (!user) {
      return res.status(400).json({
        error: true,
        message: "User not found",
      });
    }
    const passOK = await bcrypt.compare(body.password, user.password);
    if (!passOK) {
      return res
        .status(400)
        .json({ error: true, message: "Wrong Credentials" });
    }

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
  .post(
    "/register",
    body("name").matches("^[a-zA-Z ]*$").isLength({ min: 5, max: 36 }),
    body("mail").trim().notEmpty().isEmail(),
    body("password")
      .trim()
      .notEmpty()
      .isLength({ min: 8, max: 20 })
      .matches("^[0-9a-zA-Z]*$"),
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
        res.status(200).json("OK ADD NEW USER");
      } catch (error) {
        res.status(400).json({ error: true, message: error });
      }
    }
  )
  .put("/update/:id", async (req, res) => {
    console.log("PUT /users/update");
    const { body } = req;
    const { id } = req.params;
    const Admin_1 = "Eduardo";
    const Admin_2 = "Valentina";
    

    if (
      body.name === Admin_1 ||
      body.name === Admin_2
    ) {
      return res.status(400).json({
        error: true,
        message: "This user cannot be modified!",
      });
    }
    try {
      const modUser = await User.findByIdAndUpdate(id, body, {
        useFindAndModify: false,
      });
      res.status(200).json(modUser);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })
  .delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    const { body } = req;
    console.log("DELETE /users/delete" + body.role);

    const Admin_1 = "Eduardo";
    const Admin_2 = "Valentina";
    const SUPER_USER = "admin";

    if (
      body.role === SUPER_USER ||
      body.name === Admin_1 ||
      body.name === Admin_2
    ) {
      return res.status(400).json({
        error: true,
        message: "This user cannot be erased!",
      });
    }

    try {
      const delUser = await User.findOneAndDelete({ _id: id });
      res.status(200).json(delUser);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })
  .post("/forgotPassword", async (req, res) => {
    const { mail } = req.body;
    const Username = "eduardo_salva@hotmail.com";
    const Password = "Salva240387";

    const user = await User.findOne({ mail: mail });
    if (!user) {
      return res.status(400).json({ error: true, message: "user not found" });
    }

    try {
      const link = `https://java-sports.vercel.app/resetPassword`;
        
      let transporter = nodemailer.createTransport({
        host: "smtp-mail.outlook.com",
        secureConnection: false,
        secure: false,
        port:587,
        logger: true,
        debug: true,
        tls: {
          ciphers:'SSLv3',
          rejectUnauthorized: true
       },
        auth: {
          user: Username,
          pass: Password,
        },
      });
    let mailOptions = {
      from: 'eduardo_salva@hotmail.com',
      to: mail,
      subject: "Password Reset",
      text: `Hola ${
        user.name
      } JavaSports le envia el siguiente link para restablecer su contraseña ${" "}${link} y su clave Token es: ${
        user._id
      }`,
    };
    
   
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return res.status(401).json({message:'Error',error:error.message})
      } else {
        return res.status(200).json({message:"OK MAIL"})
      }
    });
    } catch (error) {
      return res.status(401).json({message:'Error',error:error.message})
    }
    
  })
  .post("/resetPassword/:id", async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    const { confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res
        .status(400)
        .json({ error: true, message: "passwords not match" });
    }

    const user = await User.findOne({ _id: id });

    if (!user) {
      return res.status(400).json({ error: true, message: "user not found" });
    }
    try {
      const salt = await bcrypt.genSalt(6);
      const encrytedPassword = await bcrypt.hash(password, salt);
      await User.updateOne(
        { _id: id },
        { $set: { password: encrytedPassword } }
      );
      res.status(200).json({ message: "New Password OK" });
    } catch (error) {
      res.status(400).json({ error: true, messaje: error });
    }
  }).post('/search', async(req,res)=>{
    console.log('POST /search');
    const {body}=req;
    try {
      const user = await User.findOne({name:body.name});
      res.status(200).json(user._id);
    } catch (error) {
      res.status(400).json({error:error.message});
    }
  })

module.exports = router;
