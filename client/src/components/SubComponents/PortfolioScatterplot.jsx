import React, { useEffect, useRef, useContext } from 'react'
import * as d3 from 'd3'
import { GamesContext } from '../../contexts/GamesContext'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

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

    const tooltip = d3
      .select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('visibility', 'hidden')
      .style('position', 'absolute')
      .style('text-align', 'left')
      .style('font-size', '16px')
      .style('background-color', 'white')
      .style('border', '1px solid gray')
      .style('border-radius', '4px')
      .style('padding', '5px')

    const handleMouseOver = (event, d) => {
      console.log('Mouse over:', d)

      tooltip
        .style('visibility', 'visible')
        .style('left', `${event.pageX}px`)
        .style('top', `${event.pageY}px`).html(`
        <h4>Sport: ${d.sport}</h4>
        <h4>Game: ${d.awayTeamAbbrev} at ${d.homeTeamAbbrev}</h4>
        <h4>Bet: ${d.index}</h4>
        <h4>Odds: ${Math.round(Number(d.odds))}</h4>
        <h4>Probability: ${Number(d.probability).toFixed(3)}</h4>
        <h4>Wager: ${formatter.format(d.wager)}</h4>
        `)
    }

    const handleMouseOut = (event, d) => {
      console.log('Mouse out:', d)

      tooltip.style('visibility', 'hidden')
    }
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
      .range([0.5, 5]) //d3.max(data.map((elem) => elem.wager))])
    // Define scales
    const xScale = d3.scaleLinear().domain([0, 1]).range([0, w])

    const yScale = d3
      .scaleLinear()
      .domain([
        Math.min(
          -200,
          d3.min(data, (d) => Number(d.odds)) *
            (d3.min(data, (d) => Number(d.odds)) > 0 ? 0.7 : 1.4)
        ),
        Math.max(
          200,
          d3.max(data, (d) => Number(d.odds)) *
            (d3.max(data, (d) => Number(d.odds)) > 0 ? 1.4 : 1.4)
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
      .attr(
        'r',
        (d) =>
          `${wagerScale(Number(d.wager))}${
            viewportWidth > viewportHeight ? 'vw' : 'vh'
          }`
      )
      .attr('fill', (d) => colorScale(allSports.indexOf(d.sport)))
      .attr('opacity', 0.8)
      .attr('stroke', (d) => colorScale(allSports.indexOf(d.sport)))
      .attr('stroke-opacity', 1)
      .attr('stroke-width', 0.8)
      .on('mousemove', handleMouseOver)
      // .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)
      .on('click', (event, d) => {
        console.log(JSON.stringify(d))

        const homeTeamParam = encodeURIComponent(d.homeTeamAbbrev)
        const awayTeamParam = encodeURIComponent(d.awayTeamAbbrev)
        const sportParam = encodeURIComponent(d.sport)

        const url = `/gameView?homeTeam=${homeTeamParam}&awayTeam=${awayTeamParam}&sport=${sportParam}`
        window.open(url, '_blank')
      })

    // Add axis if needed
    const xAxis = d3.axisBottom(xScale)
    const yAxis = d3.axisLeft(yScale)

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, ${yScale(0)})`) // Move the x-axis to the 0 line
      .call(xAxis)

    svg
      .append('g')
      .attr('transform', `translate(${margin.left}, 0)`) // Move the x-axis to the bottom
      .call(yAxis)
  }, [betLegsTable, viewportWidth, viewportHeight])

  return <svg ref={svgRef}></svg>
}

export default PortfolioScatterplot
