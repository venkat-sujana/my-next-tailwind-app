import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  age: {
    type: Number,
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
  },
  admissionYear: {
    type: Number,
    required: true,
  },
  // New fields added below
  gender: {
    type: String,
    // required: true,
    enum: ["Male", "Female", "Other"], // Allowed values
  },
  caste: {
    type: String,
    // required: true,
    enum: ["OC", "SC", "ST", "BC", "Other"], // Allowed values
  },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model("Student", StudentSchema);