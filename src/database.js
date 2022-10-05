const mongoose = require("mongoose");
const { mongodb } = require("./keys");

//me faltan las variables de entorno
const MONGODB_URI = process.env.MONGODB_URI || mongodb.URI;
//{useNewUrlParser:true}
mongoose
  .connect(MONGODB_URI, {})
  .then((db) => console.log("Database is connected"))
  .catch((err) => console.error(err));
