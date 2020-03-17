const { Router } = require('express');
const Event = require('../models/Event');

module.exports = Router()
  .post('/', (req, res, next) => {
    Event
      .create(req.body)
      .then(event => res.send(event))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Event
      .findById(req.params.id)
      .then(event => res.send(event))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Event
      .find()
      .select({ name: true })
      .then(events => res.send(events))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Event
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(event => res.send(event))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Event
      .findByIdAndDelete(req.params.id)
      .then(event => res.send(event))
      .catch(next);
  });
