var express = require('express');

var app = express();
app.use('/scripts', express.static(__dirname + '/node_modules/'));
app.use(express.static(__dirname + '/public'));

var port = 3200;

app.listen(port);

console.log('server running on port ' + port);