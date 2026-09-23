import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ElevatorService } from "./elevator.service.js";
import { ElevatorGateway } from "../gateways/elevator.gateway.js";

@Injectable()
export class SimulatorService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(SimulatorService.name);
    private timer: NodeJS.Timeout | null = null;

    constructor(
        private readonly elevatorService: ElevatorService,
        private readonly elevatorGateway: ElevatorGateway
    ) { };

    public onModuleInit(): void {
        this.logger.log('Starting elevator simulator...');
        this.timer = setInterval(() => {
            this.elevatorService.tick();
            this.elevatorGateway.broadcastState();
        }, 1000);
    }

    public onModuleDestroy(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.logger.log('Elevator simulator loop stopped.')
        }
    }

}