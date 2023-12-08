import { useState, useContext, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
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
import { visuallyHidden } from '@mui/utils'
import { GamesContext } from '../../contexts/GamesContext'

let columnArr = [
  {
    id: 'teamName',
    label: 'Team',
    disablePadding: true,
    dataType: 'string',
    align: 'left',
    searchable: true,
    hidden: false,
  },
  {
    id: 'homeTeamAbbrev',
    label: 'Team Abbrev',
    disablePadding: true,
    dataType: 'string',
    align: 'left',
    searchable: true,
    hidden: true,
  },
  {
    id: 'ovrRank',
    label: 'Overall Rank',
    disablePadding: true,
    dataType: 'int',
    align: 'right',
    searchable: false,
    hidden: false,
  },
  {
    id: 'ovr',
    label: 'Overall Score',
    disablePadding: true,
    dataType: 'percent3',
    align: 'right',
    searchable: false,
    hidden: false,
  },

  {
    id: 'scheduleStrength',
    label: 'Strength of Schedule',
    disablePadding: true,
    dataType: 'percent3',
    align: 'right',
    searchable: false,
    hidden: false,
  },
  {
    id: 'scheduleStrengthRank',
    label: 'Strength of Schedule Rank',
    disablePadding: true,
    dataType: 'int',
    align: 'right',
    searchable: false,
    hidden: false,
  },

  {
    id: 'pointsForAvg',
    label: 'Points For Avg',
    disablePadding: true,
    dataType: 'percent1',
    align: 'right',
    searchable: false,
    hidden: false,
  },
  {
    id: 'pointsAgainstAvg',
    label: 'Points Against Avg',
    disablePadding: true,
    dataType: 'percent1',
    align: 'right',
    searchable: false,
    hidden: false,
  },
  {
    id: 'movAvg',
    label: 'Margin of Victory Avg',
    disablePadding: true,
    dataType: 'percent1',
    align: 'right',
    searchable: false,
    hidden: false,
  },
  {
    id: 'movRank',
    label: 'Margin of Victory Rank',
    disablePadding: true,
    dataType: 'int',
    align: 'right',
    searchable: false,
    hidden: false,
  },
  {
    id: 'win',
    label: 'Win',
    disablePadding: true,
    dataType: 'int',
    align: 'right',
    searchable: false,
    hidden: false,
  },
  {
    id: 'winRank',
    label: 'Win Rank',
    disablePadding: true,
    dataType: 'int',
    align: 'right',
    searchable: false,
    hidden: false,
  },

  {
    id: 'observedDominance',
    label: 'Observed Dominance',
    disablePadding: true,
    dataType: 'percent3',
    align: 'right',
    searchable: false,
    hidden: false,
  },
  {
    id: 'dominanceRank',
    label: 'Dominance Rank',
    disablePadding: true,
    dataType: 'int',
    align: 'right',
    searchable: true,
    hidden: false,
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

  if (['int', 'percent1', 'percent3'].includes(dataType)) {
    output = a - b
  } else if (['boolean'].includes(dataType)) {
    output = Boolean(a) - Boolean(b)
  } else if (['string'].includes(dataType)) {
    output = a.localeCompare(b)
  }

  return order === 'desc' ? output : -output
}

// const EnhancedTableHead = (props) => {
//   const {
//     onSelectAllClick,
//     order,
//     orderBy,
//     // numSelected,
//     rowCount,
//     onRequestSort,
//   } = props

//   const { rankingsTable, setRankingsTable } = useContext(GamesContext)

//   const createSortHandler = (property) => (event) => {
//     onRequestSort(event, property)
//   }

//   return (
//     <TableHead>
//       <TableRow>
//         {columnArr
//           .filter((col) => !col.hidden)
//           .map((col, idx) => (
//             <TableCell
//               key={col.id}
//               align={col.align}
//               padding={col.disablePadding ? 'none' : 'normal'}
//               sortDirection={orderBy === col.id ? order : false}
//               style={
//                 idx === 0
//                   ? {
//                       position: 'sticky',
//                       zIndex: '2',
//                       left: 0,
//                       paddingLeft: '8px',
//                       backgroundColor: 'white',
//                       fontWeight: '600',
//                     }
//                   : { fontWeight: '600' }
//               }
//             >
//               <TableSortLabel
//                 active={orderBy === col.id}
//                 direction={orderBy === col.id ? order : 'asc'}
//                 onClick={createSortHandler(col.id)}
//               >
//                 {col.label}
//                 {orderBy === col.id ? (
//                   <Box component='span' sx={visuallyHidden}>
//                     {order === 'desc'
//                       ? 'sorted descending'
//                       : 'sorted ascending'}
//                   </Box>
//                 ) : null}
//               </TableSortLabel>
//             </TableCell>
//           ))}
//       </TableRow>
//     </TableHead>
//   )
// }
const EnhancedTableHead = (props) => {
  const { onSelectAllClick, order, orderBy, rowCount, onRequestSort } = props

  const { rankingsTable, setRankingsTable } = useContext(GamesContext)
  const firstCellRef = useRef(null)

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollLeft =
        window.pageXOffset || document.documentElement.scrollLeft

      if (firstCellRef.current) {
        firstCellRef.current.style.left = `${scrollLeft}px`
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <TableHead>
      <TableRow>
        {columnArr
          .filter((col) => !col.hidden)
          .map((col, idx) => (
            <TableCell
              key={col.id}
              align={col.align}
              padding={col.disablePadding ? 'none' : 'normal'}
              sortDirection={orderBy === col.id ? order : false}
              ref={idx === 0 ? firstCellRef : null}
              style={
                idx === 0
                  ? {
                      position: 'sticky',
                      left: 0,
                      zIndex: '5',
                      backgroundColor: 'white',
                      paddingLeft: '8px',
                      fontWeight: '600',
                    }
                  : idx === columnArr.filter((c) => !c.hidden).length - 1
                  ? { fontWeight: '600', paddingRight: '8px' }
                  : { fontWeight: '600' }
              }
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
          ))}
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
        sx={{ flex: '1 1 100%', fontWeight: '600' }}
        variant='h6'
        id='tableTitle'
        component='div'
      >
        Comprehensive Rankings
      </Typography>
    </Toolbar>
  )
}

const RankingsTable = () => {
  const [order, setOrder] = useState('desc')
  const [orderBy, setOrderBy] = useState('ovrRank')
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(25)

  const { rankingsTable } = useContext(GamesContext)

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
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

  const formatValue = (elem, dataType) => {
    if (dataType === 'percent1') {
      return Number(elem).toFixed(1)
    } else if (dataType === 'percent3') {
      return Number(elem).toFixed(3)
    } else if (dataType === 'int') {
      return Math.round(Number(elem))
    } else if (dataType === 'string') {
      return elem
    }
  }

  // const isSelected = (id) => selected.indexOf(id) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rankingsTable.length) : 0

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar />
        <TableContainer sx={{ height: '80vh', overflowY: 'auto' }}>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
            stickyHeader
          >
            <EnhancedTableHead
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={rankingsTable.length}
            />

            <TableBody>
              {rankingsTable
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
                    <TableRow>
                      {columnArr
                        .filter((col) => !col.hidden)
                        .map((currentCol, idx) => {
                          return (
                            <TableCell
                              style={
                                idx === 0
                                  ? {
                                      textAlign: currentCol.align,
                                      position: 'sticky',
                                      left: 0,
                                      zIndex: '1',
                                      backgroundColor: 'white',
                                      paddingLeft: '8px',
                                      paddingRight: '0px',
                                    }
                                  : idx ===
                                    columnArr.filter((c) => !c.hidden).length -
                                      1
                                  ? {
                                      textAlign: currentCol.align,
                                      paddingRight: '8px',
                                    }
                                  : {
                                      textAlign: currentCol.align,
                                      paddingLeft: '0px',
                                      paddingRight: '0px',
                                    }
                              }
                            >
                              {formatValue(
                                row[currentCol.id],
                                currentCol.dataType
                              )}
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
          rowsPerPageOptions={[10, 25, 100]}
          component='div'
          count={rankingsTable.length}
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

export default RankingsTable
