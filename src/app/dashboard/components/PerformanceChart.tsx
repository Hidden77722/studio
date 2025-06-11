"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

interface PerformanceChartProps {
  data: { date: string; value: number }[];
  title: string;
  description: string;
  dataKey: string;
  chartType?: 'line' | 'bar';
  color?: string; // e.g. "hsl(var(--primary))"
}

export function PerformanceChart({ data, title, description, dataKey, chartType = 'line', color }: PerformanceChartProps) {
  const chartConfig = {
    [dataKey]: {
      label: dataKey.charAt(0).toUpperCase() + dataKey.slice(1), // Capitalize
      color: color || "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8} 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  domain={['auto', 'auto']}
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" hideLabel />}
                  wrapperStyle={{ outline: "none" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={chartConfig[dataKey].color} 
                  strokeWidth={2} 
                  dot={false} 
                />
              </LineChart>
            ) : (
              <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8} 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tickMargin={8}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  wrapperStyle={{ outline: "none" }}
                />
                <Bar dataKey="value" fill={chartConfig[dataKey].color} radius={4} />
              </BarChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
