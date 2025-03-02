import mongoose, { model, Schema, models } from "mongoose";

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  high_score: {
    type: Number,
    default: 0,
  },
});

let User;
try {
  User = mongoose.model("User");
} catch (e) {
  // Model doesn't exist, create it
  User = mongoose.model("User", UserSchema);
}

export default User;
