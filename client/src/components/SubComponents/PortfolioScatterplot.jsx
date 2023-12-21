import React, { useEffect, useRef, useContext } from 'react'
import * as d3 from 'd3'
import { GamesContext } from '../../contexts/GamesContext'

const PortfolioScatterplot = () => {
  const { betLegsTable, viewportWidth, viewportHeight } =
    useContext(GamesContext)

  const svgRef = useRef()

  useEffect(() => {
    d3.select(svgRef.current).selectAll('*').remove()
    console.log(viewportWidth)
    let data = betLegsTable.filter((elem) => elem.inPortfolio)
    let allBetTypes = [...new Set(betLegsTable.map((elem) => elem.index))]
    let allSports = [...new Set(betLegsTable.map((elem) => elem.sport))]

    // Create a sequential color scale using scaleSequential
    const colorScale = d3
      .scaleSequential()
      .domain([0, allSports.length - 1])
      .interpolator(d3.interpolateCool)

    console.log(JSON.stringify(data))

    // set the dimensions and margins of the graph
    const margin = {
      top: viewportHeight * 0.05,
      right: viewportWidth * 0.04,
      bottom: viewportHeight * 0.05,
      left: viewportWidth * 0.08,
    }
    const w =
      viewportWidth <= 750
        ? viewportWidth * 0.88 - margin.left - margin.right
        : viewportWidth * 0.84 - margin.left - margin.right
    const h =
      viewportHeight <= 750
        ? viewportHeight * 0.88 - margin.top - margin.bottom
        : viewportHeight * 0.84 - margin.top - margin.bottom

    // Set up the SVG container
    const svg = d3.select(svgRef.current).attr('width', w).attr('height', h)

    const wagerScale = d3
      .scaleLinear()
      .domain([0, d3.max(data.map((elem) => elem.wager))])
      .range([5, 50]) //d3.max(data.map((elem) => elem.wager))])
    // Define scales
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, w])

    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(
          -200,
          d3.min(data, (d) => Number(d.odds)) *
            (d3.min(data, (d) => Number(d.odds)) > 0 ? 0.8 : 1.2)
        ),
        Math.max(
          200,
          d3.max(data, (d) => Number(d.odds)) *
            (d3.max(data, (d) => Number(d.odds)) > 0 ? 1.2 : 1.2)
        ),
      ])
      .range([h, 0])

    // Create circles for each data point
    svg
      .selectAll('circle')
      .data(data.sort((a, b) => Number(b.wager) - Number(a.wager)))
      .enter()
      .append('circle')
      .attr('cx', (d) => xScale(Number(d.probability)))
      .attr('cy', (d) => yScale(Number(d.odds)))
      .attr('r', (d) => `${wagerScale(Number(d.wager))}px`)
      .attr('fill', (d) => colorScale(allSports.indexOf(d.sport)))

    // Add axis if needed
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${yScale(0)})`) // Move the x-axis to the bottom
      .call(xAxis)

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`) // Move the x-axis to the bottom
      .call(yAxis)
  }, [betLegsTable, viewportWidth, viewportHeight]) // Empty dependency array to run the effect only once

  return <svg ref={svgRef}></svg>
}

export default PortfolioScatterplot
