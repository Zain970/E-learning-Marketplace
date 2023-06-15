const mongoose = require("mongoose");

const connectDb = () => {
    return mongoose.connect(process.env.DB_URL);
}

module.exports = connectDb;