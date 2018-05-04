'use strict';

import express from 'express';
import mongoose from 'mongoose';
import logger from './logger';
import loggerMiddleware from './loggerMiddleware';
import errorMiddleware from './errorMiddleware';
import brandRoutes from '../route/brand-route';
import motorcycleRoutes from '../route/motorcycle-route';

const app = express();
let server = null;

// Middleware ordering 
app.use(loggerMiddleware);
app.use(brandRoutes);
app.use(motorcycleRoutes);
app.all('*', (request, response) => {
  logger.log(logger.INFO, 'Returning a 404 from the catch-all/default route');
  return response.sendStatus(404);
  // return next(new HttpErrors(404, ))
});
app.use(errorMiddleware);

// Start and stop methods for the server
const startServer = () => {
  return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      server = app.listen(process.env.PORT, () => {
        logger.log(logger.INFO,  `Server is listening on port ${process.env.PORT}`);
      });
    });
};

const stopServer = () => {
  return mongoose.disconnect()
    .then(() => {
      server.close(() => {
        logger.log(logger.INFO, 'Server is now off');
      });
    });
};

export { startServer, stopServer };
