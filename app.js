const express = require('express');

const app = express();

app.get('/', function(req, res) {
    res.send('Home route is working');
});

app.listen(3000);