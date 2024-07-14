import nodemailer from "nodemailer";

const sendEmailWithAttachment = async (pdfBuffer, recipientEmail) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  const mailOptions = {
    from: "samplemail650@gmail.com",
    to: recipientEmail,
    subject: "OFFER LETTER SUVIDHA",
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Offer Letter from Suvidha Foundation</title>
<style>
    body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 20px;
    }
    .offer-letter {
        border: 1px solid #ccc;
        padding: 20px;
        max-width: 600px;
        margin: auto;
        background-color: #f9f9f9;
    }
    .offer-letter h2 {
        text-align: center;
        color: #333;
    }
    .offer-details {
        margin-top: 20px;
    }
    .contact-info {
        margin-top: 30px;
        font-size: 0.9em;
    }
</style>
</head>
<body>
<div class="offer-letter">
    <h2>Dear intern,</h2>
    <p>Greetings of the day.</p>
    <p>Congratulations on your offer from Suvidha Foundation!</p>
    <p>Please find the attached - detailed offer letter.</p>
    <p>For the process of acceptance, please revert back the physically signed copy of the Offer Letter within 48 hours.</p>
    <p>Email us here back:- <a href="mailto:hr@suvidhafoundationedutech.org">hr@suvidhafoundationedutech.org</a></p>
    <p>After successful completion of your internship, you will be awarded with a "Certificate of Completion" and on the basis of your performance, a "Letter of Recommendation".</p>
    <p>We are looking forward to hearing from you and hope you will join our team!</p>
    <div class="offer-details">
        <p><strong>Best regards,</strong><br>
        Sonal Godshelwar<br>
        Human Resource Team</p>
    </div>
    <div class="contact-info">
        <p>Mail: <a href="mailto:suvidhafoundation00@gmail.com">suvidhafoundation00@gmail.com</a><br>
        Suvidha Foundation<br>
        R. No: MH/568/95/Nagpur<br>
        H.No. 1951, W.N.4, Khaperkheda, Saoner, Nagpur<br>
        Email: <a href="mailto:info@suvidhafoundationedutech.org">info@suvidhafoundationedutech.org</a><br>
        Phone No: <a href="tel:+918378042291">+918378042291</a></p>
    </div>
</div>
</body>
</html>
`,
    attachments: [
      {
        filename: "OFFER_LETTER.pdf",
        content: pdfBuffer,
        encoding: "base64",
      },
    ],
  };
  console.log()
  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.response);
};

export default sendEmailWithAttachment;
