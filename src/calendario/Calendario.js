import {Calendar,Table,  

    TableCell,

    TableHeader,
     TableBody, TableFooter, TableRow,
    Text,
    Button

  } from 'grommet';

  var DATA=[
    {
      id: 1, hour: '8', name: 'eric@local',
    },
    {
      id: 2, hour: '9', name: 'chris@local',
    },
    {
      id: 3, hour: '10', name: 'alan@local', 
    },
  ];
  const COLUMNS = [
    {
      property: 'hour',
      label: 'Hour',
      dataScope: 'row',
      format: datum => <strong>{datum.hour}</strong>,
    },
    {
      property: 'name',
      label: 'Name',
    },
    {
        property: 'id',
        label: '',
      },
  ];

function Calendario() {
    return (
      <>
      <Calendar
        size="small"
        date={(new Date()).toISOString()}
        onSelect={(date) => {console.log(date)}}
        daysOfWeek={true}
        


        />

    <Table caption='Simple Table'>
      <TableHeader>
        <TableRow>
          {COLUMNS.map(c => (
            <TableCell key={c.property} scope='col' border='bottom' align={c.align}>
              <Text>{c.label}</Text>
            </TableCell>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {DATA.map(datum => (
          <TableRow key={datum.id}>
            {COLUMNS.map(c => (
                
              <TableCell key={c.property} scope={c.dataScope} align={c.align}>
                
                <Text>
                  
                  {(c.format ? c.format(datum) : datum[c.property]) && (c.property ? 'id' : false)}
                </Text>
                <Button></Button>
              </TableCell>
              
                  
              
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          
        </TableRow>
      </TableFooter>
    </Table>
    </>
    );
  }
  
  export default Calendario;
  