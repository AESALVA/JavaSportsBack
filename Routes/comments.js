const router = require("express").Router();
const Comment = require("../models/comment");
const { body, validationResult } = require('express-validator');


router
  .get("/all", async (req, res) => {
    console.log("GET /comments/all");

    try {
      const allComments = await Comment.find();
      res.status(200).json(allComments);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })
  .post("/newComment", body("comment").matches("^[a-zA-Z ]*$").isLength({ min: 4, max: 100 }), async (req, res) => {
    console.log("POST /comments/newComment");
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array(), message:"validation error" });
    }

    const { body } = req;

    try {
      const newComment = new Comment(body);
      await newComment.save();
      res.status(200).json(newComment);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })
  .put("/update/:id", async (req, res) => {
    console.log("PUT /comments/update");
    const { id } = req.params;
    const { body } = req;

    try {
      const modComment = await Comment.findByIdAndUpdate(id, body, {
        useFindAndModify: false,
      });
      res.status(200).json(modComment);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  })
  .delete("/delete/:id", async (req, res) => {
    const { id } = req.params;
    console.log("DELETE /comments/delete");
    try {
      const delComment = await Comment.findOneAndDelete({ _id: id });
      res.status(200).json(delComment);
    } catch (error) {
      res.status(400).json({ error: true, message: error });
    }
  });

module.exports = router;
