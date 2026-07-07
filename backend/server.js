const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

connectDB();

const app = express();

// app.use(cors({
//   origin: "https://fogg-final.netlify.app", // allow your Netlify frontend
//   credentials: true, // if sending cookies
// }));

// app.use(cors());

const allowedOrigins = [
  "https://foggcomputing.netlify.app/",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>My API</title>
      </head>
      <body>
        <h1>🚀 Server is Running</h1>
        <p>Welcome to the API home page.</p>
      </body>
    </html>
  `);
});

app.use("/api", require("./routes/authRoutes"));

app.use("/api/files", require("./routes/fileRoutes"));
// Make uploads folder static so frontend can access files
app.use("/uploads", express.static("uploads"));

// gmail test http://localhost:5000/test-mail
// app.get("/test-mail", async (req, res) => {
//   try {
//     const info = await transporter.sendMail({
//       from: process.env.GMAIL_USER,
//       to: process.env.GMAIL_USER,
//       subject: "SMTP TEST",
//       text: "If you see this, Gmail works",
//     });

//     res.json(info);
//   } catch (err) {
//     console.log("SMTP ERROR:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
