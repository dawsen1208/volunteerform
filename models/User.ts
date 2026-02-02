import mongoose, { Schema, Model } from 'mongoose';

export interface IUser {
  phone: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  phone: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Update timestamp on save
UserSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const User: Model<IUser> = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

export default User;
