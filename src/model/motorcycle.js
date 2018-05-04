'use strict'; 

'use strict';

import mongoose from 'mongoose';
import HttpError from 'http-errors';
import Brand from './brand';

const motorcycleSchema = mongoose.Schema({
  model: {
    type: String,
    required: true,
    unique: true,
  },
  modelYear: {
    type: String,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId, // Vinicio - this is _id
    required: true,
    ref: 'brand',
  },
});

/* A mongoose hook needs access to
  - a done() function
  - the object we are working with (mongoose calls this 'document')
*/
function motorcyclePreHook(done) { // done is using an (error,data) signature
  // Vinicio - here, the value of 'contextual this' is the document
  return Brand.findById(this.brand)
    .then((brandFound) => {
      if (!brandFound) {
        throw new HttpError(404, 'brand was not found');
      }
      brandFound.motorcycles.push(this._id);
      return brandFound.save();
    })
    .then(() => done()) // done without any arguments mean success - save
    .catch(done); // done with results means an error - do not save
}

// Vinicio - done has an (error, data) signature
const motorcyclePostHook = (document, done) => {
  return Brand.findById(document.brand)
    .then((brandFound) => {
      if (!brandFound) {
        throw new HttpError(500, 'brand was not found');
      }
      brandFound.cards = brandFound.cards.filter((motorcycle) => {
        return motorcycle._id.toString() !== document._id.toString();
      });
    })
    .then(() => done()) // Vinicio - this implies a success
    .catch(done); // Vinicio - this is being called as done(result);
  // .catch(result => done(result));
};

motorcycleSchema.pre('save', motorcyclePreHook);
motorcycleSchema.post('remove', motorcyclePostHook);

export default mongoose.model('motorcycle', motorcycleSchema);
