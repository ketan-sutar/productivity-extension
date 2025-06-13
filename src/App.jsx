import React from "react";
import GoalSetter from "./components/GoalSetter";
import TimeTracker from "./components/TimeTracker";
import TrendChart from "./components/TrendChart";

function App() {
  return (
    <div className="p-4 w-[300px]">
      <h1 className="text-xl font-bold mb-2">Productivity Tracker</h1>
      <GoalSetter />
      <TimeTracker />
      <TrendChart />
    </div>
  );
}

export default App;
