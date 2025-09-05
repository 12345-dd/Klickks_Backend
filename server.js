import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = 4000;

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin:true,
    credentials: true,
  })
);

app.use(
  session({
    key: "sessionId",
    secret: "yourSecret",
    store: sessionStore, // MySQL session store
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: true,        // true in production (HTTPS only)
        httpOnly: true,      // prevent JS access
        sameSite: "none",    // allow cross-site cookies
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
