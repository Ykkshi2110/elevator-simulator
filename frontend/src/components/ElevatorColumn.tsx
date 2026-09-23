import React, { useState } from 'react';
import { type ElevatorStatus, Direction, DoorState } from '../types/elevator.type';

interface ElevatorColumnProps {
    elevator: ElevatorStatus;
    onCall: (floor: number, direction: Direction) => void;
    onSelectDestination: (elevatorId: number, targetFloor: number) => void;
    onControlDoor: (elevatorId: number, action: 'KEEP_OPEN' | 'CLOSE_IMMEDIATELY') => void;
}

export const ElevatorColumn: React.FC<ElevatorColumnProps> = ({
    elevator,
    onCall,
    onSelectDestination,
    onControlDoor,
}) => {
    const floors = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

    const [showDestinationPanel, setShowDestinationPanel] = useState<boolean>(false);

    return (
        <div className="elevator-column">
            <div className="elevator-header">
                <h3>Elevator #{elevator.id}</h3>
                <div className="elevator-badge">
                    <span>Floor: <strong>{elevator.currentFloor}</strong></span>
                    <span>Dir: <strong>{elevator.direction === Direction.UP ? '▲ UP' : elevator.direction === Direction.DOWN ? '▼ DOWN' : '— IDLE'}</strong></span>
                    <span className={`door-badge ${elevator.doorState.toLowerCase()}`}>
                        Door: <strong>{elevator.doorState}</strong>
                    </span>
                </div>
            </div>

            <div className="floors-container">
                {floors.map((floor) => {
                    const isCurrentFloor = elevator.currentFloor === floor;
                    const isDestination = elevator.destinations?.includes(floor);

                    return (
                        <div key={floor} className={`floor-row ${isCurrentFloor ? 'active-floor' : ''}`}>
                            <div className="hall-buttons">
                                {floor < 10 && (
                                    <button
                                        className="btn-call"
                                        title={`Call UP at floor ${floor}`}
                                        onClick={() => onCall(floor, Direction.UP)}
                                    >
                                        ↑
                                    </button>
                                )}
                                {floor > 1 && (
                                    <button
                                        className="btn-call"
                                        title={`Call DOWN at floor ${floor}`}
                                        onClick={() => onCall(floor, Direction.DOWN)}
                                    >
                                        ↓
                                    </button>
                                )}
                            </div>

                            <div
                                className={`cabin-box ${isCurrentFloor ? 'cabin-present' : ''} ${isDestination ? 'is-dest' : ''}`}
                                onClick={() => {
                                    if (isCurrentFloor) setShowDestinationPanel(!showDestinationPanel);
                                }}
                            >
                                <span className="floor-number">{floor}</span>
                                {isCurrentFloor && (
                                    <div className="cabin-visual">
                                        <span className="door-icon">{elevator.doorState === DoorState.OPEN ? '░ ░' : '❚❚'}</span>
                                    </div>
                                )}
                            </div>

                            <div className="door-buttons">
                                <button
                                    className="btn-door"
                                    title="Keep Door Open (◄►)"
                                    disabled={!isCurrentFloor}
                                    onClick={() => onControlDoor(elevator.id, 'KEEP_OPEN')}
                                >
                                    ◄►
                                </button>
                                <button
                                    className="btn-door"
                                    title="Close Door Immediately (►◄)"
                                    disabled={!isCurrentFloor}
                                    onClick={() => onControlDoor(elevator.id, 'CLOSE_IMMEDIATELY')}
                                >
                                    ►◄
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="cabin-destination-panel">
                <p>Inside Cabin #{elevator.id} - Select Destination:</p>
                <div className="destination-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((f) => {
                        const isSelected = elevator.destinations?.includes(f);
                        return (
                            <button
                                key={f}
                                className={`btn-dest ${isSelected ? 'selected' : ''}`}
                                onClick={() => onSelectDestination(elevator.id, f)}
                            >
                                {f}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};