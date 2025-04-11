const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  id: String,
  code: String,
  name: String,
  continent: String,
  wikipedia_link: String,
  keywords: String
});

const Country = mongoose.model('Country', countrySchema);

module.exports = Country;