import mongoose from "mongoose";
import { loadType } from "mongoose-currency";

const Schema = mongoose.Schema;
loadType(mongoose);

const monthSchema = new Schema(
  {
    month: String,
    revenue: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
      set: (v) => v * 100,
    },
    expenses: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
      set: (v) => v * 100,
    },
  },
  { toJSON: { getters: true } }
);

const transactionSchema = new Schema({
  amount: {
    type: mongoose.Types.Currency,
    currency: "USD",
    get: (v) => v / 100,
    set: (v) => v * 100, // Added set to multiply by 100
    required: true,
  },
  type: {
    type: String, // e.g., revenue, expense
    required: true,
  },
  date: {
    type: String, // Date in format 'YYYY-MM-DD'
    required: true,
  },
  description: {
    type: String, // A brief description of the transaction
    required: true,
    maxlength: 20,
  },
});
const AccountSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    currentBalance: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
      set: (v) => v * 100,
      default: 1,
    },
    totalRevenue: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
      set: (v) => v * 100,
      default: 1,
    },
    totalExpenses: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
      set: (v) => v * 100,
      default: 1,
    },
    monthlyData: [monthSchema],
    transactions: [transactionSchema],
  },
  { timestamps: true, toJSON: { getters: true } }
);

const Account = mongoose.model("Account", AccountSchema);

export default Account;
