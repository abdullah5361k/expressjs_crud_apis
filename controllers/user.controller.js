const User = require("../models/user.model.js")
const { validationResult } = require('express-validator');
const mongoose = require("mongoose")


/*
* Create user 
 */

exports.createUser = async (req, res) => {
    try {

        if (validation(req, res)) {
            return;
        }

        if (await checkEmailExistence(req.body.email, res)) {
            return;
        }

        await storeUserInDb(req.body, res)

    } catch (error) {
        // Error response
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        })
    }
}

// Validation
function validation(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            message: "Valaidation Error",
            errors: errors.array()
        })
        return true
    }
    return false
}

// Check email existence
async function checkEmailExistence(email, res) {
    try {
        const checkEmail = await User.findOne({ email })

        // If email already exist in DB
        if (checkEmail) {
            res.status(409).json({
                success: false,
                message: "User registration failed",
                error: {
                    code: "DUPLICATE_USER",
                    message: "User with the provided email already exists"
                }
            })
            return true  // Indicate Email already exist
        }
        return false // Email does not exist
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error checking email existence",
            error: error.message
        });
        return true; // Indicate that there was an error
    }
}

// Stor user in Db
async function storeUserInDb(userData, res) {
    try {
        // Create user
        const user = await User.create(userData);

        // Send response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            user
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error creating user",
            error: error.message
        });
        throw error; // Re-throw the error to propagate it up the call stack
    }
}

/* 
* Get Users
 */

exports.getUsers = async (req, res) => {
    try {
        // Fetch users
        await fetchUsersFromDb(res)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}

async function fetchUsersFromDb(res) {
    try {
        // Fetch users from DB
        const users = await User.find({})

        // Check if users array is empety
        if (users.length === 0) {
            return res.status(404).json({
                success: true,
                message: "No user found",
            })
        }

        // Send response
        res.status(200).json({
            success: true,
            message: "Users found successfully",
            users
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error fetching Users",
            error: error.message
        });
        throw error
    }
}

/*
* Update user
 */

exports.updateUser = async (req, res) => {
    try {

        // Validation on req
        if (validation(req, res)) {
            return;
        }

        const { id } = req.params

        // Check  id is valid objectid or not
        if (checkUserObjectId(id, res)) {
            return;
        }

        // Check user in Db
        if (await checkUserExistence(id, res)) {
            return;
        }

        // Update user
        await updateUserInDb(id, req.body, res)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        })
    }
}

async function checkUserExistence(id, res) {
    try {
        // Check user ObjectId exists
        const checkUserId = await User.findById(id)

        // If user  ObjectId does not exist
        if (!checkUserId) {
            res.status(404).json({
                success: false,
                message: "User not exist"
            })
            return true
        }
        return false
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error finding userid",
            error: error.message
        })
        return true
    }
}

// Update User in Db
async function updateUserInDb(id, update, res) {
    try {
        // Update user
        const updateUser = await User.findByIdAndUpdate(id, update, { new: true })

        // Send response 
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            updateUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating User",
            error: error.message
        })
    }
}

/*
 * Delete User from Db
*/

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params

        // Check if id is valid objectid
        if (checkUserObjectId(id, res)) {
            return;
        }

        // Delte user from DB
        await deletUserFromDb(id, res)

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
}


function checkUserObjectId(id, res) {
    // Check objectId valid or not
    const checkObjectId = mongoose.Types.ObjectId.isValid(id)

    // If object id is not valid
    if (!checkObjectId) {
        res.status(400).json({
            success: false,
            message: "Invalid objectId format"
        })
        return true
    }
    return false
}

async function deletUserFromDb(id, res) {
    try {
        // Delte user from DB
        const deletedUser = await User.findByIdAndDelete(id)

        // Check if user deleted already
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User already Deleted",
            })
        }

        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            deletedUser
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error deleting users",
            error: error.message
        });
        throw error;
    }
}