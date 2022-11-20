const router = require("express").Router();
const User = require('../models/user');

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
  .get("/login", async (req, res) => {
    const { id } = req.params;

    try {
      const user = await User.findOne({ _id: id });
      res.status(200).json(article);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  }).post('/new', async(req,res)=>{
    console.log('POST /arcticles/new');
    const {body}= req;
    try {
        const newArticle = new Article(body);
        await newArticle.save();
        res.status(200).json(newArticle);
    } catch (error) {
        res.status(400).json({ error: true, message: error });
    }

  } ).put('/update/:id', async(req,res)=>{
    console.log('PUT /arcticles/update');
    const { body }= req;
    const { id }=req.params;
    try {
        const modArticle = await Article.findOneAndUpdate(id,body,{useFindAndModify: false});
        res.status(200).json(modArticle);
    } catch (error) {
        res.status(400).json({ error: true, message: error });
    }

  } ).delete('/delete/:id', async (req,res)=>{
    const {id}= req.params;
    console.log('DELETE /articles/delete');
    try {
        const delArticle = await Article.findOneAndDelete({_id:id});
        res.status(200).json(delArticle)
    } catch (error) {
        res.status(400).json({ error: true, message: error });

    }
  })





module.exports = router;
