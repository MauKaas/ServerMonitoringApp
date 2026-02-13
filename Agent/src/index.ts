import io from "socket.io-client"
import * as si from "systeminformation"
import * as os from "os"
import { time } from "console"

const socket = io("http://localhost:3000")

socket.on("connect", () => {
    console.log("Succesfull connection :)")
    startCollecting()
})

socket.on("disconnect", () => {
    console.log("Disconnected :(")
})

async function collectMetrics(){
    const cpu = await si.currentLoad()
    const mem = await si.mem()

    return {
        hostname: os.hostname(),
        cpu: Math.round(cpu.currentLoad),
        memory: Math.round((mem.used / mem.total) * 100),
        memoryUsed: Math.round(mem.used / 1024 / 1024 / 1024),
        memoryTotal: Math.round(mem.total / 1024 / 1024 / 1024),
        timeStamp: Date.now()
    }
}

function startCollecting() {
    setInterval(async () => {
        const data = await collectMetrics()
        socket.emit("metrics" , data);
        console.log(`CPU: ${data.cpu} | MEM: ${data.memory}`)
    }, 3000);
}