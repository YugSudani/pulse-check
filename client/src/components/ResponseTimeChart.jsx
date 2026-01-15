import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";


export default function ResponseTimeChart({ data, range }) {
    // Transform data to ensure timestamps are properly parsed
    const chartData = data.map(item => ({
        timestamp: new Date(item.t).getTime(), // Convert to timestamp for consistent sorting
        responseTime: item.rt,
        dateString: item.t // Keep original for tooltip
    }));
    // Calculate time domain for full range display
    const now = Date.now();
    const ranges = {
        '5m': 5 * 60 * 1000,
        '15m': 15 * 60 * 1000,
        '30m': 30 * 60 * 1000,
        '2h': 2 * 60 * 60 * 1000,
        '6h': 6 * 60 * 60 * 1000,
        '12h': 12 * 60 * 60 * 1000,
        '24h': 24 * 60 * 60 * 1000,
    };
    const startTime = now - ranges[range];
    return (
        <div className="h-[24vh] md:h-[27.5vh] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                    <XAxis
                        dataKey="timestamp"
                        type="number"
                        domain={[startTime, 'dataMax']}
                        tickFormatter={(timestamp) => {
                            const date = new Date(timestamp);
                            return date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            });
                        }}
                        scale="time"
                    />
                    <YAxis
                        tickFormatter={(v) => `${v} ms`}
                        domain={["auto", "auto"]}
                    />
                    <Tooltip
                        labelFormatter={(timestamp) => {
                            const date = new Date(timestamp);
                            return date.toLocaleString([], {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            });
                        }}
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