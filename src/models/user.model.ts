// src/models/user.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { LocationInfo, UserRecord, UserRole } from "../types/user";

interface UserDoc extends Document {
  name: string;
  email: string;
  role: UserRole;
  location?: LocationInfo;
  passwordHash: string;
}

const LocationSchema = new Schema<LocationInfo>(
  {
    lat: { type: Number },
    lng: { type: Number },
    description: { type: String },
  },
  { _id: false }
);

const UserSchema = new Schema<UserDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: {
      type: String,
      enum: ["citizen", "government_officer", "contractor"],
      required: true,
    },
    location: { type: LocationSchema },
    passwordHash: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const UserModel: Model<UserDoc> =
  mongoose.models.User || mongoose.model<UserDoc>("User", UserSchema);

export const userModel = {
  async create(user: UserRecord): Promise<UserRecord> {
    const created = await UserModel.create(user);
    return {
      id: created._id.toString(),
      name: created.name,
      email: created.email,
      role: created.role,
      location: created.location,
      passwordHash: created.passwordHash,
    };
  },

  async findByEmail(email: string): Promise<UserRecord | null> {
    const doc = await UserModel.findOne({ email }).exec();
    if (!doc) return null;
    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      role: doc.role,
      location: doc.location,
      passwordHash: doc.passwordHash,
    };
  },

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email }).exec();
    return count > 0;
  },

  async all(): Promise<UserRecord[]> {
    const docs = await UserModel.find().exec();
    return docs.map((doc) => ({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      role: doc.role,
      location: doc.location,
      passwordHash: doc.passwordHash,
    }));
  },
};
