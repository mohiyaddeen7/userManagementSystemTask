require("dotenv").config();
module.exports = {
    database: {
        mongodbURI: process.env.mongodbURI
    },
    port: process.env.port,
};