const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const app = express();
const dotenv = require('dotenv').config();
const twilio = require('twilio');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

//Setting up views
app.set('views', './views');

//Setting default engine to be ejs
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    const data = {
        person: {
            firstName: 'Vance',
            lastName: 'Pope'
        }
    }
    res.render('index', data);
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/contact', (req, res) => {
  res.render('contact');
});
app.get('/projects', (req, res) => {
  res.render('projects');
});

app.post('/thanks', (req, res) => {
  const accountSid = 'AC4a06f1284f8f890395cfaa4edc5d8a96';
  const authToken = '80fc02a30a9e0fab17c1744c0b9e2504';

  const client = new twilio(accountSid, authToken);
  const userInfo = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      company: req.body.company,
      subject: req.body.subject,
      message: req.body.message
  };
  client.messages.create({
      to: '+16198943072',
      from: '+16198948944',
      body: `${userInfo.firstName}, ${userInfo.lastName}, ${userInfo.email}, ${userInfo.company}, ${userInfo.subject}, ${userInfo.message}`
  }, (message) => console.log(message.sid));
  res.render('thanks', { userInfo: userInfo })
});
// Catch and handle everything else
app.get('*', function (req, res) {
  res.send('Whoops, page not found 404').status(404);
})
app.listen(process.env.PORT || 8080, () => {
    console.log('listening at http://localhost:8080');
});