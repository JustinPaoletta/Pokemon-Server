const cors = require('cors');
const express = require('express');
let server = express();

const host = 'localhost';
const port = 8000;

const sql = require('mysql');

const connection = sql.createConnection({
    host     : 'pokemon-world-1.ce32gg8cgwze.us-east-2.rds.amazonaws.com',
    user     : 'admin',
    password : '',
    port     : '3306',
    database : 'pokemon_world'
  });

  connection.connect(function(err) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
  });  


server.use('*', cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.json());


server.get('/allpokemon:user', function (req, res) {
    const user = req.params.user.slice(1);
    connection.query(`SELECT * from ${user}`, (error, data) => {
        if (error) {
            console.error();
        } else {
            res.send(data);
        }
    })
});

server.get('/allWildPokemon:user', function (req, res) {
    const user = req.params.user.slice(1);
    connection.query(`SELECT * from ${user} WHERE STATUS = 'Wild'`, (error, data) => {
        if (error) {
            console.error();
        } else {
            res.send(data);
        }
    })
});

server.post('/catch', function(req, res) {
    const serial = req.body.serial;
    const user = req.body.user;
    connection.query(`UPDATE ${user} set STATUS = 'Caught' where SERIAL = ${serial}`, (error, data) => {
        if (error) {
            console.error();
        } else {
            res.send(data);
        }
    });
});

server.post('/isUserNew', function(req, res) {
    const user = req.body.user;
    const bool = req.body.user.email_verified = true ? 1 : 0;
    connection.query(
        `CREATE TABLE ${user.nickname} SELECT * FROM pokemon WHERE NOT EXISTS 
        (SELECT 1 FROM users WHERE name = 'hello')`, (error, data) => {
        if (error) {
            console.error();
        } else {
            connection.query(
                `Insert into users (nickname, name, picture, updated_at, email, email_verified, sub) 
                VALUES (
                    '${user.nickname}', '${user.name}', '${user.picture}', 
                    '${user.updated_at}', '${user.email}', '${bool}', '${user.sub}'
                )`, (error, data) => {
                    if (error) {
                        console.error();
                    } 
                })
            res.send(data);
        }
    })
});

server.get('/pokemon-boxes:user', function(req, res) {
    const user = req.params.user.slice(1);
    connection.query(`SELECT * FROM ${user} WHERE STATUS = 'Caught'`, (error, data) => {
        if (error) {
            console.error();
        } else {
            res.send(data);
        }
    });
});

server.put('/changeName', function(req, res) {
    connection.query(`UPDATE ${req.body.user} set NICKNAME = '${req.body.newName}' WHERE NAME = '${req.body.pokemon.NAME}'`, (error, data) => {
        if (error) {
            console.error();
        } else {
            res.send(data);
        }
    })
});

server.delete('/releasePokemon/:user/:name', function(req, res) {
    const user = req.params.user.slice(1);
    const name = req.params.name.slice(1);
    connection.query(`Update ${user} set STATUS = 'Wild' WHERE NAME = '${name}'`, (error, data) => {
        if (error) {
            console.error();
        } else {
            connection.query(`Update ${user} set NICKNAME = null WHERE NAME = '${name}'`, (error, data) => {
                if (error) {
                    console.error();
                } 
            })
            res.send(data);
        }
    })
});

server.listen(port, (error) => {
    if (error) {
        console.console.error();
    } else {
        console.log(`Server says hi from http://${host}:${port}`);
    }
});