import React, { useState, useEffect } from "react";

const GoalSetter = () => {
  const [goal, setGoal] = useState("");

  useEffect(() => {
    chrome.storage.local.get(["dailyGoal"], (result) => {
      setGoal(result.dailyGoal || "");
    });
  }, []);

  const handleSave = () => {
    chrome.storage.local.set({ dailyGoal: goal });
  };

  return (
    <div className="mb-3">
      <input
        className="border p-1 w-full mb-1"
        placeholder="Set today's goal"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white w-full p-1 rounded"
        onClick={handleSave}
      >
        Save Goal
      </button>
    </div>
  );
};

export default GoalSetter;
