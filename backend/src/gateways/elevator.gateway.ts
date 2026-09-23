import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { ElevatorService } from "../services/elevator.service.js";
import { Logger } from "@nestjs/common";
import { Direction } from "../types/elevator.type.js";

@WebSocketGateway({
    cors: {
        origin: "*"
    }
})
export class ElevatorGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server: Server;

    private readonly logger = new Logger(ElevatorGateway.name);

    constructor(private readonly elevatorService: ElevatorService) { }

    public handleConnection(client: Socket): void {
        this.logger.log('Client connected:', client.id);
        client.emit('elevatorStateUpdate', this.elevatorService.getElevatorStatuses());
    }

    public handleDisconnect(client: Socket): void {
        this.logger.log('Client disconnected:', client.id);
    }

    public broadcastState() {
        if (this.server) {
            this.server.emit('elevatorStateUpdate', this.elevatorService.getElevatorStatuses());
        }
    }

    @SubscribeMessage('callElevator')
    public handleCallElevator(@MessageBody() payload: { floor: number, direction: Direction }) {
        this.logger.log('Received call elevator event:', payload);
        this.elevatorService.callElevator(payload.floor, payload.direction);
        this.broadcastState();
    }

    @SubscribeMessage('selectDestination')
    public handleSelectDestination(@MessageBody() payload: { elevatorId: number, targetFloor: number }) {
        this.logger.log('Received select destination event:', payload);
        this.elevatorService.selectDestination(payload.elevatorId, payload.targetFloor);
        this.broadcastState();
    }

    @SubscribeMessage('controlDoor')
    public handleControlDoor(@MessageBody() payload: { elevatorId: number, action: "KEEP_OPEN" | "CLOSE_IMMEDIATELY" }) {
        this.logger.log('Received control door event:', payload);
        this.elevatorService.controlDoor(payload.elevatorId, payload.action);
        this.broadcastState();
    }
}