import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface definition for Product
interface IProduct extends Document {
  userId: mongoose.Types.ObjectId;
  name?: string;
  price?: number;
  expense?: number;
  inStock: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition with proper typing
const ProductSchema = new Schema<IProduct>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
      currency: 'USD',
      get: (v: number): number => v / 100,
      set: (v: number): number => v * 100,
    },
    expense: {
      type: Number,
      currency: 'USD',
      get: (v: number): number => v / 100,
      set: (v: number): number => v * 100,
    },
    inStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true, toJSON: { getters: true } }
);

// Create and export the model with proper typing
const Product: Model<IProduct> = mongoose.model('Product', ProductSchema);
export default Product;
