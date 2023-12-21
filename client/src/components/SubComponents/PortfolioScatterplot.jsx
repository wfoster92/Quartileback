import React, { useEffect, useRef, useContext } from 'react'
import * as d3 from 'd3'
import { GamesContext } from '../../contexts/GamesContext'

const PortfolioScatterplot = () => {
  const { betLegsTable, viewportWidth } = useContext(GamesContext)

  const svgRef = useRef()

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove()

    let data = betLegsTable.filter((elem) => elem.inPortfolio)
    console.log(JSON.stringify(data))

    // set the dimensions and margins of the graph
    const margin = {
      top: viewportWidth * 0.05,
      right: viewportWidth * 0.04,
      bottom: viewportWidth * 0.05,
      left: viewportWidth * 0.08,
    }
    const w =
      viewportWidth <= 750
        ? viewportWidth * 0.88 - margin.left - margin.right
        : viewportWidth * 0.44 - margin.left - margin.right
    const h =
      viewportWidth <= 750
        ? viewportWidth * 0.88 - margin.top - margin.bottom
        : viewportWidth * 0.44 - margin.top - margin.bottom

    // Set up the SVG container
    const svg = d3.select(svgRef.current).attr('width', w).attr('height', h)

    // Define scales
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, w])

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => Number(d.odds)) *
          (d3.min(data, (d) => Number(d.odds)) > 0 ? 0.8 : 1.2),
        d3.max(data, (d) => Number(d.odds)) *
          (d3.max(data, (d) => Number(d.odds)) > 0 ? 1.2 : 1.2),
      ])
      .range([h, 0])

    // Create circles for each data point
    svg
      .selectAll('circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(Number(d.probability)))
      .attr('cy', (d) => yScale(Number(d.odds)))
      .attr('r', (d) => `${Number(d.wager)}px`) // Set the radius of the circles

    // Add axis if needed
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    svg
      .append('g')
      .attr('transform', `translate(0, ${w})`) // Move the x-axis to the bottom
      .call(xAxis)

    svg.append('g').call(yAxis)
  }, [betLegsTable]) // Empty dependency array to run the effect only once

  return <svg ref={svgRef}></svg>
}

export default PortfolioScatterplot
