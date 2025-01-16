import mongoose, { Document, Schema, Model, CallbackError } from 'mongoose';
import bcrypt from 'bcrypt';

// Interface for User methods
interface IUserMethods {
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Interface for User document
interface IUser extends Document {
  _id: mongoose.Types.ObjectId; // Add explicit typing for _id
  name: string;
  email: string;
  password?: string;
  isAdmin: boolean;
  userId: string; // Virtual field
  createdAt: Date;
  updatedAt: Date;
}

// Combine the base interface with methods
type UserDocument = IUser & IUserMethods;

// Type for the User model
type UserModel = Model<UserDocument, {}, IUserMethods>;

const UserSchema = new Schema<UserDocument, UserModel>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters long'],
      maxlength: [20, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string): boolean {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: (props: { value: string }) =>
          `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Virtual field for userId based on _id
UserSchema.virtual('userId').get(function (this: UserDocument): string {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

// Pre-save hook to hash password
UserSchema.pre(
  'save',
  async function (this: UserDocument, next: (err?: CallbackError) => void) {
    if (!this.isModified('password')) return next();

    try {
      const salt = await bcrypt.genSalt(10);
      if (this.password) {
        this.password = await bcrypt.hash(this.password, salt);
      }
      next();
    } catch (error) {
      next(error as CallbackError);
    }
  }
);

// Method to compare password
UserSchema.methods.comparePassword = async function (
  this: UserDocument,
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

// Create and export the model
const User = mongoose.model<UserDocument, UserModel>('User', UserSchema);
export default User;
