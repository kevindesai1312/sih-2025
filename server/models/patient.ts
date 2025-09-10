import mongoose, { Schema, Document } from 'mongoose';

// Patient User Model (for patient login/registration)
export interface IPatientUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  medicalHistory?: string[];
  allergies?: string[];
  currentMedications?: string[];
  bloodGroup?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Patient Appointment Model (for patient's view of appointments)
export interface IPatientAppointment extends Document {
  patientId: mongoose.Types.ObjectId;
  doctorId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  appointmentDate: Date;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  prescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PatientUserSchema = new Schema<IPatientUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ['male', 'female', 'other'],
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    emergencyContact: {
      name: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      relationship: {
        type: String,
        required: true,
      },
    },
    medicalHistory: [String],
    allergies: [String],
    currentMedications: [String],
    bloodGroup: {
      type: String,
      enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    },
  },
  { timestamps: true }
);

const PatientAppointmentSchema = new Schema<IPatientAppointment>(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: 'PatientUser',
      required: true,
    },
    doctorId: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
      required: true,
    },
    slotId: {
      type: Schema.Types.ObjectId,
      ref: 'Slot',
      required: true,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    reason: {
      type: String,
      required: true,
    },
    notes: String,
    prescription: String,
  },
  { timestamps: true }
);

export const PatientUser = mongoose.model<IPatientUser>('PatientUser', PatientUserSchema);
export const PatientAppointment = mongoose.model<IPatientAppointment>('PatientAppointment', PatientAppointmentSchema);