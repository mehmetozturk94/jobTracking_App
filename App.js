const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
const app = express();
const authRoutes = require('./routes/authRoute');
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "ejs");
const {authControl} = require('./middleware/authMiddleware')

const dbURI =
  'mongodb+srv://mehmetoz9443@gmail.com:12345678M@cluster0.rlk5m.mongodb.net/jobTrackingDB?retryWrites=true&w=majority'

mongoose
  .connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(
    (result) => app.listen(3000),
    () => {
      console.log("db connected");
    }
  )
  .catch((err) => {
    console.log(err);
  });

var server = app.listen(3000);
app.get("/",authControl, (req, res) => res.render("home"));
app.get("/works",authControl, (req, res) => res.render("works"));

app.use(authRoutes);
app.get('/set-cookie',(req,res)=>{
  res.setHeader('Set-Cookie','new=true');
  res.send('Cookie sent');
})

