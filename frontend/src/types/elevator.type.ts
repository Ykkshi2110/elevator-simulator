export const Direction = {
    UP: "UP",
    DOWN: "DOWN",
    IDLE: "IDLE"
} as const;

export type Direction = (typeof Direction)[keyof typeof Direction];

export const DoorState = {
    OPEN: "OPEN",
    CLOSED: "CLOSED",
} as const;

export type DoorState = (typeof DoorState)[keyof typeof DoorState];

export interface ElevatorStatus {
    id: number;
    currentFloor: number;
    direction: Direction;
    doorState: DoorState;
    destinations: number[];
}