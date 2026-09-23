import { useElevatorSystem } from './hooks/useElevatorSystem';
import { ElevatorColumn } from './components/ElevatorColumn';
import './App.css';

function App() {
  const {
    elevators,
    callElevator,
    selectDestination,
    controlDoor,
  } = useElevatorSystem();

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Elevator Simulator</h1>
      </header>

      <main className="elevators-grid">
        {elevators && elevators.length > 0 ? (
          elevators.map((elevator) => (
            <ElevatorColumn
              key={elevator.id}
              elevator={elevator}
              onCall={callElevator}
              onSelectDestination={selectDestination}
              onControlDoor={controlDoor}
            />
          ))
        ) : (
          <div className="loading-state">
            <p>Waiting for elevator system data from backend...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;