import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);

const ProductSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
    },
    price: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
      set: (v) => v * 100,
    },
    expense: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
      set: (v) => v * 100,
    },
    inStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

const Product = mongoose.model("Product", ProductSchema);

export default Product;
