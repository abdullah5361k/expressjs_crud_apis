require("dotenv").config()
const express = require("express")
const app = express()
const dbConnection = require("./config/db")
const router = require("./routes/user.routes")
const PORT = process.env.PORT || 3000

app.use(express.json())

// Connection to DB
dbConnection()

app.use(router)


app.listen(PORT, () => {
    console.log("App is running on " + PORT)
})