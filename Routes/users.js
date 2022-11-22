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
  .get("login/:username", async (req, res) => {
    const { username } = req.params;

    try {
      const user = await User.findOne({ name: username });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  }).post('/register', async(req,res)=>{
    console.log('POST /users/register');
    const {body}= req;

    const newUserName = await User.findOne({
        name: body.name,
      });
  
      const newUserMail = await User.findOne({
        mail: body.mail,
      });

      if (newUserName || newUserMail) {
        return res.status(400).json({
          error: true,
          message: 'User or email already exists',
        });
      }




    try {
        const newUser = new User(body);
        await newUser.save();
        res.status(200).json(newUser);
    } catch (error) {
        res.status(400).json({ error: true, message: error });
    }

  } ).put('/update/:username', async(req,res)=>{
    console.log('PUT /users/update');
    const { body }= req;
    const { username }=req.params;
    try {
        const modUser = await User.findOneAndUpdate(username,body,{useFindAndModify: false});
        res.status(200).json(modUser);
    } catch (error) {
        res.status(400).json({ error: true, message: error });
    }

  } ).delete('/delete/:username', async (req,res)=>{
    const {username}= req.params;
    console.log('DELETE /users/delete');

    const SUPER_USER = 'Javasports';
    if (username === SUPER_USER) {
      return res.status(400).json({
        error: true,
        message: 'This user cannot be erased!',
      });
    }


    try {
        const delUser = await User.findOneAndDelete({name:username});
        res.status(200).json(delUser)
    } catch (error) {
        res.status(400).json({ error: true, message: error });

    }
  })





module.exports = router;
