import { useMemo, memo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const MAX_POINTS = {
  "5m":  150,
  "15m": 150,
  "30m": 150,
  "2h":  150,
  "6h":  200,
  "12h": 200,
  "24h": 200,
  "3d":  200,
  "7d":  200,
};

const RANGES_MS = {
  "5m":  5 * 60 * 1000,
  "15m": 15 * 60 * 1000,
  "30m": 30 * 60 * 1000,
  "2h":  2 * 60 * 60 * 1000,
  "6h":  6 * 60 * 60 * 1000,
  "12h": 12 * 60 * 60 * 1000,
  "24h": 24 * 60 * 60 * 1000,
  "3d":  3 * 24 * 60 * 60 * 1000,
  "7d":  7 * 24 * 60 * 60 * 1000,
};

// Largest-Triangle-Three-Buckets downsampling — preserves visual shape
function lttbDownsample(data, threshold) {
  const dataLength = data.length;
  if (dataLength <= threshold) return data;

  const sampled = [];
  let sampledIndex = 0;
  const every = (dataLength - 2) / (threshold - 2);

  sampled[sampledIndex++] = data[0];

  let a = 0;

  for (let i = 0; i < threshold - 2; i++) {
    let avgX = 0, avgY = 0;
    const avgRangeStart = Math.floor((i + 1) * every) + 1;
    const avgRangeEnd = Math.min(Math.floor((i + 2) * every) + 1, dataLength);
    const avgRangeLength = avgRangeEnd - avgRangeStart;

    for (let j = avgRangeStart; j < avgRangeEnd; j++) {
      avgX += data[j].timestamp;
      avgY += data[j].responseTime;
    }
    avgX /= avgRangeLength;
    avgY /= avgRangeLength;

    const rangeOffs = Math.floor(i * every) + 1;
    const rangeTo = Math.min(Math.floor((i + 1) * every) + 1, dataLength);

    const pointAX = data[a].timestamp;
    const pointAY = data[a].responseTime;

    let maxArea = -1, nextA = rangeOffs;

    for (let j = rangeOffs; j < rangeTo; j++) {
      const area = Math.abs(
        (pointAX - avgX) * (data[j].responseTime - pointAY) -
        (pointAX - data[j].timestamp) * (avgY - pointAY)
      );
      if (area > maxArea) {
        maxArea = area;
        nextA = j;
      }
    }

    sampled[sampledIndex++] = data[nextA];
    a = nextA;
  }

  sampled[sampledIndex++] = data[dataLength - 1];
  return sampled;
}

function ResponseTimeChart({ data, range }) {
  const now = Date.now();
  const startTime = now - RANGES_MS[range];

  const chartData = useMemo(() => {
    const mapped = data.map((item) => ({
      timestamp: new Date(item.t).getTime(),
      responseTime: item.rt,
    }));
    return lttbDownsample(mapped, MAX_POINTS[range] ?? 200);
  }, [data, range]);

  const xTickFormatter = useMemo(() => {
    const isMultiDay = ["3d", "7d"].includes(range);
    return (timestamp) => {
      const date = new Date(timestamp);
      return isMultiDay
        ? date.toLocaleDateString([], { month: "short", day: "numeric" })
        : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };
  }, [range]);

  return (
    <div className="h-[197px] md:h-[225px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <XAxis
            dataKey="timestamp"
            type="number"
            domain={[startTime, now]}
            tickFormatter={xTickFormatter}
            scale="time"
            tickCount={6}
          />
          <YAxis tickFormatter={(v) => `${v} ms`} domain={["auto", "auto"]} width={65} />
          <Tooltip
            labelFormatter={(timestamp) =>
              new Date(timestamp).toLocaleString([], {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })
            }
            formatter={(v) => [`${v} ms`, "Response Time"]}
          />
          <Line
            type="monotone"
            dataKey="responseTime"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default memo(ResponseTimeChart);