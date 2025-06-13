import React, { useEffect, useState } from "react";

const TimeTracker = () => {
  const [data, setData] = useState({});
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    chrome.storage.local.get([today], (res) => {
      setData(res[today] || {});
    });
  }, []);

  return (
    <div className="mb-3">
      <h2 className="font-semibold mb-1">Time Today:</h2>
      <ul className="text-sm max-h-[100px] overflow-y-auto">
        {Object.entries(data).map(([host, seconds]) => (
          <li key={host}>
            {host}: {(seconds / 60).toFixed(1)} min
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeTracker;
