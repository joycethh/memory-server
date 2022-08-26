import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  id: { type: String },
});

const user = mongoose.model("User", userSchema);

export default user;
