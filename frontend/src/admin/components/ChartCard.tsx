import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, BarChart, Bar } from 'recharts';

interface ChartCardProps {
    title: string;
    subtitle: string;
    type: 'line' | 'bar' | 'area';
    data: any[];
    dataKey: string;
    xKey: string;
    color: string;
    glow: string;
    gradientId: string;
}

const ChartCard: React.FC<ChartCardProps> = ({
    title,
    subtitle,
    type,
    data,
    dataKey,
    xKey,
    color,
    glow,
    gradientId
}) => {
    return (
        <div className="bg-[#0c0c0c]/80 backdrop-blur-md border border-white/10 rounded-3xl p-6 relative overflow-hidden h-[330px] flex flex-col justify-between">
            <div className="flex flex-col mb-4">
                <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">{subtitle}</span>
                <h4 className="text-sm font-black text-white tracking-wider uppercase mt-1">{title}</h4>
            </div>

            <div className="flex-1 w-full h-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'area' ? (
                        <AreaChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <defs>
                                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.4} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0.0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis
                                dataKey={xKey}
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={9}
                                tickLine={false}
                                fontStyle="mono font-bold"
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={9}
                                tickLine={false}
                                fontStyle="mono font-bold"
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '11px',
                                    fontFamily: 'monospace'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke={color}
                                strokeWidth={2.5}
                                fillOpacity={1}
                                fill={`url(#${gradientId})`}
                                style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
                            />
                        </AreaChart>
                    ) : type === 'bar' ? (
                        <BarChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis
                                dataKey={xKey}
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={9}
                                tickLine={false}
                                fontStyle="mono font-bold"
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={9}
                                tickLine={false}
                                fontStyle="mono font-bold"
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '11px',
                                    fontFamily: 'monospace'
                                }}
                            />
                            <Bar
                                dataKey={dataKey}
                                fill={color}
                                radius={[6, 6, 0, 0]}
                                style={{ filter: `drop-shadow(0 0 6px ${glow})` }}
                            />
                        </BarChart>
                    ) : (
                        <LineChart data={data} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                            <XAxis
                                dataKey={xKey}
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={9}
                                tickLine={false}
                                fontStyle="mono font-bold"
                            />
                            <YAxis
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={9}
                                tickLine={false}
                                fontStyle="mono font-bold"
                            />
                            <Tooltip
                                contentStyle={{
                                    background: '#0a0a0a',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontSize: '11px',
                                    fontFamily: 'monospace'
                                }}
                            />
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke={color}
                                strokeWidth={3}
                                dot={{ stroke: color, strokeWidth: 1, r: 3, fill: '#0a0a0a' }}
                                activeDot={{ r: 5, fill: color }}
                                style={{ filter: `drop-shadow(0 0 8px ${glow})` }}
                            />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ChartCard;
