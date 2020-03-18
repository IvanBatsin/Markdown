const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurifier = require('dompurify');
const {JSDOM} = require('jsdom');
const dompurify = createDomPurifier(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  markdown: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  sanitizeHTML: {
    type: String,
    required: true
  }
});
articleSchema.set('toJSON', {virtuals: true});

articleSchema.pre('validate', function (next){
  if (this.title){
    this.slug = slugify(this.title, {
      lower: true,
      strict: true
    });
  }

  if (this.markdown){
    this.sanitizeHTML = dompurify.sanitize(marked(this.markdown));
  }
  next();
});
module.exports = mongoose.model('article', articleSchema);