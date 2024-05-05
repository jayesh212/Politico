import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function SimpleTable(props) {
  var data = props.data
  console.log(props);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 400 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Number</TableCell>
            <TableCell align="left">Username</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user,index) => (
            <TableRow
              key={user}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{index+1}</TableCell>
              <TableCell align="left">{user}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}