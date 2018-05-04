'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpError from 'http-errors';
import logger from '../lib/logger';
import Motorcycle from '../model/motorcycle';

const jsonParser = bodyParser.json();
const motorcycleRouter = new Router();

motorcycleRouter.post('/api/motorcycle', jsonParser, (request, response, next) => {
  // validation here

  return new Motorcycle(request.body).save()
    .then((card) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      response.json(card);
    })
    .catch(next);
  // .catch(error => next(error)); // Line 17 and 18 are equivalent
});

motorcycleRouter.put('/api/motorcycle/:id', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Motorcycle.findByIdAndUpdate(request.params.id, request.body, options)
    .then((updatedMotorcycle) => {
      if (!updatedMotorcycle) {
        logger.log(logger.INFO, 'PUT - responding with a 404 status code');
        return next(new HttpError(404, 'motorcycle not found'));
      }
      logger.log(logger.INFO, 'PUT - responding with a 200 status code');
      return response.json(updatedMotorcycle); // Vinicio - Returns a 200
    })
    .catch(next);
});

export default motorcycleRouter;
