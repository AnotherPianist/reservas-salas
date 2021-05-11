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
import { Link, useHistory } from 'react-router-dom';
import { Trash, Add, View, Edit } from 'grommet-icons';
import { db } from '../firebase';

function AdministrarSalas() {
  let history = useHistory();
  const [search, setSearch] = useState('');

  const [salas, setSalas] = useState([]);

  useEffect(() => {
    db.collection('salas').onSnapshot((querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((sala) => {
        temp.push({ id: sala.id, ...sala.data() });
      });
      setSalas(temp);
    });
  }, []);

  const [salasSearch, setSalasSearch] = useState(salas);

  function eliminarSala(sala) {
    setSalas((prevRecursos) => prevRecursos.filter((el) => el !== sala));
    setSalasSearch((prevRecursos) => prevRecursos.filter((el) => el !== sala));
    const salaId = sala.id;
    db.collection('salas')
      .doc(salaId)
      .delete()
      .then(() => {
        db.collection('recursos')
          .where('idSala', '==', salaId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((resource) => resource.ref.delete());
          });
      });
  }

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
                <Button
                  icon={<Edit />}
                  onClick={() => history.push(`/sala/${sala.id}`)}
                />
                <Button icon={<View />} onClick={() => console.log('view')} />
                <Button icon={<Trash />} onClick={() => eliminarSala(sala)} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link to='/sala'>
        <Button icon={<Add />} />
      </Link>
    </>
  );
}

export default AdministrarSalas;
