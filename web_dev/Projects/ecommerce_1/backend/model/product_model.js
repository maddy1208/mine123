import mongoose from "mongoose";

const product_db_schema = new mongoose.Schema({
  name: {
    type: mongoose.SchemaTypes.String,
    required: [true, "Please enter product name"],
  },
  description: {
    type: mongoose.SchemaTypes.String,
    required: [true, "Please enter product description"],
  },
  price: {
    type: mongoose.SchemaTypes.Number,
    required: [true, "Please enter product price"],
  },
  rating: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },
  img: [
    {
      public_id: { type: mongoose.SchemaTypes.String },
      url: { type: mongoose.SchemaTypes.String },
    },
  ],
  category: {
    type: mongoose.SchemaTypes.String,
    required: [true, "Please enter category"],
  },
  stock: {
    type: mongoose.SchemaTypes.Number,
    default: 1,
  },
  number_of_reviews: {
    type: mongoose.SchemaTypes.Number,
    default: 0,
  },
  reviews: [
    {
      name: { type: mongoose.SchemaTypes.String },
      rating: { type: mongoose.SchemaTypes.Number },
      comment: { type: mongoose.SchemaTypes.String },
    },
  ],
  user:{
    type:mongoose.SchemaTypes.ObjectId,
    ref: "user",
    required: true
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default  mongoose.model("product", product_db_schema);
