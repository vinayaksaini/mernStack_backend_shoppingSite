require("dotenv").config();
const mongoose = require('mongoose');
const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require('cors');

//MY Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");

//DB Connection
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => {
    console.log("DB CONNECTED")
});



//PORT
const port = process.env.PORT || 8000;

//Midleware Functions
app.use(cookieParser());
app.use(bodyParser.json());
app.use(cors());

//myRoutes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);

//Starting the Server
app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
