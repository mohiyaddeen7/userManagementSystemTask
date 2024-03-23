const express = require("express")
const app = express()

const config = require("./Config/config")
const PORT = config.port
const connectToMongo = require("./Config/db")

app.use(express.json())


app.use("/api/users", require("./Routes/UserRoutes"));

connectToMongo();


app.listen(PORT, () => {
    console.log(`App listening on : http://localhost:${PORT}`)
})

