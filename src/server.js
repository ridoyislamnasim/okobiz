import cors from 'cors';
import express from 'express';
import moment from 'moment-timezone';
import morgan from 'morgan';
import mongoose from "mongoose";
import rootRouter from './api/routes/index.js';
import config from './config/config.js';
import globalErrorHandler from './middleware/errors/globalErrorHandler.js';
import colors from 'colors'
// const SSLCommerzPayment = require('sslcommerz-lts')


const app = new express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

moment.tz.setDefault('Asia/Dhaka');
const currentDate = moment();
console.log(currentDate.format('YYYY-MM-DD HH:mm:ss'));

app.use(`/api${config.uploadPath}`, express.static(config.uploadFolder));
app.use('/api', rootRouter);

app.get('/api', (req, res, next) => {
  res.send('welcome to okobiz');
});

app.get('/time', (req, res, next) => {
  res.send(currentDate.format('YYYY-MM-DD HH:mm:ss'));
});


app.use(globalErrorHandler);

mongoose.connect(process.env.MONGO_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("Database connection successful! --------------"))
  .catch((err) => {
    console.error("Database connection error:", err.message);
    console.error("Full error details:", err);
  });

app.listen(process.env.PORT, () => {
  console.log(`app listening to port `, process.env.PORT);
});