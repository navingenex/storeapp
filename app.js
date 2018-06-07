const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

//mongoose connection
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
    console.log('connected to:' + config.database);
});

const app = express();
const users = require('./routes/users');
var port = process.env.PORT || 8080; 
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

//authentication
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);





app.use('/users', users);
//index routes
// app.get('/', (req, res) => {
//     res.send('home');
// });
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(port, () => {
    console.log('Server running on port:' + port);
});

