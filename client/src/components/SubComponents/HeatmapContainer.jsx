import { useState, useEffect, useRef, useContext } from 'react'
import * as d3 from 'd3'
import { GamesContext } from '../../contexts/GamesContext'
import Heatmap from './Heatmap'
import { ToggleButton, ToggleButtonGroup } from '@mui/material'

const HeatmapContainer = (props) => {
  const { allHeatmapTypes } = useContext(GamesContext)
  const { spread, currentGame, OU, heatmapData } = props
  const [selectedHeatmapType, setSelectedHeatmapType] = useState('moneyLine')

  return (
    <>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: '2vw',
        }}
      >
        <div style={{ display: 'inline-block' }}>
          <ToggleButtonGroup
            value={selectedHeatmapType}
            color='primary'
            style={{ verticalAlign: 'middle' }}
          >
            {allHeatmapTypes.map((elem) => {
              return (
                <ToggleButton
                  onClick={(e) => setSelectedHeatmapType(elem)}
                  value={elem}
                  style={{ height: '3vw', width: '10vw', fontSize: '1.5vw' }}
                  sx={{
                    // height: 56,
                    // width: 160,
                    textTransform: 'none',
                  }}
                >
                  {elem}
                </ToggleButton>
              )
            })}
          </ToggleButtonGroup>
        </div>
      </div>
      <Heatmap
        selectedHeatmapType={selectedHeatmapType}
        currentGame={currentGame}
        spread={spread}
        OU={OU}
        heatmapData={heatmapData}
      />
    </>
  )
}

export default HeatmapContainer
