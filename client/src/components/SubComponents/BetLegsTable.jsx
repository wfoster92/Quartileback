import { useState, useMemo, useEffect, useContext, useCallback } from 'react'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import DeleteIcon from '@mui/icons-material/Delete'
import FilterListIcon from '@mui/icons-material/FilterList'
import { visuallyHidden } from '@mui/utils'
import { GamesContext } from '../../contexts/GamesContext'

let columnArr = [
  {
    id: 'inPortfolio',
    label: 'In Portfolio',
    disablePadding: true,
    dataType: 'boolean',
    align: 'center',
  },
  {
    id: 'index',
    label: 'Details',
    disablePadding: false,
    dataType: 'string',
    align: 'left',
  },
  {
    id: 'probability',
    label: 'Probability',
    disablePadding: false,
    dataType: 'percent',
    align: 'right',
  },
  {
    id: 'odds',
    label: 'Odds',
    disablePadding: false,
    dataType: 'int',
    align: 'right',
  },
  {
    id: 'kelly',
    label: 'Kelly',
    disablePadding: false,
    dataType: 'kelly',
    align: 'right',
  },
  {
    id: 'unitPercent',
    label: 'Unit Percent',
    disablePadding: false,
    dataType: 'float',
    align: 'right',
  },
  {
    id: 'unitReturn',
    label: 'Unit Return',
    disablePadding: false,
    dataType: 'float',
    align: 'right',
  },
  {
    id: 'legs',
    label: 'Num Legs',
    disablePadding: false,
    dataType: 'int',
    align: 'right',
  },
]

const comparator = (a, b, order, orderBy) => {
  if (a === b) {
    return 0 // Return 0 for equal values
  }

  // Get the datatype that we are sorting by
  let dataType = columnArr
    .filter((elem) => elem.id === orderBy)
    .map((elem) => elem.dataType)[0]

  let output = 0

  if (['int', 'float', 'percent'].includes(dataType)) {
    output = a - b
  } else if (['boolean'].includes(dataType)) {
    output = Boolean(a) - Boolean(b)
  } else if (['string'].includes(dataType)) {
    output = a.localeCompare(b)
  }

  return order === 'desc' ? output : -output
}

const EnhancedTableHead = (props) => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    // numSelected,
    rowCount,
    onRequestSort,
  } = props

  const { betLegsTable, setBetLegsTable } = useContext(GamesContext)

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  let numSelected = betLegsTable.reduce(
    (acc, cur) => acc + (cur.inPortfolio ? 1 : 0),
    0
  )

  return (
    <TableHead>
      <TableRow>
        {columnArr.map((col) =>
          col.id === 'inPortfolio' ? (
            <TableCell
              key={col.id}
              align={col.align}
              padding={col.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === col.id ? order : false}
            >
              <Checkbox
                color='primary'
                style={{ display: 'inline-block' }}
                indeterminate={false}
                checked={false}
                onChange={onSelectAllClick}
                inputProps={{
                  'aria-label': 'select all bets',
                }}
              />
              Add
            </TableCell>
          ) : (
            <TableCell
              key={col.id}
              align={col.align}
              padding={col.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === col.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === col.id}
                direction={orderBy === col.id ? order : 'asc'}
                onClick={createSortHandler(col.id)}
              >
                {col.label}
                {orderBy === col.id ? (
                  <Box component='span' sx={visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          )
        )}
      </TableRow>
    </TableHead>
  )
}

const EnhancedTableToolbar = () => {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: '1 1 100%' }}
        variant='h6'
        id='tableTitle'
        component='div'
      >
        Bet Legs
      </Typography>
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
}

const BetLegsTable = () => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('unitReturn')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { betLegsTable, setBetLegsTable } = useContext(GamesContext)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
    setPage(0)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      // const newSelected = betLegsTable.map((n) => n.index)
      // setSelected(newSelected)
      let tempbetLegsTable = betLegsTable.map((elem) => {
        return { ...elem, inPortfolio: true }
      })
      setBetLegsTable(tempbetLegsTable)
      return
    }
    let tempbetLegsTable = betLegsTable.map((elem) => {
      return { ...elem, inPortfolio: true }
    })
    setBetLegsTable(tempbetLegsTable)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event) => {
    setDense(event.target.checked)
  }

  // const isSelected = (id) => selected.indexOf(id) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - betLegsTable.length) : 0

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={betLegsTable.reduce(
            (acc, cur) => (acc + cur.inPortfolio ? 1 : 0),
            0
          )}
        />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={betLegsTable.reduce(
                (acc, cur) => (acc + cur.inPortfolio ? 1 : 0),
                0
              )}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={betLegsTable.length}
            />
            <TableBody>
              {betLegsTable
                .filter((elem) => !elem.inPortfolio)
                .sort((a, b) => {
                  return comparator(a[orderBy], b[orderBy], order, orderBy)
                })
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, rowIdx) => {
                  {
                    /* const isItemSelected = isSelected(row.index) */
                  }
                  const labelId = `enhanced-table-checkbox-${rowIdx}`

                  return (
                    <TableRow
                    // hover
                    // onClick={() => {
                    //   let tempBetLegsTable = betLegsTable.map((elem) => {
                    //     if (elem.index === row.index) {
                    //       let tempElem = { ...elem }
                    //       tempElem.inPortfolio = !tempElem.inPortfolio
                    //       return tempElem
                    //     } else {
                    //       return elem
                    //     }
                    //   })
                    //   setBetLegsTable(tempBetLegsTable)
                    // }}
                    // role='checkbox'
                    // aria-checked={row.inPortfolio}
                    // tabIndex={-1}
                    // // key={row.id}
                    // selected={row.inPortfolio}
                    // sx={{ cursor: 'pointer' }}
                    >
                      {columnArr.map((currentCol, colIdx) => {
                        return currentCol.id === 'inPortfolio' ? (
                          <TableCell padding='checkbox'>
                            <Checkbox
                              color='primary'
                              checked={row.inPortfolio}
                              onChange={() => {
                                let tempBetLegsTable = betLegsTable.map(
                                  (elem) => {
                                    if (elem.index === row.index) {
                                      let tempElem = { ...elem }
                                      tempElem.inPortfolio =
                                        !tempElem.inPortfolio
                                      return tempElem
                                    } else {
                                      return elem
                                    }
                                  }
                                )
                                setBetLegsTable(tempBetLegsTable)
                              }}
                              inputProps={{
                                'aria-labelledby': labelId,
                              }}
                            />
                          </TableCell>
                        ) : currentCol.id === 'index' ? (
                          <TableCell style={{ textAlign: currentCol.align }}>
                            {row[currentCol.id].split(' | ').map((line) => {
                              return <div>{line}</div>
                            })}
                          </TableCell>
                        ) : (
                          <TableCell style={{ textAlign: currentCol.align }}>
                            {['float', 'percent'].includes(currentCol.dataType)
                              ? Number(row[currentCol.id]).toFixed(4)
                              : ['kelly'].includes(currentCol.dataType)
                              ? `(${Number(
                                  row[currentCol.id].split(', ')[0].slice(1)
                                ).toFixed(4)}, ${Number(
                                  row[currentCol.id]
                                    .split(', ')[1]
                                    .replace(')', '')
                                ).toFixed(4)})`
                              : row[currentCol.id]}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={betLegsTable.filter((elem) => !elem.inPortfolio).length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Dense padding'
      />
    </Box>
  )
}

export default BetLegsTable
