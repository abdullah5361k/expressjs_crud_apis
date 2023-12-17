const mongoose = require("mongoose")

async function dbConnection() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Connect to db")
    } catch (error) {
        console.log("Db Error: ", error)
        throw new error
        process.exit(1)
    }
}

module.exports = dbConnection