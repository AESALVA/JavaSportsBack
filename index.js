const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const { body, validationResult } = require('express-validator');

mongoose.connect(process.env.DB_URI, {
  useNewUrlParser : true,
  useUnifiedTopology : true,
}).then(()=>{console.log('database connection OK')}).catch((error)=>{console.error(error)});


let cors = require('cors')
const MOCK = require('./Mocks/Mocks');

const whiteList = ["https://java-sports-gzlgjzxt2-aesalva.vercel.app"]
app.use(cors({origin:whiteList}));
let corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
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