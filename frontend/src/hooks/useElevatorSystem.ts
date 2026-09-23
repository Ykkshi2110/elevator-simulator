import { useEffect, useState } from "react";
import { io, type Socket } from "socket.io-client";
import type { Direction, ElevatorStatus } from "../types/elevator.type";

const SOCKET_SERVER_URL = 'http://localhost:3000';

export const useElevatorSystem = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [elevators, setElevators] = useState<ElevatorStatus[]>([]);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        const socketInstance = io(SOCKET_SERVER_URL);

        socketInstance.on('connect', () => {
            setIsConnected(true);
        })

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        })

        socketInstance.on('elevatorStateUpdate', (elevatorsData: ElevatorStatus[]) => {
            setElevators(elevatorsData);
        })

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        }

    }, []);

    const callElevator = (floor: number, direction: Direction) => {
        if (socket) {
            socket.emit('callElevator', { floor, direction });
        }
    };

    const selectDestination = (elevatorId: number, targetFloor: number) => {
        if (socket) {
            socket.emit('selectDestination', { elevatorId, targetFloor });
        }
    };

    const controlDoor = (elevatorId: number, action: 'KEEP_OPEN' | 'CLOSE_IMMEDIATELY') => {
        if (socket) {
            socket.emit('controlDoor', { elevatorId, action });
        }
    }

    return { elevators, isConnected, callElevator, selectDestination, controlDoor };
}