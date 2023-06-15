const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");

const csrf = require("csurf");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const connectDb = require("./database/dbConnect");

const app = express();
const csrfProtection = csrf({ cookie: true });

const authRoutes = require("./routes/authRoute");
const instructorRoutes = require("./routes/instructorRoute");
const courseRoutes = require("./routes/courseRoute");


// Middlewares
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(cookieParser());
app.use(morgan("dev"));


app.use((req, res, next) => {

    console.log("This is my own middleware");
    next();
})


app.use("/api", authRoutes);
app.use("/api", instructorRoutes)
app.use("/api", courseRoutes);

app.use(csrfProtection);

app.get("/api/csrf-token", (req, res) => {

    console.log("After csrf ,  request : ", req.csrfToken());

    res.json({ csrf: req.csrfToken() });
});

const port = 4000 || process.env.PORT
const Start = async () => {

    try {

        await connectDb();
        console.log("Connected to the database");

        app.listen(port, () => {
            console.log(`Server listening on the port ${port}`)
        })

    }
    catch (error) {
        console.log("Error : ", error);
    }

}
Start();