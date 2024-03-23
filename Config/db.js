const mongoose = require("mongoose")
const config = require("./config")

const connectToMongo = () => {
    try {
        mongoose.connect(`${config.database.mongodbURI}${config.database.dbName}`).then(() => {
            console.log("Connected to database successfully")
        }).catch((error) => {
            console.error("Failed to connect to database : ", error.message)
        })
    } catch (error) {
        console.error("Internal server error : ", error.message)
    }
}

module.exports = connectToMongo