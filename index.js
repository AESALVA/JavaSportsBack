const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
let cors = require('cors')
const MOCK = require('./Mocks/Mocks');
const nodemailer = require("nodemailer");



app.use(cors({origin:"*"}));

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser : true,
  useUnifiedTopology : true,
}).then(()=>{console.log('database connection OK')}).catch((error)=>{console.error(error)});



app.use(express.json());
require('dotenv').config();


const PORT = process.env.PORT || 8000;


const articlesRoutes = require('./Routes/articles');
app.use('/articles', articlesRoutes)
const usersRoutes = require('./Routes/users');
app.use('/users', usersRoutes) 
const commentsRoutes = require('./Routes/comments');
app.use('/comments', commentsRoutes)


app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});


app.post("/forgotPassword", async (req, res) => {
  const { mail } = req.body;
  const Username = process.env.ADMIN_USERNAME;
  const Password = process.env.ADMIN_PASS;

  const user = await User.findOne({ mail: mail });
  if (!user) {
    return res.status(400).json({ error: true, message: "user not found" });
  }

  try {
    const link = `https://java-sports.vercel.app/resetPassword`;
  
  let mailOptions = {
    from: Username,
    to: mail,
    subject: "Password Reset",
    text: `Hola ${
      user.name
    } JavaSports le envia el siguiente link para restablecer su contraseña ${" "}${link} y su clave Token es: ${
      user._id
    }`,
  };
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: Username,
      pass: Password,
    },
  });
  console.log(transporter)
  return res.status(200).json({message:"testing"})
  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //           return res.status(401).json({message:'Error',error:error,info:info.err})
  //   } else {
  //     return res.status(200),json({message:"OK MAIL",info:info})
  //   }
  // });
  } catch (error) {
    return res.status(401).json({message:'Error',error:error,info:info.err})
  }
  
})
