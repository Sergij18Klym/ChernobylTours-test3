if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require('method-override');

const app = express();

const indexRouter = require('./routes/index');
const driverRouter = require('./routes/drivers');
const tourRouter = require('./routes/tours');
const customerRouter = require('./routes/customers');
const participantRouter = require('./routes/participants');
const guideRouter = require('./routes/guides');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(methodOverride('_method'));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', error => console.error(error));
db.once('open', () => console.log('Connected to Mongoose'));

app.use('/', indexRouter);
app.use('/drivers', driverRouter);
app.use('/tours', tourRouter);
app.use('/customers', customerRouter);
app.use('/participants', participantRouter);
app.use('/guides', guideRouter);

app.listen(process.env.PORT || 3000);