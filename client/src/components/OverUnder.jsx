import { useState, useEffect, useRef, useContext } from 'react'
import { CFBContext } from '../contexts/cfbContext'
import * as d3 from 'd3'
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput'

// https://d3-graph-gallery.com/graph/barplot_basic.html

const Spread = (props) => {
  const { viewportWidth, OU, setOU } = useContext(CFBContext)
  console.log(`viewportWidth ${viewportWidth}`)
  const { data } = props

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
  const ref = useRef()
  useEffect(() => {
    d3.select(ref.current).selectAll('*').remove()

    // set the dimensions and margins of the graph
    const margin = { top: 30, right: 30, bottom: 70, left: 60 }
    const w = viewportWidth * 0.48 - margin.left - margin.right
    const h = 600 - margin.top - margin.bottom

    // append the svg object to the body of the page
    const svg = d3
      .select('#overUnderBarChart')
      .append('svg')
      .attr('width', w + margin.left + margin.right)
      .attr('height', h + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

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
      .attr('fill', (d) => (d.score > OU + 0.5 ? '#080' : '#0e0'))
  }, [data, OU])

  const overProb =
    dataArr
      .filter((elem) => elem.score > OU + 0.5)
      .map((elem) => elem.probability)
      .reduce((acc, currentValue) => {
        return acc + currentValue
      }, 0) * 100

  const underProb =
    dataArr
      .filter((elem) => elem.score < OU + 0.5)
      .map((elem) => elem.probability)
      .reduce((acc, currentValue) => {
        return acc + currentValue
      }, 0) * 100

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <NumberInput
          aria-label='Demo number input'
          placeholder='Type a number…'
          value={OU}
          onChange={(event, val) => setOU(val)}
        />
        <div>
          Odds of over {OU + 0.5} are:
          {overProb.toFixed(1)}%
        </div>
        <div>
          Odds of under {OU + 0.5} are:
          {underProb.toFixed(1)}%
        </div>
      </div>
      <svg width={1000} height={600} id='overUnderBarChart' ref={ref} />
    </>
  )
}

export default Spread
