const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema ({
    categories: String,
        title: String,
        img: String,
        imgTitle: String,
        description: String,
        imgTwo: String,
        synopsis: String,
         
});

const Article = mongoose.model('Articles', articleSchema);

module.exports = Article;

