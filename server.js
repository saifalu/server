//write server code
const https = require('https')
const fs = require('fs')
const express = require('express')
const socket = require('socket.io')
const mediasoup = require('mediasoup')
const createWorkers = require('./createWorkers.js')
const config = require('./config.js')

const key = fs.readFileSync('192.168.43.184-key.pem')
const cert = fs.readFileSync('192.168.43.184.pem')
const options = {key,cert}

const app = express()

const httpsServer = https.createServer(options, app)

let workers = null;
let router = null;

const initMediaSoup = async()=>{
    workers = await createWorkers()
    router = await workers[0].createRouter({mediaCodecs: config.routerMediaCodecs})
}
initMediaSoup();

const io = socket(httpsServer,  {
    cors: {origin: "*"},
})

io.on('connect', async(socket)=>{
    const ackdata = await socket.emitWithAck('connectionack', "you are connected with server")
    console.log(ackdata)

    //this step is helping for device setup at client side
    socket.on('getRtpCap', ack=>{
        //send back to client
        ack(router.rtpCapabilities)
    })
})

httpsServer.listen(3000, '0.0.0.0',()=>{
    console.log("server listening on port 3000")
})