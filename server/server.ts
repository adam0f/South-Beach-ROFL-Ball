require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
import { Socket } from 'socket.io';

const server = require('express')();

const serviceAccount = require('./service-account.json')

const admin = require('firebase-admin')
admin.initializeApp({
  Credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore(); 

interface dataSubmission {
  tokenId: string,
  score: number,
  name: string,
  scoreCount: number,
  serverCount: number, 
}

const gameOverDataSubmit = async ({tokenId, score, name, scoreCount, serverCount}: dataSubmission) => {
  const collection = db.collection('test')
  const ref = collection.doc(tokenId)
  const doc = await ref.get().catch(err => {return {status: 400, error: err}})
  
  if ('error' in doc) return doc;

 if (!doc.exists || doc.data().score < score) {
   try {
     await ref.set({
       tokenId,
       name,
       score, 
       scoreCount,
       serverCount,
     });
     return {
       status: 200,
       error: undefined
     }
   } catch (err) {
     return {
       status: 400,
       error: err
     };
   }
 } else {
   return {
     status: 400,
     error: "Score not larger than original"
   }
 }


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
    let timeStarted: Date
    
    console.log('A user connected: ' + userId);
    connectedGotchis[userId] = {id: userId};
    console.log(connectedGotchis)

    socket.on('gameStarted', () => {
      console.log('game started: ', userId)
      timeStarted = new Date()
    })

    socket.on('setGotchiData', (gotchi) => {
      connectedGotchis[userId].gotchi = gotchi;
    })

    socket.on('gameOver', async ({ score, scoreCount }: { score: number, scoreCount: number}) => {
      console.log('gameOver', userId)
      console.log('score: ', score)
      
      const now = new Date()
      const dt = now.getTime() - timeStarted.getTime()
      const scoreScale = 0.004 
      const delay = 0.5
      const serverCount = Math.round(dt * scoreScale + delay)

      if (scoreCount < serverCount) {
        const highScoreData = {
          score, 
          name: connectedGotchis[userId].gotchi.name,
          tokenId: connectedGotchis[userId].gotchi.tokenId,
          scoreCount,
          serverCount
        }
        console.log("submit score: ", score, "app count: ", scoreCount, "server count: ", serverCount)

        try {
          const res = await gameOverDataSubmit(highScoreData)
        } catch {
          
        }

      } else {
        console.log("somethin dont add up ---->", score, scoreCount, serverCount)

      }

      
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

