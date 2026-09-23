import { Injectable } from "@nestjs/common";
import { StandardElevator } from "../models/standard-elevator.model.js";
import { Direction, ElevatorStatus } from "../types/elevator.type.js";

@Injectable()
export class ElevatorService {
    private elevators: StandardElevator[] = [];

    constructor() {
        this.elevators = [
            new StandardElevator(1, 1),
            new StandardElevator(2, 1),
            new StandardElevator(3, 1),
        ]
    }

    public getElevatorStatuses(): ElevatorStatus[] {
        return this.elevators.map(e => e.getStatus());
    }

    public getElevatorById(id: number): StandardElevator | undefined {
        return this.elevators.find(e => e.id === id);
    }

    public callElevator(floor: number, callDirection: Direction): void {
        if (floor < 1 || floor > 10) {
            throw new Error("Floor out of range");
        }

        let bestElevator: StandardElevator | null = null;
        let minCost = Infinity;

        for (const elevator of this.elevators) {
            const currentFloor = elevator.getCurrentFloor();
            const distance = Math.abs(floor - currentFloor);

            const isTerminalTurnaround =
                (floor === 1 && callDirection === Direction.UP && elevator.getDirection() === Direction.DOWN)
                || (floor === 10 && callDirection === Direction.DOWN && elevator.getDirection() === Direction.UP);

            let cost: number;
            if (elevator.canPickup(floor, callDirection) || isTerminalTurnaround) {
                cost = distance;
            } else if (elevator.getDirection() === Direction.IDLE) {
                cost = distance + 1;
            } else {
                cost = distance + 10;
            }

            if (cost < minCost) {
                minCost = cost;
                bestElevator = elevator;
            }
        }

        if (bestElevator) {
            bestElevator.addDestination(floor);
        }
    }

    public selectDestination(elevatorId: number, targetFloor: number): void {
        const elevator = this.getElevatorById(elevatorId);
        if (!elevator) {
            throw new Error(`Elevator with ID ${elevatorId} not found`);
        }
        elevator.addDestination(targetFloor);
    }

    public controlDoor(elevatorId: number, action: "KEEP_OPEN" | "CLOSE_IMMEDIATELY"): void {
        const elevator = this.getElevatorById(elevatorId);

        if (!elevator) return;

        if (action === "KEEP_OPEN") {
            elevator.openDoor(true);
        } else if (action === "CLOSE_IMMEDIATELY") {
            elevator.closeDoor();
        } else {
            throw new Error(`Invalid action ${action}`)
        }
    }

    public tick(): void {
        this.elevators.forEach(elevator => elevator.step());
    }
}