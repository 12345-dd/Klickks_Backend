import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import SQLiteStoreFactory from "connect-sqlite3";

const SQLiteStore = SQLiteStoreFactory(session);

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.NODE_ENV === "production"
      ? "https://your-frontend.onrender.com"
      : "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  session({
    store: new SQLiteStore({
      db: "sessions.sqlite", // file will be created automatically
      dir: "./",
    }),
    secret: "klickks_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60, // 1 hour
    },
  })
);

app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
