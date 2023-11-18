import { useState, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import styled from '@emotion/styled'
import csv from 'csvtojson'

import CasinoIcon from '@mui/icons-material/Casino'

const Spread = (props) => {
  const { data } = props
  const ref = useRef()
  useEffect(() => {
    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 }
    const w = 1000 - margin.left - margin.right
    const h = 600 - margin.top - margin.bottom

    // append the svg object to the body of the page
    const svg = d3
      .select('#spreadBarChart')
      .append('svg')
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    const keys = Object.keys(data)
      .map((elem) => Number(elem))
      .sort((a, b) => a - b)
    const minScore = keys[0]
    const maxScore = [...keys].pop()
    const maxProb = Math.max(...keys.map((k) => data[k]))
    console.log(minScore, maxScore)

    let dataArr = keys.map((k) => {
      return {
        score: Number(k),
        probability: data[k],
      }
    })

    // x axis
    const xAxis = d3.scaleLinear().range([0, w]).domain([minScore, maxScore])

    svg
      .append('g')
      .attr('transform', `translate(0, ${h})`)
      .call(d3.axisBottom(xAxis))

    // y axis
    const yAxis = d3.scaleLinear().domain([0, maxProb]).range([h, 0])
    svg.append('g').call(d3.axisLeft(yAxis))

    // Bars
    svg
      .selectAll('mybar')
      .data(dataArr)
      .join('rect')
      .attr('x', (d) => xAxis(d.score))
      .attr('y', (d) => yAxis(d.probability))
      .attr('width', w / (maxScore - minScore + 1)) // Calculate the width of each bar
      .attr('height', (d) => h - yAxis(d.probability))
      .attr('fill', '#5f0f40')
  }, [data])

  return (
    <>
      <svg width={1000} height={600} id='spreadBarChart' ref={ref} />
    </>
  )
}

export default Spread
