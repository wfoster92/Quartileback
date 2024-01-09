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

// https://d3-graph-gallery.com/graph/barplot_basic.html

const Spread = (props) => {
  const { spreadObj, setSpreadObj } = props
  const { viewportWidth } = useContext(GamesContext)

  let { currentSpread, spread, spreadIsInt, fractionalSpread } = spreadObj
  const [dataArr, setDataArr] = useState([])
  console.log(currentSpread)

  const ref = useRef()
  useEffect(() => {
    d3.select(ref.current).selectAll('*').remove()
    if (!currentSpread) {
      console.warn('Spread data is not available.')
      return
    }

    const keys = Object.keys(currentSpread)
      .map((elem) => Number(elem))
      .sort((a, b) => a - b)

    if (keys.length === 0) {
      console.warn('Spread data is empty.')
      return
    }

    const minScore = keys[0]
    const maxScore = keys[keys.length - 1]
    const maxProb = Math.max(...keys.map((k) => currentSpread[k]))

    setDataArr(
      keys.map((k) => {
        return {
          score: Number(k),
          probability: currentSpread[k],
        }
      })
    )
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

    // append the svg object to the body of the page
    const svg = d3
      .select('#spreadBarChart')
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
        d.score === spread && !fractionalSpread
          ? '#000'
          : d.score > (spreadIsInt && !fractionalSpread ? spread : spread + 0.5)
          ? '#800'
          : '#e00'
      )

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
      .text('Spread')
  }, [spreadObj, viewportWidth])

  const overSpreadProb =
    dataArr
      .filter(
        (elem) =>
          elem.score >
          (spreadIsInt && !fractionalSpread ? spread : spread + 0.5)
      )
      .map((elem) => elem.probability)
      .reduce((acc, currentValue) => {
        return acc + currentValue
      }, 0) * 100

  const underSpreadProb =
    dataArr
      .filter(
        (elem) =>
          elem.score <
          (spreadIsInt && !fractionalSpread ? spread : spread + 0.5)
      )
      .map((elem) => elem.probability)
      .reduce((acc, currentValue) => {
        return acc + currentValue
      }, 0) * 100

  return (
    <>
      <div style={{ textAlign: 'center' }}>
        <div>
          {/* {spread > 0
            ? `${spreadObj.homeTeam} wins by more than ${
                spreadIsInt && !fractionalSpread
                  ? Math.abs(spread)
                  : Math.abs(spread + 0.5)
              }: ${overSpreadProb.toFixed(1)}%`
            : spread < 0
            ? `${spreadObj.awayTeam} wins by more than ${
                spreadIsInt && !fractionalSpread
                  ? Math.abs(spread)
                  : Math.abs(spread + 0.5)
              }: ${overSpreadProb.toFixed(1)}%`
            : ``} */}
        </div>
        <span>
          Over {spreadIsInt && !fractionalSpread ? spread : spread + 0.5}:{' '}
          {overSpreadProb.toFixed(1)}%{'  |  '}
        </span>
        <span>
          Under {spreadIsInt && !fractionalSpread ? spread : spread + 0.5}:{' '}
          {underSpreadProb.toFixed(1)}%
        </span>
      </div>
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
            value={spread}
            onChange={(event, val) => {
              // setSpread(val)}
              setSpreadObj((prevState) => {
                return {
                  ...prevState,
                  spread: val,
                }
              })
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
                    checked={fractionalSpread}
                    onChange={() => {
                      // setFractionalSpread(!fractionalSpread)
                      // setSpreadIsInt(true)
                      setSpreadObj((prevState) => {
                        return {
                          ...prevState,
                          fractionalSpread: !prevState.fractionalSpread,
                          spreadIsInt: true,
                        }
                      })
                    }}
                  />
                }
                label='Fractional Spread'
              />
            </FormGroup>
          </FormControl>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <svg
          width={viewportWidth <= 750 ? viewportWidth : viewportWidth * 0.45}
          height={viewportWidth <= 750 ? viewportWidth : viewportWidth * 0.45}
          id='spreadBarChart'
          ref={ref}
        />
      </div>
    </>
  )
}

export default Spread
