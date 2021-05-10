import {
  TextInput,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Text,
  Button,
  Box,
  Accordion,
  AccordionPanel,
  Heading
} from 'grommet';

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash, Add, View, Edit } from 'grommet-icons';
import { db } from '../firebase';
function AdministrarSalas() {
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

  useEffect(() => {
    db.collection('salas')
      .get()
      .then((querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((sala) => {
          temp.push({ id: sala.id, ...sala.data() });
        });
        setSalas(temp);
      });
  }, []);

  const [salasSearch, setSalasSearch] = useState(salas);

  const eliminarSala = (sala) => {
    setSalas((prevRecursos) => prevRecursos.filter((el) => el !== sala));
    setSalasSearch((prevRecursos) => prevRecursos.filter((el) => el !== sala));
  };

  function searchSala() {
    setSalasSearch(() =>
      salas.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
    );
  }

  return (
    <>
      <Heading>Administrar salas</Heading>
      <Box direction='row'>
        <TextInput
          placeholder='Buscar'
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button label='Buscar' onClick={() => searchSala()} />
      </Box>
      <Accordion>
        <AccordionPanel label='Busqueda Avanzada'>
          {/** Filtros**/}
        </AccordionPanel>
      </Accordion>

      <Heading level='2' margin={{ top: 'xlarge' }}>
        Lista de salas
      </Heading>
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
          {salas.map((sala) => (
            <TableRow>
              <TableCell scope='col'>
                <Text>{sala.nombre}</Text>
              </TableCell>
              <TableCell scope='col'>
                <Text>
                  <Text>{sala.descripcion}</Text>
                </Text>
              </TableCell>
              <TableCell>
                <Button icon={<Edit />} onClick={() => console.log('edit')} />
                <Button icon={<View />} onClick={() => console.log('view')} />
                <Button icon={<Trash />} onClick={() => eliminarSala(sala)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link to='/Sala'>
        <Button icon={<Add />} />
      </Link>
    </>
  );
}
export default AdministrarSalas;
