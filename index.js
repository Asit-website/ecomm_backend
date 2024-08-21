const dotenv = require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");

const { cloudinaryConnect } = require("./config/cloudinary");
const dbConnect = require("./config/database");

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

app.get("/", (req, res) => {
  res.send("hlw");
});

// connect to cloudinary
cloudinaryConnect();

// connect to database
dbConnect();

// Routes import
const user = require("./routers/userRouter");
const product = require("./routers/productRouter");
const order = require("./routers/orderRouter");
const cart = require("./routers/cartRouter");

// routes declaration
app.use("/api/v1", user);
app.use("/api/v1", product);
app.use("/api/v1", order);
app.use("/api/v1", cart);

const Payments = require("./routers/Payments");
app.use("/api/v1/payment", Payments);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
