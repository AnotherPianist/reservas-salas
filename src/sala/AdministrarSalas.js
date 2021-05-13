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
  Heading,
  CheckBox
} from 'grommet';
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Trash, Add, View, Edit } from 'grommet-icons';
import { db } from '../firebase';

function AdministrarSalas() {
  let history = useHistory();
  const [search, setSearch] = useState('');
  const [salas, setSalas] = useState([]);

  const [pizarra, setPizarra] = useState(false);
  const [proyector, setProyector] = useState(false);
  const [computador, setComputador] = useState(false);
  const [aC, setAC] = useState(false);
  const [npizarra, setNPizarra] = useState(1);
  const [nproyector, setNProyector] = useState(1);
  const [ncomputador, setNComputador] = useState(1);
  const [naC, setNAC] = useState(1);

  useEffect(() => {
    db.collection('rooms').onSnapshot((querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((sala) => {
        temp.push({ id: sala.id, ...sala.data() });
      });
      setSalas(temp);
      setSalasSearch(temp);
    });
  }, []);

  const [salasSearch, setSalasSearch] = useState(salas);

  function eliminarSala(sala) {
    setSalas((prevRecursos) => prevRecursos.filter((el) => el !== sala));
    setSalasSearch((prevRecursos) => prevRecursos.filter((el) => el !== sala));
    const salaId = sala.id;
    db.collection('rooms')
      .doc(salaId)
      .delete()
      .then(() => {
        db.collection('resources')
          .where('idRoom', '==', salaId)
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
    if (computador || pizarra || proyector || aC) {
      var count = 0;
      if (computador) {
        count = count + 1;
      }
      if (pizarra) {
        count = count + 1;
      }
      if (proyector) {
        count = count + 1;
      }
      if (aC) {
        count = count + 1;
      }
      db.collection('resources').onSnapshot((querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((recurso) => {
          if (
            (pizarra &&
              recurso.data().name === 'Pizarra' &&
              recurso.data().quantity >= npizarra) ||
            (proyector &&
              recurso.data().name === 'Proyector' &&
              recurso.data().quantity >= nproyector) ||
            (computador &&
              recurso.data().name === 'Computador' &&
              recurso.data().quantity >= ncomputador) ||
            (aC &&
              recurso.data().name === 'A/C' &&
              recurso.data().quantity >= naC)
          ) {
            console.log(recurso.quantity);

            temp.push(recurso.data().idRoom);
          }
        });
        console.log(count);
        const aux = [];
        var contAux = 0;
        salasSearch.forEach((sala) => {
          contAux = 0;
          temp.forEach((idSala) => {
            if (sala.id === idSala) {
              contAux++;
            }
          });
          if (contAux === count) {
            aux.push(sala);
          }
        });
        setSalasSearch(aux);
      });
    }
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
          <>
            <Box direction='row' gap='medium'>
              <CheckBox
                checked={pizarra}
                label='pizarra'
                onChange={(event) => setPizarra(event.target.checked)}
              />

              <TextInput
                value={npizarra}
                id='resource-quantity'
                name='cantidad'
                min={1}
                type='number'
                onChange={(e) => setNPizarra(e.target.value)}
              />
            </Box>
            <Box direction='row' gap='medium'>
              <CheckBox
                checked={proyector}
                label='proyector'
                onChange={(event) => setProyector(event.target.checked)}
              />
              <TextInput
                value={nproyector}
                id='resource-quantity'
                name='cantidad'
                min={1}
                type='number'
                onChange={(e) => setNProyector(e.target.value)}
              />
            </Box>
            <Box direction='row' gap='medium'>
              <CheckBox
                checked={computador}
                label='computador'
                onChange={(event) => setComputador(event.target.checked)}
              />
              <TextInput
                value={ncomputador}
                id='resource-quantity'
                name='cantidad'
                min={1}
                type='number'
                onChange={(e) => setNComputador(e.target.value)}
              />
            </Box>
            <Box direction='row' gap='medium'>
              <CheckBox
                checked={aC}
                label='AC'
                onChange={(event) => setAC(event.target.checked)}
              />
              <TextInput
                value={naC}
                id='resource-quantity'
                name='cantidad'
                min={1}
                type='number'
                onChange={(e) => setNAC(e.target.value)}
              />
            </Box>
          </>
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
                  icon={<Edit />}
                  onClick={() => history.push(`/sala/${sala.id}`)}
                />
                <Button
                  icon={<View />}
                  onClick={() => history.push(`/calendario/${sala.id}`)}
                />
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
