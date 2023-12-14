import { useState, useEffect, useRef, useContext } from 'react'
import { GamesContext } from '../../contexts/GamesContext'
import * as d3 from 'd3'
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput'
import {
  Button,
  FormControl,
  FormGroup,
  FormLabel,
  FormControlLabel,
  Switch,
} from '@mui/material'

// https://d3-graph-gallery.com/graph/barplot_basic.html

const Spread = () => {
  const {
    viewportWidth,
    OU,
    setOU,
    ouIsInt,
    setOuIsInt,
    fractionalOU,
    setFractionalOU,
    currentOverUnder,
  } = useContext(GamesContext)
  // const { data } = props

  const keys = Object.keys(currentOverUnder)
    .map((elem) => Number(elem))
    .sort((a, b) => a - b)
  const minScore = keys[0]
  const maxScore = [...keys].pop()
  const maxProb = Math.max(...keys.map((k) => currentOverUnder[k]))
  // console.log(minScore, maxScore)

  let dataArr = keys.map((k) => {
    return {
      score: Number(k),
      probability: currentOverUnder[k],
    }
  })
  const ref = useRef()
  useEffect(() => {
    d3.select(ref.current).selectAll('*').remove()

    // set the dimensions and margins of the graph
    const margin = {
      top: viewportWidth * 0.05,
      right: viewportWidth * 0.04,
      bottom: viewportWidth * 0.05,
      left: viewportWidth * 0.04,
    }
    const w =
      viewportWidth <= 750
        ? viewportWidth - margin.left - margin.right
        : viewportWidth * 0.45 - margin.left - margin.right
    const h =
      viewportWidth <= 750
        ? viewportWidth - margin.top - margin.bottom
        : viewportWidth * 0.45 - margin.top - margin.bottom

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
      .attr('fill', (d) =>
        d.score === OU && !fractionalOU
          ? '#000'
          : d.score > (ouIsInt && !fractionalOU ? OU : OU + 0.5)
          ? '#080'
          : '#0e0'
      )
  }, [currentOverUnder, OU, ouIsInt, fractionalOU, viewportWidth])

  const overProb =
    dataArr
      .filter((elem) => elem.score > (ouIsInt && !fractionalOU ? OU : OU + 0.5))
      .map((elem) => elem.probability)
      .reduce((acc, currentValue) => {
        return acc + currentValue
      }, 0) * 100

  const underProb =
    dataArr
      .filter((elem) => elem.score < (ouIsInt && !fractionalOU ? OU : OU + 0.5))
      .map((elem) => elem.probability)
      .reduce((acc, currentValue) => {
        return acc + currentValue
      }, 0) * 100

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <NumberInput
              aria-label='Demo number input'
              placeholder='Type a number…'
              value={Math.floor(OU)}
              onChange={(event, val) => {
                setOU(val)
                setOuIsInt(true)
              }}
            />
          </div>
          <div
            style={{
              display: 'inline-block',
              verticalAlign: 'center',
              marginLeft: '16px',
            }}
          >
            <FormControl component='fieldset' variant='standard'>
              <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={fractionalOU}
                      onChange={() => {
                        setFractionalOU(!fractionalOU)
                        setOuIsInt(true)
                      }}
                      // name='gilad'
                    />
                  }
                  label='Fractional Over Under'
                />
              </FormGroup>
            </FormControl>
          </div>
        </div>

        <div>
          Odds of over {ouIsInt && !fractionalOU ? OU : OU + 0.5} are:
          {overProb.toFixed(1)}%
        </div>
        <div>
          Odds of under {ouIsInt && !fractionalOU ? OU : OU + 0.5} are:
          {underProb.toFixed(1)}%
        </div>
      </div>
      <svg
        width={
          viewportWidth <= 750 ? viewportWidth * 0.9 : viewportWidth * 0.45
        }
        height={
          viewportWidth <= 750 ? viewportWidth * 0.9 : viewportWidth * 0.45
        }
        id='overUnderBarChart'
        ref={ref}
      />
    </>
  )
}

export default Spread
