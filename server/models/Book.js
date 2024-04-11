const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: 'This field is required.'
  },
  description: {
    type: String,
    required: 'This field is required.'
  },
  email: {
    type: String,
    required: 'This field is required.'
  },
  ulasan: {
    type: Array,
    required: 'This field is required.'
  },
  category: {
    type: String,
    enum: ['Teknologi', 'Fiksi', 'Horor'],
    required: 'This field is required.'
  },
  image: {
    type: String,
    required: 'This field is required.'
  },
});

bookSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);