const express = require('express');
const server = express();
const { EventEmitter } = require('stream');
const router = require('./src/routes/routes');
const cors = require('cors');
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};

EventEmitter.setMaxListeners(100);

server.use(cors(corsOptions));
server.options('*', cors(corsOptions));
server.disable('x-powered-by');
server.use(express.json());
server.use(express.urlencoded({ extended: false }));

server.use(router);

server.use((err, req, res, next) => {
    res.status(500).json({
        error: err,
        message: 'Internal server error!',
    });
    next();
});

server.listen(4000, () => {
    console.log('App is listening on port 4000');
});
