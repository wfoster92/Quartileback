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
    dataType: 'string',
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

// const descendingComparator = (a, b, orderBy) => {
//   if (b[orderBy] < a[orderBy]) {
//     return -1
//   }

//   if (b[orderBy] > a[orderBy]) {
//     return 1
//   }
//   return 0
// }

// const getComparator = (order, orderBy) => {
//   return order === 'desc'
//     ? (a, b) => descendingComparator(a, b, orderBy)
//     : (a, b) => -descendingComparator(a, b, orderBy)
// }

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

// const stableSort = (array, comparator) => {
//   const stabilizedThis = array.map((el, index) => [el, index])
//   stabilizedThis.sort((a, b) => {
//     const order = comparator(a[0], b[0])
//     if (order !== 0) {
//       return order
//     }
//     return a[1] - b[1]
//   })
//   return stabilizedThis.map((el) => el[0])
// }

const EnhancedTableHead = (props) => {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

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
                indeterminate={numSelected > 0 && numSelected < rowCount}
                checked={rowCount > 0 && numSelected === rowCount}
                onChange={onSelectAllClick}
                inputProps={{
                  'aria-label': 'select all desserts',
                }}
              />
              {col.label}
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

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

const EnhancedTableToolbar = (props) => {
  const { numSelected } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          Best Bets {numSelected} bet{numSelected === 1 ? '' : 's'} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant='h6'
          id='tableTitle'
          component='div'
        >
          Best Bets
        </Typography>
      )}
      {/* 
      {numSelected > 0 ? (
        <Tooltip title='Delete'>
          <IconButton>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )} */}
    </Toolbar>
  )
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
}

const BestBetsTable = () => {
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState('unitReturn')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const { bestBetsTable, setBestBetsTable } = useContext(GamesContext)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = bestBetsTable.map((n) => n.index)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
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

  const isSelected = (id) => selected.indexOf(id) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - bestBetsTable.length) : 0

  // const visibleRows = useMemo(
  //   () =>
  //     stableSort(bestBetsTable, getComparator(order, orderBy)).slice(
  //       page * rowsPerPage,
  //       page * rowsPerPage + rowsPerPage
  //     ),
  //   [order, orderBy, page, rowsPerPage]
  // )

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={bestBetsTable.length}
            />
            <TableBody>
              {bestBetsTable
                .sort((a, b) => {
                  return comparator(a[orderBy], b[orderBy], order, orderBy)
                })
                .map((row, rowIdx) => {
                  const isItemSelected = isSelected(row.index)
                  const labelId = `enhanced-table-checkbox-${rowIdx}`

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.index)}
                      role='checkbox'
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      // key={row.id}
                      selected={isItemSelected}
                      sx={{ cursor: 'pointer' }}
                    >
                      {/* <TableCell></TableCell>
                      <TableCell padding='checkbox'>
                        <Checkbox
                          color='primary'
                          checked={isItemSelected}
                          inputProps={{
                            'aria-labelledby': labelId,
                          }}
                        />
                      </TableCell> */}

                      {columnArr.map((currentCol, colIdx) => {
                        return currentCol.id === 'inPortfolio' ? (
                          <TableCell padding='checkbox'>
                            <Checkbox
                              color='primary'
                              checked={row.inPortfolio}
                              onChange={() => {
                                let tempBestBetsTable = bestBetsTable.map(
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
                                setBestBetsTable(tempBestBetsTable)
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
                            {row[currentCol.id]}
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
          count={bestBetsTable.length}
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

export default BestBetsTable
