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


app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});

