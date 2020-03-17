const { Router } = require('express');
const Recipe = require('../models/Recipe');

module.exports = Router()
  .post('/', (req, res, next) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Recipe
      .findById(req.params.id)
      .then(recipe => res.send(recipe))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Recipe
      .find()
      .select({ name: true })
      .then(recipes => res.send(recipes))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Recipe
      .findByIdAndDelete(req.params.id)
      .then(recipe => res.send(recipe))
      .catch(next);
  });
