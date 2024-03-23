const express = require("express")

const router = express.Router()
const { addUser, getUsers, updateUserById, updateUserByEmail, softDeleteUserById, softDeleteUserByEmailId, hardDeleteUserById, hardDeleteUserByEmailId, getUsersByFilter } = require("../Controllers/UserController")
const { errorHandler } = require("../Handlers/ErrorHandler")


router.post("/addUser", addUser)
router.get("/getUsers", getUsers)
router.get("/getUsersByFilter", getUsersByFilter)
router.put("/updateUser/userId=:userId", updateUserById)
router.put("/updateUser/emailId=:emailId", updateUserByEmail)
router.delete("/softDelete/userId=:userId", softDeleteUserById)
router.delete("/softDelete/emailId=:emailId", softDeleteUserByEmailId)
router.delete("/hardDelete/userId=:userId", hardDeleteUserById)
router.delete("/hardDelete/emailId=:emailId", hardDeleteUserByEmailId)

router.use(errorHandler)

module.exports = router