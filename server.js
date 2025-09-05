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
    secret: "klickks_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 }, // 1 hour
  })
);

app.use("/", authRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
