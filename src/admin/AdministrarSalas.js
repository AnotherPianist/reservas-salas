import {
  FormField,
  TextInput,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Text,
  Button,
  Box,
  Layer,
  DateInput,
  Accordion,
  AccordionPanel
} from 'grommet';
import BusquedaAvanzada from './BusquedaAvanzada.js';
import { useState, useEffect } from 'react';
function AdministrarSalas() {
  const [busquedaAvanzada, setBusquedaAvanzada] = useState(true);
  const [search, setSearch] = useState('');
  const [recurso, setRecurso] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [salas, setSalas] = useState([
    {
      name: 'sala1',
      description: 'sala de computacion',
      recursos: [
        { name: 'sillas', cantidad: '3' },
        { name: 'computador', cantidad: '2' },
        { name: 'laptop', cantidad: '1' },
        { name: 'pc', cantidad: '5' }
      ],
      fechas: [
        { inicio: '01/02/2020', fin: '08/02/2020' },
        { inicio: '01/03/2020', fin: '08/03/2020' }
      ]
    },
    {
      name: 'sala2',
      description: 'sala de fisica',
      recursos: [
        { name: 'sillas', cantidad: '3' },
        { name: 'computador', cantidad: '2' },
        { name: 'laptop', cantidad: '1' },
        { name: 'pc', cantidad: '5' }
      ],
      fechas: [
        { inicio: '01/02/2020', fin: '08/02/2020' },
        { inicio: '01/03/2020', fin: '08/03/2020' }
      ]
    }
  ]);
  const [salasSearch, setSalasSearch] = useState(salas);

  const eliminarSala = (sala) => {
    setSalas((prevRecursos) => prevRecursos.filter((el) => el !== sala));
    setSalasSearch((prevRecursos) => prevRecursos.filter((el) => el !== sala));
  };

  const SalaSearch = () => {
    setSalasSearch(() =>
      salas.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
    );
  };
  return (
    <>
      <Box direction='column'>
        <Box>
          <h1>Administrar salas</h1>
          <Box direction='row'>
            <TextInput
              placeholder='Buscar'
              id='text-input-id'
              name='search '
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button label='buscar' onClick={() => SalaSearch()}></Button>
          </Box>
          <Box>
            <Accordion
              onActive={() => (
                setBusquedaAvanzada(!busquedaAvanzada),
                console.log(busquedaAvanzada)
              )}>
              <AccordionPanel label='Busqueda Avanzada'>
                <Box direction='row'>
                  <TextInput
                    placeholder='Recursos'
                    id='text-input-id'
                    name='search '
                    onChange={(e) => setRecurso(e.target.value)}
                  />
                  <TextInput
                    placeholder='Cantidad'
                    id='text-input-id'
                    name='search '
                    onChange={(e) => setCantidad(e.target.value)}
                  />
                </Box>
              </AccordionPanel>
            </Accordion>
          </Box>
        </Box>
        <Box>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope='col' border='bottom'>
                  Nombre
                </TableCell>
                <TableCell scope='col' border='bottom'>
                  Descripción
                </TableCell>
                <TableCell scope='col' border='bottom'></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salasSearch.map((sala) => (
                <TableRow>
                  <TableCell scope='col'>
                    <Text>{sala.name}</Text>
                  </TableCell>
                  <TableCell scope='col'>
                    <Text>
                      <Text>{sala.description}</Text>
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Button
                      label='eliminar'
                      onClick={() => eliminarSala(sala)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Box>
    </>
  );
}
export default AdministrarSalas;
