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
    set: (v) => v * 100,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    maxlength: 50,
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
      default: 0,
    },
    totalRevenue: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
      set: (v) => v * 100,
      default: 0,
    },
    totalExpenses: {
      type: mongoose.Types.Currency,
      currency: "USD",
      get: (v) => v / 100,
      set: (v) => v * 100,
      default: 0,
    },
    monthlyData: [monthSchema],
    transactions: [transactionSchema],
  },
  { timestamps: true, toJSON: { getters: true } }
);

// Pre-save hook to calculate totalRevenue and totalExpenses
AccountSchema.pre("save", function (next) {
  const account = this;
  let totalRevenue = 0;
  let totalExpenses = 0;

  account.monthlyData.forEach((month) => {
    totalRevenue += month.revenue;
    totalExpenses += month.expenses;
  });

  account.totalRevenue = totalRevenue;
  account.totalExpenses = totalExpenses;

  next();
});

const Account = mongoose.model("Account", AccountSchema);

export default Account;
