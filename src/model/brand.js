'use strict';

import mongoose from 'mongoose';

const brandSchema = mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  originCountry: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    unique: true,
    required: true,
  },
  dealers: {
    type: String,
  },
  model: [
    {
    type: mongoose.Schema.Types.ObjectId, ref: 'model',
  },
 ],
});

export default mongoose.model('brand', brandSchema);