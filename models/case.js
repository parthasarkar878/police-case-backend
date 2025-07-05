import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  caseNumber: { type: String, required: true },
  dateOfFiling: { type: Date, required: true },
  complainantName: { type: String },
  complaintDetails: { type: String },
  typeOfCase: { type: String },
  ioName: { type: String },
  ioContact: { type: String },
  accusedDetails: { type: String },
  chargeSheetDate: { type: Date },
  status: {
    type: String,
    enum: ["open", "investigating", "chargeSheeted", "closed"],
    default: "open"
  },
  progressUpdates: [
    {
      updateDate: Date,
      updateText: String
    }
  ],
  createdBy: { type: String, required: true }
});

export default mongoose.model("Case", caseSchema);

