import { useState, useEffect, useRef } from 'react'
import styled from '@emotion/styled'
import { Unstable_NumberInput as NumberInput } from '@mui/base/Unstable_NumberInput'

const Spread = (props) => {
  const { data } = props

  const keys = Object.keys(data)
    .map((elem) => Number(elem))
    .sort((a, b) => a - b)

  return (
    <>
      <div style={{ textAlign: 'center' }}></div>
    </>
  )
}

export default Spread
