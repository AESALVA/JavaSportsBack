const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema ({
        comment: String,
        user: String,
        likes: Array,
        id: String, 
});





const Comment = mongoose.model('Comments', commentSchema);

module.exports = Comment;