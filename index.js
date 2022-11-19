const express = require('express');
const app = express();
const mongoose = require('mongoose');

const user = 'java';
const pass = 'kTVp1Z8ualejZbLI';
const db = 'javaSports';
const uri = `mongodb+srv://${user}:${pass}@cluster1.9n3m6mo.mongodb.net/${db}?retryWrites=true&w=majority`;


mongoose.connect(uri, {
  useNewUrlParser : true,
  useUnifiedTopology : true,
}).then(()=>{console.log('database connection OK')}).catch((error)=>{console.error(error)});

const Article = require('./models/article');

let cors = require('cors')
const MOCK = require('./Mocks/Mocks');
app.use(cors());
app.use(express.json());
require('dotenv').config();


const PORT = process.env.PORT || 8000;



app.get('/articles', async (req, res)=>{
    const allArticles = await Article.find();
    console.log('get');
    console.log(allArticles)
    res.status(200).json(allArticles);
})

app.post('/comments', (req, res)=>{
  const { body } = req;
  console.log('post comments');
  res.status(200).json(body)
})  

app.get('/article/:id',(req,res)=>{
    const { id } = req.params;
const article = MOCK.find(a=>a.id === id);
res.status(200).json(article);
})

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