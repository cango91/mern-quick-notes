const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const methodOverride = require('method-override');
const sanitize = require('express-mongo-sanitize');
require('dotenv').config();

require('./server/infra/db');

const app = express()

app.use(logger('dev'));
app.use(express.json());
// Configure both serve-favicon & static middleware
// to serve from the production 'build' folder
app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'build')));
app.use(sanitize());
// configure cookie-parser for refresh tokens
app.use(cookieParser());

app.use(methodOverride('_method'));

app.use(require('./server/middleware/bearer'));

// Configure to use port 3001 instead of 3000 during
// development to avoid collision with React's dev server
const port = process.env.PORT || 3001;

// Put API routes here, before the "catch all" route
app.use('/api/users', require('./server/routes/api/users'));
app.use('/api/notes', require('./server/routes/api/notes'));

// The following "catch all" route (note the *) is necessary to return index.html on all non-AJAX requests
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
    console.log(`Express app running on port ${port}`);
});