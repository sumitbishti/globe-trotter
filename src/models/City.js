import { Schema, model, models } from "mongoose";

const CitySchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  clues: {
    type: [String],
    required: true,
  },
  fun_facts: {
    type: [String],
    required: true,
  },
  trivia: {
    type: [String],
    required: true,
  },
});

const City = models.City || model("City", CitySchema);
export default City;
