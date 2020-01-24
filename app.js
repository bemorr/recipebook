var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

// DB connect string
const { Pool, Client } = require('pg');
var connect= "postgres://testTest:9QPI^Kdb6@localhost/recipebookDB";

// Assign Dust Engine to .dust files
app.engine('dust', cons.dust);

// set default Ext .dust
app.set('view engine', 'dust');
app.set('views',__dirname + '/views');

// set public folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false})); // permits and parses nested objects when set to true ONLY strings and arrays when false.

app.get('/', function(req, res){
    const pool = new Pool({
        connect: connect,
      })
      pool.query('SELECT * FROM recipes', (err, res) => {
        console.log(err, res)
        pool.end()
      })
      const client = new Client({
        connect: connect,
      })
      client.connect()
      client.query('SELECT * FROM recipes', (err, res) => {
        console.log(err, res)
        res.render('index', {recipes: res.rows})
        client.end()
      })
});

app.listen(3000, function(){
    console.log('Server started on port 3000');
});