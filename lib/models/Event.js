const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    required: true
  },
  dateOfEvent: {
    type: Date,
    required: true
  },
  notes: String,
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  }
});

schema.virtual('day')
  .get(function() {
    return this.dateOfEvent.getDate();
  })
  .set(function(day) {
    this.dateOfEvent.setDate(day);
  });

schema.virtual('month')
  .get(function() {
    return this.dateOfEvent.getMonth();
  })
  .set(function(month) {
    this.dateOfEvent.setMonth(month);
  });

schema.virtual('year')
  .get(function() {
    return this.dateOfEvent.getFullYear();
  })
  .set(function(year) {
    this.dateOfEvent.setFullYear(year);
  });

module.exports = mongoose.model('Event', schema);
