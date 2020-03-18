const express = require('express');
const app = express();
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const config = require(__dirname + '/config.js');
const router = require(__dirname + '/routers');

//db
mongoose.connect(config.MONGO_URL, {
  useFindAndModify: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true
});
mongoose.set('debug', true);
mongoose.connection
  .on('open', () => console.log('DB is ready'))
  .on('error', () => console.log('DB has error'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(methodOverride('_method'));

//routers
app.use(router.articles);

//Error handler
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
});

app.listen(config.PORT, () => {
  console.log('we on air');
});