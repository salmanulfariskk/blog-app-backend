const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const connection = require("./config/dbConfig");
const cookieParser = require("cookie-parser");
const errorHandler = require("./middlewares/errorHandler");
const cors = require("cors")

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}))
app.use(cookieParser());

connection();

app.use("/api/users", require("./routes/userRoutes"))
app.use("/api/blogs", require("./routes/blogRoutes"));
app.use('/api/comments', require('./routes/commentRoute'))

app.use(errorHandler)

const PORT = process.env.PORT || 8000

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
