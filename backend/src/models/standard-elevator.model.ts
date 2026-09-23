import { BaseElevator } from "./base-elevator.model.js";
import { Direction, DoorState, ElevatorStatus } from "../types/elevator.type.js";

export class StandardElevator extends BaseElevator {
    private upDestinations: Set<number> = new Set();
    private downDestinations: Set<number> = new Set();
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

        if (floor > this.currentFloor) {
            this.upDestinations.add(floor);
        } else {
            this.downDestinations.add(floor);
        }

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
        if (this.direction === Direction.UP) {
            return this.upDestinations.has(this.currentFloor);
        }

        if (this.direction === Direction.DOWN) {
            return this.downDestinations.has(this.currentFloor);
        }

        return false;
    }

    public clearCurrentFloorDestination(): void {
        if (this.direction === Direction.UP) {
            this.upDestinations.delete(this.currentFloor);
        } else if (this.direction === Direction.DOWN) {
            this.downDestinations.delete(this.currentFloor);
        }
    }

    public step(): void {
        if (this.doorState === DoorState.OPEN) return;

        if (this.shouldStopAtCurrentFloor()) {
            this.openDoor(false);
            this.clearCurrentFloorDestination();
            this.updateDirection();
            return;
        }

        if (this.direction === Direction.UP) {
            this.currentFloor++;
        } else if (this.direction === Direction.DOWN) {
            this.currentFloor--;
        }

        if (this.shouldStopAtCurrentFloor()) {
            this.openDoor(false);
            this.clearCurrentFloorDestination();
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
            destinations: [...this.upDestinations, ...this.downDestinations]
        };
    }

    private updateDirection(): void {
        const hasUp = this.upDestinations.size > 0;
        const hasDown = this.downDestinations.size > 0;

        if (!hasUp && !hasDown) {
            this.direction = Direction.IDLE;
            return;
        }

        if (this.direction === Direction.UP) {
            const hasMoreAbove = Array.from(this.upDestinations).some(f => f >= this.currentFloor);

            if (!hasMoreAbove && hasDown) {
                this.direction = Direction.DOWN;
            }
        } else if (this.direction === Direction.DOWN) {
            const hasMoreBelow = Array.from(this.downDestinations).some(f => f <= this.currentFloor);

            if (!hasMoreBelow && hasUp) {
                this.direction = Direction.UP;
            }
        } else if (this.direction === Direction.IDLE) {
            if (hasUp) {
                this.direction = Direction.UP;
            } else if (hasDown) {
                this.direction = Direction.DOWN;
            }
        }
    }
}