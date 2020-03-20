require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Event = require('../lib/models/Event');
const Recipe = require('../lib/models/Recipe');

describe('event routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates an event', () => {
    return Recipe.create({
      name: 'cookies',
      ingredients: [
        { name: 'flour', amount: 1, measurement: 'cup' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    })
      .then(recipe => {
        return request(app)
          .post('/api/v1/events')
          .send({
            recipeId: recipe.id,
            dateOfEvent: Date.now(),
            notes: 'It went well',
            rating: 4
          });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: expect.any(String),
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });

  it('gets all events', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [
        { name: 'flour', amount: 1, measurement: 'cup' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const events = await Event.create([
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 2 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 3 },
      { recipeId: recipe.id, dateOfEvent: Date.now(), rating: 5 },
    ]);

    return request(app)
      .get('/api/v1/events')
      .then(res => {
        events.forEach(event => {
          expect(res.body).toContainEqual(JSON.parse(JSON.stringify(event)));
        });
      });
  });

  it('gets an event by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [
        { name: 'flour', amount: 1, measurement: 'cup' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const event = await Event.create({
      recipeId: recipe.id,
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .get(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          // whole recipe here because we populate in route
          recipeId: {
            _id: expect.any(String),
            name: 'cookies',
            ingredients: [
              { _id: expect.any(String),
                name: 'flour', 
                amount: 1, 
                measurement: 'cup',
                id: expect.any(String) }
            ],
            directions: [
              'preheat oven to 375',
              'mix ingredients',
              'put dough on cookie sheet',
              'bake for 10 minutes'
            ],
            id: expect.any(String),
            __v: 0
          },
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0,
          day: expect.any(Number),
          month: expect.any(Number),
          year: expect.any(Number),
          id: expect.any(String)
        });
      });
  });

  it('updates an event by id', async() => {
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [
        { name: 'flour', amount: 1, measurement: 'cup' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const event = await Event.create({
      recipeId: recipe.id,
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .patch(`/api/v1/events/${event._id}`)
      .send({ rating: 5 })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 5,
          __v: 0
        });
      });
  });

  it.skip('deletes an event by id', async() => {
    // return Recipe.create({
    //   name: 'cookies',
    //   ingredients: [
    //     { name: 'flour', amount: 1, measurement: 'cup' }
    //   ],
    //   directions: [
    //     'preheat oven to 375',
    //     'mix ingredients',
    //     'put dough on cookie sheet',
    //     'bake for 10 minutes'
    //   ],
    // })
    //   .then(recipe => {
    //     return Event.create({
    //       recipeId: recipe.id,
    //       dateOfEvent: Date.now(),
    //       notes: 'It went well',
    //       rating: 4
    //     });
    //   })
    //   .then(event => {
    //     return request(app)
    //       .delete(`/api/v1/events/${event._id}`);
    //   })
    //   .then(res => {
    //     expect(res.body).toEqual({
    //       _id: expect.any(String),
    //       recipeId: recipe.id,
    //       dateOfEvent: expect.any(String),
    //       notes: 'It went well',
    //       rating: 4,
    //       __v: 0
    //     });
    //   });
    const recipe = await Recipe.create({
      name: 'cookies',
      ingredients: [
        { name: 'flour', amount: 1, measurement: 'cup' }
      ],
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const event = await Event.create({
      recipeId: recipe.id,
      dateOfEvent: Date.now(),
      notes: 'It went well',
      rating: 4
    });

    return request(app)
      .delete(`/api/v1/events/${event._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          recipeId: recipe.id,
          dateOfEvent: expect.any(String),
          notes: 'It went well',
          rating: 4,
          __v: 0
        });
      });
  });
});
