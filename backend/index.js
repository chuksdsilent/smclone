import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import postRoutes from "./routes/posts.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import storyRoutes from "./routes/stories.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import multer from "multer";
import relationshipRoutes from "./routes/relationships.js";
import bodyParser from "body-parser";
import { uploads3Image } from "./utils/utils.js";
import dotenv from "dotenv";

const PORT = 8800;
const app = express();

dotenv.config();

//middlewares

app.use(express.json({ limit: "200mb" }));
app.use(express.urlencoded({ limit: "200mb", extended: true }));
app.use(bodyParser.text({ limit: "200mb" }));
app.use(
  cors({
    credentials: true,
    origin: "http://ec2-52-87-255-171.compute-1.amazonaws.com:3000",
  })
);
app.use(cookieParser());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/api/upload", async (req, res) => {
  const file = req.file;
  console.log("file from react", file);
  // try {
  //   const image = await uploads3Image(file);
  //   res.send(image);
  // } catch (err) {
  //   console.log(err);
  // }
  res.status(200).send(file);
});

console.log("pass", process.env.PASSWORD);
app.use("/api/auth", authRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/relationships", relationshipRoutes);

app.listen(PORT, () => {
  console.log(`Server connected on port ${PORT}`);
});
