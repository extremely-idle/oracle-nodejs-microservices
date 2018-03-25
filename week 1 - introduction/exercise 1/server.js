var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser');

var PORT = process.env.port || 8888;
var movies = require('movies.json');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.use(bodyParser.json());

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err});
}

app.get('/', function(req, res) {
    res.send(JSON.stringify(movies, null, 2));
});

app.get('/:movieIndex', function(req, res) {
    var index = parseInt(req.params.movieIndex);
    if (index == 0 || index && movies[index]) {
        res.send(JSON.stringify(movies[index], null, 2));
    } else {
        res.status(404);
        res.send('Not Found!');
    }
});

app.post('/', function(req, res) {
    var movie = req.body;
    movies.push(movie);
    res.send(JSON.stringify(movie, null, 2));
});

app.post('/:movieIndex', function(req, res) {
    var index = parseInt(req.params.movieIndex);
    var movie = req.body;
    movies[index] = movie;
    res.send(JSON.stringify(movie, null, 2));
});

app.use(function(req, res) {
    res.send(404);
    res.send('Not Found!');
});

app.use(errorHandler);

var server = app.listen(PORT, function() {
    var port = server.address().port;
    console.log("Express server listening on port %s.", port);
});