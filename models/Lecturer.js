// models /Lecturer.js
import mongoose from 'mongoose';

const lecturerSchema = new mongoose.Schema({
  lecturerName: {
    type: String,
    required: true,
    trim: true,
  },
  fatherName: {
    type: String,
    required: true,
    trim: true,
  },
  qualification: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    enum: ["Maths", "Physics", "Chemistry", "Zoology", "English", "Telugu", "Botany", "Civics", "Hindi", "M&AT", "CET", "MLT"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function(v) {
        return /^\d{10}$/.test(v); // Simple 10-digit validation
      },
      message: props => `${props.value} is not a valid phone number!`
    }
    
  },
  dateOfJoining: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },
  caste: {
    type: String,
    required: true,
    enum: ["OC", "SC", "ST", "BC", "Other"],
  },
}, {
  timestamps: true,
  collection: "lecturers",
});

// Fix: Use mongoose.models instead of just models
const Lecturer = mongoose.models.Lecturer || mongoose.model('Lecturer', lecturerSchema);

export default Lecturer;