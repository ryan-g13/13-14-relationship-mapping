'use strict';

import faker from 'faker';
import superagent from 'superagent';
import Brand from '../model/brand';
import { startServer, stopServer } from '../lib/server';

const apiURL = `http://localhost:${process.env.PORT}/api/brand`;

// Vinicio - the main reason to use mocks is the fact that we don't want to
// write a test that relies on both a POST and a GET request
const createBrandMock = () => {
  return new Brand({
    brandName: faker.lorem.words(10), // need to change and add new things to schema
    countryOrigin: faker.lorem.words(10),
    dealers: true,
    section: faker.lorem.words(8),
  }).save();
};

describe('/api/brand', () => {
  beforeAll(startServer); 
  afterAll(stopServer);
  afterEach(() => Brand.remove({}));
  test('POST - It should respond with a 200 status ', () => {
    const brandToPost = {
      brandName: faker.lorem.words(10), // need to change and add new things to schema
      countryOrigin: faker.lorem.words(10),
      dealers: true,
      section: faker.lorem.words(8),
    };
    return superagent.post(apiURL)
      .send(brandToPost)
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.brandName).toEqual(brandToPost.brandName);
        expect(response.body.countryOrigin).toEqual(brandToPost.countryOrigin);
        expect(response.body.dealers).toEqual(brandToPost.dealers);
        expect(response.body.section).toEqual(brandToPost.section);
        expect(response.body._id).toBeTruthy();
      });
  });
  test('POST - It should respond with a 400 status ', () => {
    const brandToPost = {
      brand: faker.lorem.words(50),
    };
    return superagent.post(apiURL)
      .send(brandToPost)
      .then(Promise.reject) // Vinicio - this is needed because we are testing for failures
      .catch((response) => {
        // Vinicio - testing status code
        expect(response.status).toEqual(400);
      });
  });

  describe('GET /api/brand', () => {
    test('should respond with 200 if there are no errors', () => {
      // const motorcycleToTest = null; 
      return superagent.get(`${apiURL}`)
        .then((response) => {
          expect(response.status).toEqual(200);
        // expect(response.body); ?? expect array as a response
        });
    });
    // test('should respond with 404 if there is no motorcycle to be found', () => {
    //   return superagent.get(`${apiURL}/InvalidIdSubmitted`)
    //     .then(Promise.reject) // Vinicio - testing for a failure
    //     .catch((response) => {
    //       expect(response.status).toEqual(404);
    //     });
    // });
  });


  describe('GET /api/brand:id', () => {
    test('should respond with 200 if there are no errors', () => {
      let brandToTest = null; //  We need to preserve the motorcycle because 
      // of scope rules
      return createBrandMock() 
        .then((brand) => {
          brandToTest = brand;
          return superagent.get(`${apiURL}/${brand._id}`);
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.brandName).toEqual(brandToTest.brandName);
          expect(response.body.countryOrigin).toEqual(brandToTest.countryOrigin);
          expect(response.body.dealers).toEqual(brandToTest.dealers);
          expect(response.body.section).toEqual(brandToTest.section);
        });
    });
    test('should respond with 404 if there is no brand to be found', () => {
      return superagent.get(`${apiURL}/InvalidIdSubmitted`)
        .then(Promise.reject) // Vinicio - testing for a failure
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('DELETE /api/brand:id', () => {
    test('should respond with 404 if there is no ID in query', () => {
      // let motorcycleToTest = null; //  dummy variable to allow for extra scope for motorcycle
      return superagent.delete(apiURL) 
        .then(() => {})
        .catch((error) => {
          expect(error.status).toEqual(404);
        });
    });
    test('should respond with 204 if the item has been deleted successfully', () => {
      // let motorcycleToTest = null; //  dummy variable to allow for extra scope for motorcycle
      return createBrandMock()
        .then((brand) => {
          return superagent.delete(`${apiURL}/${brand._id}`);
        }).then((response) => {
          expect(response.status).toEqual(204);
        });
    });
    test('should respond with 404 if there is no brand to be found', () => {
      return superagent.delete(`${apiURL}/InvalidIdSubmitted`)
        .then((Promise.reject)) // Vinicio - testing for a failure
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
  });
  describe('PUT /api/brand/:id?', () => {
    test('should respond with a 200 if there are no errors.', () => {
      let brandToTest = null; //  We need to preserve the motorcycle because 
      // of scope rules
      return createBrandMock() 
        .then((brand) => {
          brandToTest = brand;
          return superagent.put(`${apiURL}/${brand._id}`)
            .send({ model: 'samantha' });
        })
        .then((response) => {
          expect(response.status).toEqual(200);
          expect(response.body.section).toEqual('samantha');
          expect(response.body.brandName).toEqual(brandToTest.brandName);
          expect(response.body.countryOrigin).toEqual(brandToTest.countryOrigin);
          expect(response.body.dealers).toEqual(brandToTest.dealers);
        });
    });
    test('should respond with 404 if there is no brand to be found', () => {
      return superagent.put(`${apiURL}/InvalidIdSubmitted`)
        .then(Promise.reject) // Vinicio - testing for a failure
        .catch((response) => {
          expect(response.status).toEqual(404);
        });
    });
    test('should return 400 error if invalid content is passed to validation stage', () => {
      return createBrandMock()
        .then((brand) => {
          return superagent.put(`${apiURL}/${brand._id}`)
            .send({ model: '' });
        })
        .then(Promise.reject)
        .catch((response) => {
          expect(response.status).toEqual(400); 
        });
    });
  });
});
