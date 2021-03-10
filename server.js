const cors = require('cors');
const express = require('express');
let server = express();

const host = 'localhost';
const port = 8000;

const sql = require('mssql');
const config = {
    user: 'SA',
    password: '321LearnDocker!',
    server: 'localhost', 
    database: 'Pokedex', 
};

server.use('*', cors());

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

const request = sql.connect(config, (error) => {
    if (error) {
        console.error();
    } else {
        console.log('connected to database');
        return new sql.Request();
    }
});

server.get('/allpokemon:user', function (req, res) {
    const user = req.params.user.slice(1);
    request.query(`SELECT * from ${user}`, (error, data) => {
        if (error) {
            console.error();
        } else {
            res.send(data.recordsets[0]);
        }
    })
});

server.get('/allWildPokemon:user', function (req, res) {
    const user = req.params.user.slice(1);
    request.query(`SELECT * from ${user} WHERE STATUS = 'Wild'`, (error, data) => {
        if (error) {
            console.error();
        } else {
            res.send(data.recordsets[0]);
        }
    })
});

server.post('/catch', function(req, res) {
    const serial = req.body.serial;
    const user = req.body.user;
    request.query(`UPDATE ${user} set STATUS = 'Caught' where SERIAL = ${serial}`, (error, data) => {
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
    request.query(
        `IF NOT EXISTS(SELECT 1 FROM users WHERE email = N'${user.email}')
            BEGIN
                INSERT INTO users VALUES ('${user.nickname}', '${user.name}', '${user.picture}', '${user.updated_at}', '${user.email}',
                ${bool}, '${user.sub}');
                SELECT *
                INTO ${user.nickname}
                FROM pokemon
            END`, (error, data) => {
        if (error) {
            console.error();
        } else {
            res.send(data);
        }
    })
});

server.get('/pokemon-boxes:user', function(req, res) {
    const user = req.params.user.slice(1);
    request.query(`SELECT * FROM ${user} WHERE STATUS = 'Caught'`, (error, data) => {
        if (error) {
            console.error();
        } else {
            res.send(data.recordsets[0]);
        }
    });
});

server.put('/changeName', function(req, res) {
    request.query(`UPDATE ${req.body.user} set NAME = '${req.body.newName}' WHERE NAME = '${req.body.pokemon.NAME}'`, (error, data) => {
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
    request.query(`Update ${user} set STATUS = 'Wild' WHERE NAME = '${name}'`, (error, data) => {
        if (error) {
            console.error();
        } else {
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