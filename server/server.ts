require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
import { Socket } from 'socket.io';

const server = require('express')();

const serviceAccount = require('./service-account.json')

const admin = require('firebase-admin')
admin.initializeApp({
  Credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore(); 

interface ScoreSubmission {
  tokenid: string,
  score: number,
  name: string,
  scoreCount: number,
}

const http = require('http').createServer(server);

const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const port = process.env.PORT || 8080;

const connectedGotchis = {};

io.on('connection', function (socket: Socket) {
    const userId = socket.id;
    
    console.log('A user connected: ' + userId);
    connectedGotchis[userId] = {id: userId};
    console.log(connectedGotchis)

    // socket.on('gameOver', () => {
    //   console.log('game started: ', userId)
    // })

    socket.on('setGotchiData', (gotchi) => {
      connectedGotchis[userId].gotchi = gotchi;
    })

    socket.on('gameOver', async ({ score, scoreCount }: { score: number, scoreCount: number}) => {
      console.log('gameOver', userId)
      console.log('score: ', score)
      console.log('score counter', scoreCount)
    })

    socket.on('handleDisconnect', () => {
      socket.disconnect();
    })

    socket.on('disconnect', function () {
      console.log('A user disconnected: ' + userId);
      delete connectedGotchis[userId];
    });
});

http.listen(port, function () {
    console.log(`Listening on - PORT:${port}`);
});

