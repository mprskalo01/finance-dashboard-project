import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface definitions
interface IMonth {
  month: string;
  revenue: number;
  expenses: number;
}

interface ITransaction {
  amount: number;
  type: string;
  date: string;
  description: string;
}

interface IAccount extends Document {
  userId: mongoose.Types.ObjectId;
  currentBalance: number;
  totalRevenue: number;
  totalExpenses: number;
  monthlyData: IMonth[];
  transactions: ITransaction[];
  createdAt: Date;
  updatedAt: Date;
}

// Schema definitions
const monthSchema = new Schema<IMonth>(
  {
    month: {
      type: String,
      required: true,
    },
    revenue: {
      type: Number,
      currency: 'USD',
      get: (v: number): number => v / 100,
      set: (v: number): number => v * 100,
    },
    expenses: {
      type: Number,
      currency: 'USD',
      get: (v: number): number => v / 100,
      set: (v: number): number => v * 100,
    },
  },
  { toJSON: { getters: true } }
);

const transactionSchema = new Schema<ITransaction>({
  amount: {
    type: Number,
    currency: 'USD',
    get: (v: number): number => v / 100,
    set: (v: number): number => v * 100,
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

const AccountSchema = new Schema<IAccount>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    currentBalance: {
      type: Number,
      currency: 'USD',
      get: (v: number): number => v / 100,
      set: (v: number): number => v * 100,
      default: 0,
    },
    totalRevenue: {
      type: Number,
      currency: 'USD',
      get: (v: number): number => v / 100,
      set: (v: number): number => v * 100,
      default: 0,
    },
    totalExpenses: {
      type: Number,
      currency: 'USD',
      get: (v: number): number => v / 100,
      set: (v: number): number => v * 100,
      default: 0,
    },
    monthlyData: [monthSchema],
    transactions: [transactionSchema],
  },
  { timestamps: true, toJSON: { getters: true } }
);

// Pre-save hook with proper typing
AccountSchema.pre('save', function (next) {
  const account = this as IAccount;
  let totalRevenue = 0;
  let totalExpenses = 0;

  account.monthlyData.forEach((month) => {
    totalRevenue += month.revenue || 0;
    totalExpenses += month.expenses || 0;
  });

  account.totalRevenue = totalRevenue;
  account.totalExpenses = totalExpenses;
  next();
});

// Create and export the model with proper typing
const Account: Model<IAccount> = mongoose.model('Account', AccountSchema);
export default Account;
