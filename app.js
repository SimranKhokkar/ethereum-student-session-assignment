const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const student = require('./routes/student');
const organizer = require('./routes/organizer');
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    'extended': false
}));

app.use('/', student);
app.use('/admin', organizer);

app.use(express.static(path.join(__dirname, 'public')));

// view engine setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'default'
}))

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});