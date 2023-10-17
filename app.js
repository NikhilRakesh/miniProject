const express = require('express')
const app = express()
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const userrouter = require('./routes/user')
const adminrouter = require('./routes/admin')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { v4: uuid4 } = require("uuid");
require('dotenv').config();

const dbURI = process.env.DB_URI;
// Create a session store
const store = new MongoDBStore({
  uri: dbURI,
  collection: 'sessions',
});

const adminstore = new MongoDBStore({
  uri: dbURI,
  collection: 'adminsessions',
});

app.set('view engine', 'ejs')

app.use(express.static('public'));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  session({
    name: 'sessions',
    secret: uuid4(),
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      maxAge: 3600000,
    },
  })
);

app.use(session({
  name: 'adminsessions',
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  store: adminstore,
}));

const noCacheMiddleware = (req, res, next) => {
  console.log('cache');
  res.header('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.header('Expires', '-1');
  res.setHeader('Pragma', 'no-cache');
  next();
};
app.use(noCacheMiddleware);

app.use('/', userrouter)
app.use('/', adminrouter)




mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('database connected');
    app.listen(5000, () => {
      console.log('server started');
    })
  })
  .catch((err) => {
    console.error('Error connecting to the database:', err);
  })
