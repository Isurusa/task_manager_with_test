import TaskForm from "./components/Task/TaskForm/TaskForm";
import TaskList from "./components/Task/TaskList/TaskList";
import './App.css'

function App() {
  return (
    <div className="container">
      <div className="layout">
        <div className="left-panel">
          <h3>Add a Task</h3>
          <TaskForm />
        </div>
        <div className="vertical_line"></div>
        <div className="right-panel">
          <TaskList />
        </div>
      </div>
    </div>
  );
}

export default App
