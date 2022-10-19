const express = require('express')
const app = express()
const port = 80
const path = require('path')
const programmingLanguagesRouter = require("./routes/routes");

const cookieParser = require('cookie-parser');

var logger = require("morgan");
const cors = require("cors");

app.use(cors());
//app.use(logger("dev"));

app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);


app.get('/', (req, res) => {
  res.send('/index.html')
});

app.get('/logout', (req, res) => {
	res.clearCookie("email");
	res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/register', (req, res) => {
	res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.use("/users", programmingLanguagesRouter);
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
