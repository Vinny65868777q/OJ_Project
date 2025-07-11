import React from 'react';
import { ResponsiveContainer, LineChart, Line, Tooltip, XAxis, YAxis, CartesianGrid,Area,
   } from 'recharts';

export default function Chart({ data }) {
  // data e.g. [{ date:"2025-07-08", count:3 }, …]
     if (!data.some(pt => pt.count > 0)) {
    return (
      <div style={{ textAlign: 'center', color: '#667', fontSize: 12 }}>
        – no data –
      </div>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={120}>
       <LineChart data={data} margin={{ left: -20, right: 10, top: 0, bottom: 0 }}>
        {/* soft grid */}
        <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
         <XAxis
          dataKey="date"
          tick={false}
          axisLine={false}
          padding={{ left: 2, right: 2 }}
        />
        <YAxis hide domain={[0, 'dataMax + 1']} />
         <Tooltip
          contentStyle={{
            background: '#202844',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            color: '#fff',
          }}
          formatter={(value) => [`${value} solved`, '']}
          labelFormatter={(label) => label}/>
         <Line
          type="monotone"
          dataKey="count"
          stroke="#4aa8ff"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
    
  );
}
