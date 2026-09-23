import { Direction, DoorState, ElevatorStatus } from "../types/elevator.type.js";

export abstract class BaseElevator {
    public readonly id: number;
    protected currentFloor: number;
    protected direction: Direction;
    protected doorState: DoorState;
    protected destinations: number[];

    constructor(id: number, currentFloor: number) {
        this.id = id;
        this.currentFloor = currentFloor;
        this.direction = Direction.IDLE;
        this.doorState = DoorState.CLOSED;
        this.destinations = [];
    }

    public getId(): number {
        return this.id;
    }

    public getCurrentFloor(): number {
        return this.currentFloor;
    }

    public getDirection(): Direction {
        return this.direction;
    }

    public getDoorState(): DoorState {
        return this.doorState;
    }

    public getDestinations(): number[] {
        return this.destinations;
    }

    public abstract canPickup(floor: number, callDirection: Direction): boolean;
    public abstract addDestination(floor: number): void;
    public abstract openDoor(keepOpen: boolean): void;
    public abstract closeDoor(): void;
    public abstract shouldStopAtCurrentFloor(): boolean;
    public abstract clearCurrentFloorDestination(): void;
    public abstract step(): void;
    public abstract getStatus(): ElevatorStatus;
}