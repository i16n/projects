import React, { useEffect, useRef } from "react";

import * as d3 from "d3";

// Add these constants at the top of the file
const TICKS_PER_WIDTH = 80;
const TICKS_PER_HEIGHT = 50;
const STROKE_WIDTH = 1.5;

// comes in as props from index.tsx
interface IYieldCurveData {
  date: string;
  value: number;
}

interface IYieldCurveChartProps {
  data: IYieldCurveData[];
}

/**
 * Constructs the yield curve chart using D3.js
 * @file manages the yield curve chart
 * @author Isaac Huntsman <isaacjhuntsman@gmail.com>
 */
const YieldCurveChart = ({ data }: IYieldCurveChartProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) {
      return;
    }

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    // Clear previous content
    svg.selectAll("*").remove();

    // Parse the date and value
    // uses YieldCurveData interface.
    // Ensure dates are Date objects and values are numbers
    const parsedData = data.map((d) => ({
      date: new Date(d.date), // Explicitly convert to Date object
      value: +d.value, // Convert to number with unary plus
    }));

    type AxisSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

    /**
     * Constructs the x-axis for the yield curve chart
     * @param g - the SVG group element
     * @param x - the x-scale
     * @param height - the height of the chart
     * @param margin - the margin of the chart
     */
    const xAxis = (
      g: AxisSelection,
      x: d3.ScaleTime<number, number>,
      height: number,
      margin: { bottom: number }
    ) =>
      g.attr("transform", `translate(0,${height - margin.bottom})`).call(
        d3
          .axisBottom(x)
          .ticks(width / TICKS_PER_WIDTH)
          .tickSizeOuter(0)
      );

    /**
     * Constructs the y-axis for the yield curve chart
     * @param g - the SVG group element
     * @param y - the y-scale
     * @param margin - the margin of the chart
     */
    const yAxis = (
      g: AxisSelection,
      y: d3.ScaleLinear<number, number>,
      margin: { left: number }
    ) =>
      g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(height / TICKS_PER_HEIGHT))
        .call((g) => g.select(".domain").remove());

    // Set up scales with explicit type checking
    const x = d3
      .scaleTime()
      .domain(d3.extent(parsedData, (d) => d.date) as [Date, Date])
      .range([margin.left, width - margin.right]);

    const y = d3
      .scaleLinear()
      .domain([
        d3.min(parsedData, (d) => d.value) || 0,
        d3.max(parsedData, (d) => d.value) || 0,
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);

    // Create line generator
    const line = d3
      .line<{ date: Date; value: number }>()
      .defined((d) => !isNaN(d.value))
      .x((d) => x(d.date))
      .y((d) => y(d.value));

    // Append axes
    svg.append("g").call(xAxis, x, height, margin);
    svg.append("g").call(yAxis, y, margin);

    // Append line
    svg
      .append("path")
      .datum(parsedData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", STROKE_WIDTH)
      .attr("d", line);

    // Append horizontal line at y = 0.0
    svg
      .append("line")
      .attr("x1", margin.left)
      .attr("x2", width - margin.right)
      .attr("y1", y(0))
      .attr("y2", y(0))
      .attr("stroke", "red")
      .attr("stroke-width", 1);
  }, [data]);

  return <svg ref={svgRef} width={800} height={400}></svg>;
};

export default YieldCurveChart;
