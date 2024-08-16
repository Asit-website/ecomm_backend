const express = require("express");
const app = express();
const cors = require("cors");
app.use(express.urlencoded({ extended: false }));
const fileUpload = require("express-fileupload");

const { cloudinaryConnect } = require("./config/cloudinary");

app.use(express.json());
app.use(cors());

const port = 4000;

const cookieParser = require("cookie-parser");

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

const dbConnect = require("./config/database");
dbConnect();

const user = require("./routers/userRouter");

const product = require("./routers/productRouter");

const cart = require("./routers/cartRouter");

const order = require("./routers/orderRouter");

app.use("/api/v1", cart);

app.use("/api/v1", user);

app.use("/api/v1", product);

app.use("/api/v1/orders", order);

const Payments = require("./routers/Payments");
app.use("/api/v1/payment", Payments);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
