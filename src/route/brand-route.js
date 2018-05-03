'use strict';

import { Router } from 'express';
import bodyParser from 'body-parser';
import HttpErrors from 'http-errors';
import Brand from '../model/brand';
import logger from '../lib/logger';

const jsonParser = bodyParser.json();

const brandRouter = new Router();

brandRouter.post('api/brand', jsonParser, (request, response, next) => {
  if (!request.body.brandName || !request.body.originCountry) {
    return next(new HttpErrors(400, 'Responding with a 400 error code'));
  }
  return new Brand(request.body).save()
    .then((brand) => {
      logger.log(logger.INFO, 'POST - responding with a 200 status code');
      return response.json(brand);
    })
    .catch(next);
});

brandRouter.get('api/brand/:id?', (request, response, next) => {
  return Brand.findById(request.params.id)
    .then((brand) => {
      if (!brand) {
        return next(new HttpErrors(404, 'Responding with a 404 error code'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(brand);
    })
    .catch(next);
});

brandRouter.get('api/brand', (request, response, next) => {
  return Brand.find() 
    .then((brands) => {
      if (!brands) {
        return next(new HttpErrors(404, 'Responding with a 404 error code'));
      }
      logger.log(logger.INFO, 'GET - responding with a 200 status code');
      return response.json(brands);
    })
    .catch(next);
});

brandRouter.delete('/api/brand:id?', (request, response, next) => {
  return Brand.findByIdAndRemove(request.params.id)
    .then((brandToDelete) => {
      if (!brandToDelete) {
        return next(new HttpErrors(404, 'Responding with a 404 error code'));
      }
      logger.log(logger.INFO, 'DELETE - 204 code for successful delete operation');
      return response.sendStatus(204);
    })
    .catch(next);
});

brandRouter.put('/api/brand/:id?', jsonParser, (request, response, next) => {
  const options = { runValidators: true, new: true };

  return Brand.findByIdAndUpdate(request.params.id, request.body, options) 
    .then((brandToUpdate) => {
      if (!brandToUpdate) {
        return next(new HttpErrors(404, 'Responding with a 404 error code'));
      }
      logger.log(logger.INFO, 'PUT - 200 code for successful update');
      return response.json(brandToUpdate);
    })
    .catch(next);
});

export default brandRouter;
