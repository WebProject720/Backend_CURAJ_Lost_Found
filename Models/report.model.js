import mongoose, { Schema } from "mongoose";


export const ReportSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "Users"
    },
    title: {
      type: String,
      required: true
    },
    images: {
      type: [String],
      required: false
    },
    description: {
      type: String,
      required: true
    },
    isOpen: {
      type: String,
      required: false,
      default: false
    }
  },
  { timestamps: true }
);



export const Reports = new mongoose.model('Reports', ReportSchema, 'Reports')