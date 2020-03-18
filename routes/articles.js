const express = require('express');
const router = express.Router();
const path = require('path');
const Article = require(path.join(__dirname, '../models/article'));

//Main page
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find({}).sort({createdAt: -1});
    res.render('index', {
      articles: articles
    });
  } catch(err){
    console.log(err);
  }
});

//New article page
router.get('/articles/new', (req, res) => {
  res.render('articles/new', {article: new Article()});
});

//Item article
router.get('/articles/:slug', async (req, res) => {
  const slug = req.params.slug;
  try {
    const article = await Article.findOne({
      slug: slug
    });
    if (article === null){
      res.redirect('/');
    } else {
      res.render('articles/show', {
        article: article
      });
    }
  } catch(err){
    console.log(err);
  }
});


//new article
router.post('/articles', async (req, res, next) => {
  req.article = new Article();
  next();
}, saveAndRedirect());

//Delete article
router.delete('/articles/:id', async (req, res) => {
  try {
    await Article.findOneAndDelete(req.params.id);
    res.redirect('/');
  } catch(err){
    console.log(err);
  }
});

//Edit item article page
router.get('/articles/edit/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.render('articles/edit', {article: article});
  }catch(err){
    console.log(err);
  }
});

//Update item article
router.put('/articles/edit/:id', async (req, res, next) => {
  req.article = await Article.findById(req.params.id);
  next();
}, saveAndRedirect());

function saveAndRedirect(){
  return async (req, res) => {
    let article = req.article;
    const {title, description, markdown} = req.body;
    article.title = title;
    article.description = description;
    article.markdown = markdown;
    try {
      await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch(err){
      console.log(err);
    }
  }
}

module.exports = router;