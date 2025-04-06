const os = require('os')
const totalThreads = os.cpus().length        //max no of allowed workers
//console.log(totalThreads)
const config = require('./config.js')
const mediasoup = require('mediasoup')

const createWorkers = async()=> new Promise(async(resolve, reject) => {
    let workers = [];
    //loop to create each worker
    for(let i=0; i<totalThreads; i++){
        const worker = await mediasoup.createWorker({
            //rtcMinPort and Max are just arbitrary ports for our traffic
            //useful for firewall and networking rules
            rtcMinPort: config.workerSettings.rtcMinPort,
            rtcMaxPort: config.workerSettings.rtcMaxPort,
            logLevel: config.workerSettings.logLevel,
            logTags: config.workerSettings.logTags,
        })
        worker.on('died',()=>{
            process.exit(1)                               //kill the node program
        })
        workers.push(worker)
    }
    resolve(workers)
})

module.exports = createWorkers