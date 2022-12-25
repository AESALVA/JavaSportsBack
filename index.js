const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const { body, validationResult } = require('express-validator');
let cors = require('cors')
const MOCK = require('./Mocks/Mocks');


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

app.route('/test').get((req,res)=>{
    const allArticles = MOCK;
    console.log('get');
    res.json(allArticles);
}).post((req, res)=>{
res.json(req.body);
})


app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});




app.post("/forgotPassword", async (req,res)=>{
  const {mail} = req.body;
  const Username = process.env.ADMIN_USERNAME;
  const Password = process.env.ADMIN_PASS;
  
  try {
    const user = await User.findOne({mail:mail});
    if(!user){
      return res.status(400).json({error:true, message:"user not found"})
    }
  const link = `https://java-sports.vercel.app/resetPassword`;
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: Username,
      pass: Password,
    },
  })
return res.status(202).json(transporter)
  } catch (error) {
    res.status(402).json(console.log(error))
    console.log(error)
  }
})


