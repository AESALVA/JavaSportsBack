const express = require('express');
const app = express();
let cors = require('cors')
const MOCK = require('./Mocks/Mocks');
app.use(cors());
app.use(express.json());
require('dotenv').config();


const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log('Server running on port ' + PORT);
  });


app.get('/articles', (req, res)=>{
    const allArticles = MOCK;
    console.log('get');
    res.json(allArticles);
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
    res.send(allArticles);
}).post((req, res)=>{
res.json(req.body);
})
