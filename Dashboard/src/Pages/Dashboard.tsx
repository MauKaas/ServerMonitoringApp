import { useEffect, useState } from "react";
import io from "socket.io-client"
import type { Metrics } from "../Models/Metrics";

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
        setAgents(prev => {
            const filtered = prev.filter(a => a.hostname !== data.hostname);
            return [...filtered, data];
        });
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
        <h1>System monitor</h1>
        <p>Status: {connected ? "Connected" : "Disconnected"} </p>
        {agents.map(agent => (
            <div  className="bg-blue-500 text-white p-4 rounded-lg" key={agent.hostname}>
                <h2>{agent.hostname}</h2>
                <p>{new Date(agent.timestamp).toLocaleTimeString()}</p>
                <p>Cpu: {agent.cpu}</p>
                <p>mem: {agent.memory}</p>
                <p>memTotal: {agent.memoryTotal}</p>
                <p>memUsed: {agent.memoryUsed}</p>
            </div>
      ))}
    </>
  );
}


export default Dashboard