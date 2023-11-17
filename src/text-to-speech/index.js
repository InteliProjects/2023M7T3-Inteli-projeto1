const express = require("express");
const transcriptRoutes = require("./routes/index");
const bodyParser = require("body-parser");
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 3030;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use("/api", transcriptRoutes);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
