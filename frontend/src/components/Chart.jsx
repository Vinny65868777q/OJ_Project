import React from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function Chart({ data }) {
  // data e.g. [{ date:"2025-07-08", count:3 }, …]
  console.log(data); 
  return (
    <ResponsiveContainer width="100%" height={120}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
        <XAxis dataKey="date" hide />
        <YAxis hide />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="count"
          stroke="#4aa8ff"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
    
  );
}
