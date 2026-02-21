import { useEffect, useState } from "react";
import io from "socket.io-client"
import type { Metrics } from "../Models/Metrics";
import Progressbar from "../Components/Progressbar/Progressbar";

const socket = io('http://localhost:3000')

function Dashboard() {
    const [connected, setConnected] = useState<boolean>(false)
    const [agents, setAgents] = useState<Metrics[]>([])

    useEffect(() => {
        socket.on("connect", () => {
            setConnected(true)
            socket.emit("getData")
        })

        socket.on("disconnect", () => setConnected(false))

        socket.on("allData", (data: Metrics[]) => {
            setAgents(data)
        })

        socket.on('update', (data: Metrics) => {
        setAgents(prev => prev.map(a => a.hostname === data.hostname ? data : a));
        });

        return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('allData');
        socket.off('update');
        };
    }, []);

  return (
    <>
        <div className="max-w-4xl mx-auto px-5">

            <h1 className="text-lime-600 text-3xl font-bold">Maurits Zundert Data-center wheujjjjj</h1>

            <p className="text-slate-100 text-xl font-mono">Status: {connected ? "Connected" : "Disconnected"} </p>
            <br />
            
            <div className="flex flex-wrap gap-4">
            {agents.map(agent => (
                <div className="flex-1 min-w-75 bg-zinc-800 rounded-2xl p-4" key={agent.hostname}>
                    <h2 className="text-slate-100 text-xl font-bold mb-2">{agent.hostname}</h2>
                    <p className="text-slate-100 text-sm">{new Date(agent.timestamp).toLocaleTimeString()}</p>
                    <p className="text-slate-100">Cpu: {agent.cpu}</p>
                    <Progressbar value={agent.cpu} color="bg-pink-600"></Progressbar>
                    <p className="text-slate-100">Mem: {agent.memoryUsed}/{agent.memoryTotal}</p>
                    <Progressbar value={agent.memory} color="bg-lime-600"></Progressbar>
                </div>
            ))}
            </div>

      </div>
    </>
  );
}


export default Dashboard