import { useState, useEffect, useRef, useContext } from 'react'
import * as d3 from 'd3'
import { GamesContext } from '../../contexts/GamesContext'

import styled from '@emotion/styled'
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput'
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Switch,
} from '@mui/material'

// https://observablehq.com/plot/marks/cell
// https://observablehq.com/plot/features/scales#color-scales
// https://d3-graph-gallery.com/graph/heatmap_style.html

const Heatmap = (props) => {
  const { viewportWidth } = useContext(GamesContext)

  const { heatmapData, currentGame, selectedHeatmapType, spread, OU } = props

  const ref = useRef()

  useEffect(() => {
    // get home and away team names

    const [homeTeam, awayTeam] = currentGame.split(' ')
    let highestScore = 0
    let lowestScore = 10000
    let maxProbability = 0
    let minProbability = 1
    if (heatmapData.length === 0) {
      return
    }
    heatmapData.forEach((elem) => {
      // parse the heatmapData obj and get the high and low scores
      let { homeScore, awayScore, probability } = elem
      homeScore = Number(homeScore)
      awayScore = Number(awayScore)
      probability = Number(probability)

      let tempHigh = Math.max(awayScore, homeScore)
      let tempLow = Math.min(awayScore, homeScore)
      if (tempHigh > highestScore) {
        highestScore = tempHigh
      }
      if (tempLow < lowestScore) {
        lowestScore = tempLow
      }
      if (probability > maxProbability) {
        maxProbability = probability
      }
      if (probability < minProbability) {
        minProbability = probability
      }
    })

    // make a NxN base layer array for the heatmap
    const numRange = (start, end, step) => {
      return Array.from(
        Array.from(Array(Math.ceil((end - start) / step)).keys()),
        (x) => start + x * step
      )
    }
    let baseLayer = []
    if (lowestScore === 10000 && highestScore == 0) {
      baseLayer = []
    } else {
      let baseRange = numRange(lowestScore, highestScore + 1, 1)
      baseRange.forEach((x) =>
        baseRange.forEach((y) => {
          baseLayer.push({
            awayScore: x,
            homeScore: y,
            probability: minProbability / 2,
          })
        })
      )
    }

    // to give some padding to the chart
    // highestScore += 1
    // lowestScore -= 1
    if (heatmapData.length === 0) {
      return
    }
    d3.select(ref.current).selectAll('*').remove()

    // set the dimensions and margins of the graph
    // set the dimensions and margins of the graph
    const margin = {
      top: viewportWidth * 0.05,
      right: viewportWidth * 0.04,
      bottom: viewportWidth * 0.1,
      left: viewportWidth * 0.1,
    }
    const width =
      viewportWidth <= 750
        ? viewportWidth * 0.9 - margin.left - margin.right
        : viewportWidth * 0.45 - margin.left - margin.right
    const height =
      viewportWidth <= 750
        ? viewportWidth * 0.9 - margin.top - margin.bottom
        : viewportWidth * 0.45 - margin.top - margin.bottom
    let rectWidth = width / (highestScore - lowestScore)
    let rectHeight = height / (highestScore - lowestScore)

    // append the svg object to the body of the page
    const svg = d3
      .select('#heatmapChart')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`)

    //Read the data
    // d3.csv(
    //   'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv'
    // ).then(function (data) {
    // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
    // const myGroups = Array.from(new Set(data.map((d) => d.group)))
    // const myVars = Array.from(new Set(data.map((d) => d.variable)))

    // Build X scales and axis:
    const x = d3
      .scaleLinear()
      .range([0, width])
      .domain([lowestScore, highestScore])
    svg
      .append('g')
      .style('font-size', 12)
      .attr(
        'transform',
        `translate(${height / 2 / (highestScore - lowestScore)}, ${
          height + height / (highestScore - lowestScore)
        })`
      )
      .call(d3.axisBottom(x).tickSize(0))
      .select('.domain')
      .remove()

    // Build Y scales and axis:
    const y = d3
      .scaleLinear()
      .range([height, 0])
      .domain([lowestScore, highestScore])
    // .padding(0.05)
    svg
      .append('g')
      .style('font-size', 12)
      .attr(
        'transform',
        `translate(0, ${height / 2 / (highestScore - lowestScore)})`
      )
      .call(d3.axisLeft(y).tickSize(0))
      .select('.domain')
      .remove()

    // Build color scale
    const myColor = (home, away, prob) => {
      if (selectedHeatmapType === 'moneyLine') {
        const isTie = home === away

        // Choose color scale based on the condition
        const colorScale = isTie
          ? d3.scaleSequential().interpolator(d3.interpolateGreys)
          : home > away
          ? d3.scaleSequential().interpolator(d3.interpolateGreens)
          : d3.scaleSequential().interpolator(d3.interpolateReds)

        // Set the domain based on the max probability
        colorScale.domain([0, maxProbability])

        return colorScale(prob)
      } else if (selectedHeatmapType === 'spread') {
        const isTie = home - away === spread
        const isHome = home - away > spread
        // Choose color scale based on the condition
        const colorScale = isTie
          ? d3.scaleSequential().interpolator(d3.interpolateGreys)
          : isHome
          ? d3.scaleSequential().interpolator(d3.interpolateBlues)
          : d3.scaleSequential().interpolator(d3.interpolateReds)

        // Set the domain based on the max probability
        colorScale.domain([0, maxProbability])

        return colorScale(prob)
      } else if (selectedHeatmapType === 'overUnder') {
        const combined = home + away
        const isTie = combined === OU
        const isOver = combined > OU
        // console.log(combined, overUnder)
        // Choose color scale based on the condition
        const colorScale = isTie
          ? d3.scaleSequential().interpolator(d3.interpolateGreys)
          : isOver
          ? d3.scaleSequential().interpolator(d3.interpolatePurples)
          : d3.scaleSequential().interpolator(d3.interpolateOranges)

        // Set the domain based on the max probability
        colorScale.domain([0, maxProbability])

        return colorScale(prob)
      }
    }

    // create a tooltip
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
        <h4>Probability: ${d.probability}</h4>
        <h4>${d.awayTeam} ${d.awayScore} ${d.homeTeam} ${d.homeScore}</h4>
        `)
    }

    const handleMouseOut = (event, d) => {
      console.log('Mouse out:', d)

      tooltip.style('visibility', 'hidden')
    }

    // add the baselayer of squares
    svg
      .selectAll()
      .data(baseLayer)
      .join('rect')
      .attr('x', function (d) {
        return x(Number(d.homeScore))
      })
      .attr('y', function (d) {
        return y(Number(d.awayScore))
      })
      // .attr('rx', 2)
      // .attr('ry', 2)
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .style('fill', function (d) {
        return myColor(
          Number(d.homeScore),
          Number(d.awayScore),
          Number(d.probability)
        )
      })
      // .style('stroke-width', 4)
      .style('stroke', 'none')
      .style('opacity', 0.8)
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseOver)
      .on('mouseleave', handleMouseOut)

    // add the squares
    svg
      .selectAll()
      .data(heatmapData)
      .join('rect')
      .attr('x', function (d) {
        return x(Number(d.homeScore))
      })
      .attr('y', function (d) {
        return y(Number(d.awayScore))
      })
      // .attr('rx', 1)
      // .attr('ry', 1)
      .attr('width', rectWidth)
      .attr('height', rectHeight)
      .style('fill', function (d) {
        return myColor(
          Number(d.homeScore),
          Number(d.awayScore),
          Number(d.probability)
        )
      })
      // .style('stroke-width', 4)
      .style('stroke', 'none')
      .style('opacity', 0.8)
      .on('mouseover', handleMouseOver)
      .on('mousemove', handleMouseOver)
      .on('mouseleave', handleMouseOut)
    // )

    // Add subtitle to graph
    svg
      .append('text')
      .attr('x', 10)
      .attr('y', 0)
      .attr('text-anchor', 'left')
      .style('font-size', '2vh')
      .style('font-weight', 600)
      .style('fill', 'black')
      .style('max-width', 400)
      .text('Score Projection')

    // Add x-axis label
    svg
      .append('text')
      .attr('class', 'x-axis-label')
      .attr('x', width / 2)
      .attr('y', height + margin.top + 20) // Adjust the position as needed
      .style('text-anchor', 'middle')
      .style('font-size', '1.5vh')
      .text(`${homeTeam}`)

    // Add y-axis label
    svg
      .append('text')
      .attr('class', 'y-axis-label')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - height / 2)
      .attr('y', 0 - margin.left)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-size', '1.5vh')
      .text(`${awayTeam}`)
  }, [heatmapData, viewportWidth, selectedHeatmapType])

  return (
    <>
      <svg
        width={
          viewportWidth <= 750 ? viewportWidth * 0.9 : viewportWidth * 0.45
        }
        height={
          viewportWidth <= 750 ? viewportWidth * 0.9 : viewportWidth * 0.45
        }
        id='heatmapChart'
        ref={ref}
      />
    </>
  )
}

export default Heatmap
