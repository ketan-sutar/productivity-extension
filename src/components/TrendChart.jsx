import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const generateColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i++) {
    const hue = Math.floor((360 / count) * i);
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const TrendChart = () => {
  const [trendData, setTrendData] = useState([]);
  const [websites, setWebsites] = useState([]);
  const [colors, setColors] = useState([]);
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    chrome.storage.local.get(null, (items) => {
      const dateEntries = Object.entries(items).filter(([key]) =>
        /^\d{4}-\d{2}-\d{2}$/.test(key)
      );

      const allWebsites = new Set();
      dateEntries.forEach(([_, stats]) => {
        Object.keys(stats).forEach((website) => allWebsites.add(website));
      });

      const websiteList = Array.from(allWebsites);
      setWebsites(websiteList);
      setColors(generateColors(websiteList.length)); // Set dynamic colors

      const processedData = dateEntries.slice(-7).map(([date, stats]) => {
        const dayData = { date };
        websiteList.forEach((website) => {
          const seconds = stats[website] || 0;
          dayData[website] = parseFloat((seconds / 60).toFixed(1)); // convert to minutes
        });
        return dayData;
      });

      setTrendData(processedData);
    });
  }, []);

  const renderLines = () =>
    websites.map((website, index) => (
      <Line
        key={website}
        type="monotone"
        dataKey={website}
        stroke={colors[index % colors.length]}
        strokeWidth={2}
        dot={{ r: 3 }}
        activeDot={{ r: 6 }}
      />
    ));

  const renderBars = () =>
    websites.map((website, index) => (
      <Bar
        key={website}
        dataKey={website}
        fill={colors[index % colors.length]}
      />
    ));

  const renderAreas = () =>
    websites.map((website, index) => (
      <Area
        key={website}
        type="monotone"
        dataKey={website}
        stroke={colors[index % colors.length]}
        fill={colors[index % colors.length]}
      />
    ));

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <h2 className="font-semibold text-sm">
          Time Spent by Website (Past 7 Days)
        </h2>
        <select
          className="border text-sm px-2 py-1 rounded"
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="area">Area</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        {chartType === "line" && (
          <LineChart data={trendData}>
            <XAxis dataKey="date" />
            <YAxis
              label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(value, name) => [`${value} minutes`, name]} />
            {renderLines()}
          </LineChart>
        )}

        {chartType === "bar" && (
          <BarChart data={trendData}>
            <XAxis dataKey="date" />
            <YAxis
              label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(value, name) => [`${value} minutes`, name]} />
            {renderBars()}
          </BarChart>
        )}

        {chartType === "area" && (
          <AreaChart data={trendData}>
            <XAxis dataKey="date" />
            <YAxis
              label={{ value: "Minutes", angle: -90, position: "insideLeft" }}
            />
            <Tooltip formatter={(value, name) => [`${value} minutes`, name]} />
            {renderAreas()}
          </AreaChart>
        )}
      </ResponsiveContainer>

      {/* Custom scrollable legend */}
      <div className="overflow-x-auto mt-2">
        <div className="flex space-x-4 min-w-max">
          {websites.map((website, index) => (
            <div key={website} className="flex items-center space-x-1 text-sm">
              <div
                className="w-4 h-4 rounded-sm"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="whitespace-nowrap">{website}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrendChart;
