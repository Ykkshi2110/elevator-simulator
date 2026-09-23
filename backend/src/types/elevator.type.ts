export enum Direction {
    UP = "UP",
    DOWN = "DOWN",
    IDLE = "IDLE"
}

export enum DoorState {
    OPEN = "OPEN",
    CLOSED = "CLOSED"
}

export interface ElevatorStatus {
    id: number;
    currentFloor: number;
    direction: Direction;
    doorState: DoorState;
    destinations: number[];
}
