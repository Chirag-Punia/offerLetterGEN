import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { SECRET, authenticateJwt } from "../middleware/auth.mjs";
import userSchema from "../models/user.mjs";
import generatePDF from "../store/genratePDF.mjs";
import sendEmailWithAttachment from "../store/sendEmailWithAttachment.mjs";
import offerSchema from "../models/offer.mjs";
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const offers = mongoose.model("offers", offerSchema);
const router = express.Router();
const User = mongoose.model("User", userSchema);

const otpStorage = {};
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.pass,
  },
});

router.post("/login", async (req, res) => {
  
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (user) {
      
      if (password !== user.password) {
        res.json({ msg: "Wrong password" });
      } else {
        
        const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
        console.log(111)
        res.json({ msg: "Login successfully", token });
      }
    } else {
      res.json({ msg: "User does not exist" });
    }
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

router.get("/me", authenticateJwt, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.headers.userID });
    if (user) {
      res.json({ user });
    } else {
      res.json({ message: "User not logged in" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

router.get("/profile", authenticateJwt, async (req, res) => {
  try {
    const user = await User.findById(req.headers.userID);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user details" });
  }
});

router.post("/reset", async (req, res) => {
  const { email } = req.body;
  const otp = crypto.randomInt(100000, 999999).toString();
  User.findOne({ email }).then((user) => {
    if (user) {
      const mailOptions = {
        from: process.env.XEMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send({ msg: "Error sending OTP" });
        } else {
          otpStorage[email] = otp;
          res.status(200).send({ msg: "OTP sent successfully" });
        }
      });
    } else {
      res.send("error");
    }
  });
});

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;
  if (otpStorage[email] && otpStorage[email] === otp) {
    delete otpStorage[email];
    res.status(200).send({ msg: "OTP verified successfully" });
  } else {
    res.status(400).send({ msg: "Invalid OTP" });
  }
});

router.post("/update-password", async (req, res) => {
  const { email, newPassword } = req.body;
  try {
    await User.updateOne({ email }, { password: newPassword });
    res.status(200).send({ msg: "Password updated successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Error updating password" });
  }
});
router.get("/offers/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;

  const offer = await offers.find({ uniqueId });
  if (!offer) {
    return res.status(404).json({ message: "Offer not found" });
  }

  res.json(offer);
});

router.put("/offers/:uniqueId", async (req, res) => {
  const { uniqueId } = req.params;
  const formData = req.body;

  try {
    const updatedOffer = await offers.findOneAndUpdate(
      { uniqueId: uniqueId },
      { $set: formData },
      { new: true }
    );

    if (!updatedOffer) {
      return res.status(404).json({ message: "Offer not found" });
    }

    res.json({
      message: `Offer details updated for uniqueId: ${uniqueId}`,
      offer: updatedOffer,
    });
  } catch (error) {
    console.error("Error updating offer:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/generate-and-send-pdf", async (req, res) => {
  const { uniqueId } = req.body;
  
  offers
    .findOne({ uniqueId })
    .then(async (offers) => {
      const recipientEmail = offers.email;
      const htmlContent = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Internship Offer Letter from Suvidha Foundation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
        }
        .container {
            width: 80%;
            margin: auto;
        }
        .header, .footer {
            text-align: center;
            margin-bottom: 40px;
        }
        .content {
            margin-bottom: 40px;
        }
        .signature {
            margin-top: 60px;
        }
        .boldText {
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Suvidha Foundation (Suvidha Mahila Mandal)</h1>
            <p>Date: ${formatDate(
              new Date().toString()
            )}<br>Ref. No. ${uniqueId}</p>
        </div>
        <div class="content">
            <h2>INTERNSHIP OFFER LETTER</h2>
            <p>To,</p>
            <p>${offers.candidateName},</p>
            <p>We are pleased to offer you the position of <span class="boldText">"${
              offers.position
            }"</span> at Suvidha Foundation (Suvidha Mahila Mandal) with the following terms and conditions:</p>
            <ul>
                <li><span class="boldText">Role:</span> Web Development Services and Fundraising activities</li>
                <li><span class="boldText">Internship Period:</span> ${formatDate(
                  offers.offerStartDate
                )} to ${formatDate(offers.offerEndDate)}</li>
                <li><span class="boldText">Position:</span> Work-from-home, six days a week</li>
                <li><span class="boldText">This is an honorary position and does not entail any financial remuneration</span></li>
                <li><span class="boldText">Completion Certificate:</span> Issued upon fulfilling internship requirements, including daily time commitment</li>
            </ul>
            <h3>Confidentiality and Conduct:</h3>
            <ul>
                <li>Maintain confidentiality during and after the internship.</li>
                <li>Misconduct may lead to termination without a completion certificate.</li>
                <li>All developed materials are the property of Suvidha Mahila Mandal.</li>
                <li>Return all organisation property upon completion.</li>
                <li>Legal action will be taken for piracy or information leakage.</li>
            </ul>
        </div>
        <div class="footer">
            <p>Acceptance: I accept the offer and agree to the terms and conditions.</p>
            <div class="signature">
                <p>Signature: ____________________________ Date: ____________________________</p>
            </div>
            <p>Mrs. Shobha Motghare<br>Secretary, Suvidha Mahila Mandal</p>
        </div>
    </div>
</body>
</html>

  `;
      try {
        const pdfBuffer = await generatePDF(htmlContent);
        await sendEmailWithAttachment(pdfBuffer, recipientEmail);
        res.send("PDF generated and sent successfully!");
      } catch (error) {
        console.error("Error generating or sending PDF:", error);
        res.status(500).send("Error generating or sending PDF");
      }
    })
    .catch((err) => res.status(400).json({ error: err.message }));
});

export default router;
