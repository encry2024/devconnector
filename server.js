// Express
const express = require('express');
const app = express();
// Mongoose
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
// Port
const port = process.env.PORT || 5000;
// Routes
const users = require('./routes/api/users'),
    profile = require('./routes/api/profile'),
    posts = require('./routes/api/posts');
// Body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World'));

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

mongoose
    .connect(db, {useNewUrlParser: true})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));


app.listen(port, () => console.log(`Server running on port ${port}`));