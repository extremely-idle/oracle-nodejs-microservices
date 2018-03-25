var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser');

var PORT = process.env.port || 8888;
var movies = require('movies.json');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.use(bodyParser.json());

var currId = Object.keys(movies).map(function (id) { return parseInt(id) }).reduce(function (curr, value) {
    return Math.max(curr, value);
}, 0);
currId++;

function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err});
}

app.get('/', function(req, res) {
    var summarisedMovies = [];
    for  (var index in movies) {
        var movie = movies[index];
        summarisedMovies.push(
            {
                id: movie.id,
                name: movie.name,
                year: movie.year,
                studio: movie.studio,
                genre: movie.genre,
                rating: movie.rating,
                runtime: movie.runtime,
                director: movie.director,
                description: movie.description,
                score: (movie.reviews.map(function(r) {
                    return r.score
                }).reduce(function(a, b) {
                    return a + b
                }, 0) / movie.reviews.length).toPrecision(3),
                reviews: movie.reviews.length
            }
        );
    }
    res.send(JSON.stringify(summarisedMovies, null, 2));
});

app.get('/:id', function(req, res) {
    var id = parseInt(req.params.id);
    if (id == 0 || id && movies[id]) {
        res.send(JSON.stringify(movies[id], null, 2));
    } else {
        res.status(404);
        res.send('Not Found!');
    }
});

app.post('/', function(req, res) {
    var movie = req.body;
    var id = currId++;
    movie.id = id;
    movies[id] = movie;
    res.send(JSON.stringify(movie, null, 2));
});

app.put('/:id', function(req, res) {
    var id = parseInt(req.params.id);
    if (id == 0 || id && movies[id]) {
        var movie = req.body;
        movie.id = id;
        movies[id] = movie;
        res.send(JSON.stringify(movie, null, 2));
    } else {
        res.status(404);
        res.send('Not Found!');
    }
});

app.delete('/:id', function(req, res) {
    var id = parseInt(req.params.id);
    if (id == 0 || id && movies[id]) {
        res.send(JSON.stringify(movies[id], null, 2));
        delete movies[id];
    } else {
        res.status(404);
        res.send('Not Found!');
    }
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