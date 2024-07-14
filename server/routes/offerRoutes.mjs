import express from "express";
import mongoose from "mongoose";
import { authenticateJwt } from "../middleware/auth.mjs";
import offerSchema from "../models/offer.mjs";

const router = express.Router();
const offers = mongoose.model("offers", offerSchema);

router.post("/offers", authenticateJwt, async (req, res) => {
  const {
    companyName,
    candidateName,
    offerType,
    offerAmount,
    email,
    position,
    offerStartDate,
    offerEndDate,
    uniqueId,
  } = req.body;

  const newOffer = new offers({
    companyName,
    candidateName,
    offerType,
    email,
    position,
    offerAmount,
    offerStartDate: new Date(offerStartDate),
    offerEndDate: new Date(offerEndDate),
    uniqueId,
  });

  try {
    await newOffer.save();
    res.status(201).json({ msg: "Created" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get("/offers", authenticateJwt, (req, res) => {
  offers
    .find()
    .then((offers) => res.json(offers))
    .catch((err) => res.status(400).json({ error: err.message }));
});

export default router;
