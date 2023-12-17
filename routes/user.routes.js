const express = require("express")
const Router = express.Router()
const userControllers = require("../controllers/user.controller")

Router.post("/createuser", userControllers.createUser)
Router.get("/getusers", userControllers.getUsers)
Router.delete("/deleteuser/:id", userControllers.deleteUser)
Router.put("/updateuser/:id", userControllers.updateUser)

module.exports = Router