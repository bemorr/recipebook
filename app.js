var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    { Client } = require('pg'),
    dotenv = require('dotenv').config(),
    app = express();

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
    // PG connect
    const client = new Client ({
        // dotenv pkg managing creds 
        connectionString: process.env.CONNECTIONSTRING,
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
        })
    client.connect() 
    client.query('SELECT * FROM recipes', (err, res1) => {
        console.log(err);
        res.render('index', {recipes: res1.rows});
        client.end();
    });
});

app.post('/add', function(req, res){    
    const text = "INSERT INTO recipes(name, ingredients, directions) VALUES($1, $2, $3)";
    const values = [req.body.name, req.body.ingredients, req.body.directions];
    const client = new Client ({
        // dotenv pkg managing creds.
        connectionString: process.env.CONNECTIONSTRING,
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
        })

    client.connect();
    client
        .query(text, values)
        .then(result => res.redirect("/"))
        .catch(e => console.error(e.stack))
        .then(() => client.end());
})

app.delete("/delete/:id", function (req,res) {
    const text = "DELETE FROM recipes WHERE id = $1";
    const values = [req.params.id];
    const client = new Client ({
        // dotenv pkg managing creds.
        connectionString: process.env.CONNECTIONSTRING,
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
        })

    client.connect();
    client
        .query(text, values)
        .then(result => console.log(result))
        .catch(e => console.error(e.stack))
        .then(() => client.end());
    res.send(200);
});


app.post('/edit', function(req, res){
    const text = "UPDATE recipes SET name=$1, ingredients=$2, directions=$3 WHERE id=$4";
    const values = [req.body.name, req.body.ingredients, req.body.directions, req.body.id];
    const client = new Client ({
        // dotenv pkg managing creds.
        connectionString: process.env.CONNECTIONSTRING,
        host: process.env.HOST,
        port: process.env.PORT,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE
        })
    client.connect();
    client
        .query(text, values)
        .then(result => res.redirect("/"))
        .catch(e => console.error(e.stack))
        .then(() => client.end());
   
});


app.listen(3000, function(){
    console.log('Server started on port 3000');
})