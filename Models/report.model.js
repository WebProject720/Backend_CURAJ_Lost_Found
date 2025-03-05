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
      type: Boolean,
      required: false,
      default: true
    }
  },
  { timestamps: true }
);



export const Reports = new mongoose.model('Reports', ReportSchema, 'Reports')