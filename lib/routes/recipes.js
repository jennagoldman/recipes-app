const { Router } = require('express');
const Recipe = require('../models/Recipe');
const Event = require('../models/Event');

module.exports = Router()
  .post('/', (req, res) => {
    Recipe
      .create(req.body)
      .then(recipe => res.send(recipe));
  })

  // SELECT name FROM recipes;
  .get('/', (req, res) => {
    Recipe
      .find()
      .select({ name: true })
      .then(recipes => res.send(recipes));
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      // the recipe that is want
      Recipe
        .findById(req.params.id),
      // all events associated with a recipe
      Event
        .find({ recipeId: req.params.id })
    ])
      .then(([recipe, events]) => {
        // res.send(recipe) -> res.send(recipe.toJSON());
        console.log({ ...recipe.toJSON(), events });
        res.send({ ...recipe.toJSON(), events });
      })
      .catch(next);
  })

  .patch('/:id', (req, res) => {
    Recipe
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(recipe => res.send(recipe));
  })

  .delete('/:id', (req, res) => {
    Promise.all([
      // delete recipe
      Recipe
        .findByIdAndDelete(req.params.id),
      // delete all events associated with recipe
      Event
        .deleteMany({ recipeId: req.params.id })
    ])
      // Promise.all returns an
      // array with [recipe, deletedEvents]
      // we only care about recipe so we destructure it
      .then(([recipe]) => res.send(recipe));
  });
