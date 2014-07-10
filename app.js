// Basic
var express = require('express')
var path = require('path')
var app = express();
var mongoose = require('mongoose')

// Module
var spider = require("./spider");
var Story = require('./models/story')

// Route
var home = require("./routes/home");
var query = require("./routes/query");

mongoose.connect('mongodb://localhost/test');

// Global Config
app.set('port', process.env.PORT || 8000);
app.set('views', __dirname + '/views/pages');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')))


// Route Begin
app.get('/admin', home.admin);

app.get("/search", function(req, res) {
  var keyword = req.query.q
  Story.findByKeyword(keyword, function (err, stories) {
    if (err) {
      console.log(err)
    }
    res.render('index', {
      title: '查询: ' + keyword,
      stories: stories
    })
  })
})

app.get("/clearRedis", query.clearRedis);

app.get("/fetch", spider.fetch);

app.get("/", function (req, res) {

    Story.fetch(function(err, stories) {
    if (err) {
      console.log(err)
    }
    res.render('index', {
      title: '无中介租房',
      stories: stories
    })
  })
})

app.get("/test", function (req, res) {

    console.log(req.query);
    res.send(200, "success");
});

// setInterval(function () {
// 	spider.fetch();
// }, 1000 * 60 * 10);


app.listen(process.env.VCAP_APP_PORT || 8000);
