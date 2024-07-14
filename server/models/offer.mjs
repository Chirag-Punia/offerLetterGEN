import mongoose from "mongoose";

const { Schema } = mongoose;

const offerSchema = new Schema({
  uniqueId: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
    required: true,
  },
  candidateName: {
    type: String,
    required: true,
  },
  offerType: {
    type: String,
    required: true,
    enum: ["paid", "unpaid"],
  },
  offerAmount: {
    type: Number,
    required: function () {
      return this.offerType === "paid";
    },
  },
  offerEndDate: {
    type: Date,
    required: true,
  },
  offerStartDate: {
    type: Date,
    default: Date.now,
  },
  email: {
    type: String,
    required: true,
  },
});

export default offerSchema;
