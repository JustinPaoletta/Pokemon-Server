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
        console.log('connected');
        return new sql.Request();
    }
});

server.get('/allpokemon', function (req, res) {
    request.query('SELECT * from pokemon', (error, data) => {
        if (error) {
            console.error();
        } else {
            res.send(data.recordsets[0]);
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