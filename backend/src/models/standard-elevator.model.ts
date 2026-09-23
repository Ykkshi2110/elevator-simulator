import { BaseElevator } from "./base-elevator.model.js";
import { Direction, DoorState, ElevatorStatus } from "../types/elevator.type.js";

export class StandardElevator extends BaseElevator {
    private destinationsSet: Set<number> = new Set();
    private isDoorHelpOpen: boolean = false;
    private doorTimer: NodeJS.Timeout | null = null;

    constructor(id: number, initialFloor = 1) {
        super(id, initialFloor);
    }

    public canPickup(floor: number, callDirection: Direction): boolean {
        if (this.direction === callDirection) {
            if (this.direction === Direction.UP && floor >= this.currentFloor) return true;
            if (this.direction === Direction.DOWN && floor <= this.currentFloor) return true;
        }

        return false;
    }

    public addDestination(floor: number): void {
        if (floor < 1 || floor > 10) return;

        if (floor === this.currentFloor) {
            this.openDoor();
            return;
        }

        this.destinationsSet.add(floor);

        if (this.direction === Direction.IDLE) {
            this.direction = floor > this.currentFloor ? Direction.UP : Direction.DOWN;
        }
    }

    public openDoor(keepOpen: boolean = false, autoCloseDurationMs = 3000): void {
        this.doorState = DoorState.OPEN;

        if (this.doorTimer) {
            clearTimeout(this.doorTimer);
            this.doorTimer = null;
        }

        if (keepOpen) {
            this.isDoorHelpOpen = true;
            return;
        }

        this.isDoorHelpOpen = false;
        this.doorTimer = setTimeout(() => {
            if (!this.isDoorHelpOpen) {
                this.closeDoor();
            }
        }, autoCloseDurationMs);
    }

    public closeDoor(): void {
        this.doorState = DoorState.CLOSED;
        this.isDoorHelpOpen = false;

        if (this.doorTimer) {
            clearTimeout(this.doorTimer);
            this.doorTimer = null;
        }
    }

    public shouldStopAtCurrentFloor(): boolean {
        return this.destinationsSet.has(this.currentFloor);
    }

    public clearCurrentFloorDestination(): void {
        this.destinationsSet.delete(this.currentFloor);
    }

    public step(): void {
        if (this.doorState === DoorState.OPEN) return;

        if (this.shouldStopAtCurrentFloor()) {
            this.openDoor(false);
            this.clearCurrentFloorDestination();
            this.updateDirection();
            return;
        }

        if (this.direction === Direction.UP && this.currentFloor < 10) {
            this.currentFloor++;
        } else if (this.direction === Direction.DOWN && this.currentFloor > 1) {
            this.currentFloor--;
        }

        if (this.shouldStopAtCurrentFloor()) {
            this.openDoor(false);
            this.clearCurrentFloorDestination();
            this.updateDirection();
            return;
        }

        this.updateDirection();
    }

    public getStatus(): ElevatorStatus {
        return {
            id: this.id,
            currentFloor: this.currentFloor,
            direction: this.direction,
            doorState: this.doorState,
            destinations: Array.from(this.destinationsSet)
        };
    }

    private updateDirection(): void {
        if (this.destinationsSet.size === 0) {
            this.direction = Direction.IDLE;
            return;
        }

        const targets = Array.from(this.destinationsSet);
        const hasAbove = targets.some((f) => f > this.currentFloor);
        const hasBelow = targets.some((f) => f < this.currentFloor);

        if (this.direction === Direction.UP) {
            if (!hasAbove) {
                this.direction = hasBelow ? Direction.DOWN : Direction.IDLE;
            }
        } else if (this.direction === Direction.DOWN) {
            if (!hasBelow) {
                this.direction = hasAbove ? Direction.UP : Direction.IDLE;
            }
        } else if (this.direction === Direction.IDLE) {
            if (hasAbove) {
                this.direction = Direction.UP;
            } else if (hasBelow) {
                this.direction = Direction.DOWN;
            }
        }
    }
}