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
  AccordionPanel,
  Heading,
  CheckBox,
  Tip,
  Select
} from 'grommet';
import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Trash, Add, Calendar, Edit } from 'grommet-icons';
import { db } from '../firebase';
import {
  Grid,
  IconButton,
  TextField,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  FormControl,
  InputLabel,
  MenuItem
  //Select
} from '@material-ui/core';
import { ExpandMore, Search } from '@material-ui/icons';

function AdministrarSalas() {
  let history = useHistory();
  const [search, setSearch] = useState('');
  const [salas, setSalas] = useState([]);
  const [options, setOptions] = useState([]);
  const [value, setValue] = useState('');
  const [flag, setFlag] = useState([]);
  const [resource, setResources] = useState([]);
  const [searchOptions, setSearchOpctions] = useState([]);

  useEffect(() => {
    db.collection('rooms').onSnapshot((querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((sala) => {
        temp.push({ id: sala.id, ...sala.data() });
      });
      setSalas(temp);
      setSalasSearch(temp);
    });
    db.collection('resources').onSnapshot((querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((resource) => {
        temp.push(resource.data());
      });
      setResources(temp);
    });
  }, []);
  useEffect(() => {
    db.collection('resourcesSelect').onSnapshot((querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((resource) => {
        temp.push(resource.data().label);
        console.log(resource.data().label);
      });
      setOptions(temp);
    });
  }, []);
  useEffect(() => {
    setFlag(false);
  }, [flag]);

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

  function editSearch(index, camp, newValue) {
    const temp = searchOptions;
    temp[index][camp] = newValue;
    setSearchOpctions(temp);
    setFlag(true);
  }
  function hadlerDelete(element) {
    setSearchOpctions((prev) => prev.filter((el) => el !== element));
  }
  function checkSearch(element) {
    console.log('searchOptions');
    console.log(searchOptions);
    console.log(element);

    for (let index = 0; index < searchOptions.length; index++) {
      const searchOption = searchOptions[index];
      if (
        element.name === searchOption.resource &&
        parseInt(element.quantity) >= parseInt(searchOption.minAmount)
      ) {
        console.log('true');
        return true;
      }
    }

    return false;
  }

  function searchSala() {
    const searchOptionsAux = [];
    for (let index = 0; index < searchOptions.length; index++) {
      const element = searchOptions[index];
      if (element.resource !== '' && element.minAmount !== '0') {
        searchOptionsAux.push(element);
      }
    }
    console.log('---------------------------------');
    setSearchOpctions(searchOptionsAux);

    if (searchOptionsAux.length > 0) {
      var count = searchOptionsAux.length;

      const temp = [];
      for (let index = 0; index < resource.length; index++) {
        const rec = resource[index];
        if (checkSearch(rec)) {
          temp.push(rec.idRoom);
        }
      }

      const aux = [];
      var contAux = 0;
      salas.forEach((sala) => {
        contAux = 0;
        temp.forEach((idSala) => {
          if (sala.id === idSala) {
            contAux++;
          }
        });
        console.log('xd=> ' + contAux + ' ' + count);
        if (contAux === parseInt(count)) {
          aux.push(sala);
        }
      });
      console.log(aux);

      setSalasSearch(
        aux.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
      );
      //setSalasSearch((prev) =>
      //  prev.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
      //);
      setFlag(true);
    } else {
      const aux = salas;
      setSalasSearch(
        aux.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }

  return (
    <Grid container spacing={3} direction='column'>
      <Grid item xs={12}>
        <Heading>Administrar salas</Heading>
      </Grid>
      <Grid container>
        <Grid item xs>
          <TextField
            fullWidth
            id='search'
            label='Buscar'
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item xs>
          <IconButton aria-label='search' onClick={() => searchSala()}>
            <Search />
          </IconButton>
        </Grid>
      </Grid>
      <Grid container>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls='panel1a-content'
            id='panel1a-header'>
            <Typography>Busqueda Avanzada</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid
              container
              spacing={3}
              direction='column'
              width='medium'
              justify='center'
              alignContent='center'>
              {searchOptions.map((searchOption, i) => (
                <Grid item>
                  <Grid container>
                    <Grid item xs>
                      <FormControl fullWidth>
                        <InputLabel id='select-resource-label'>
                          Recurso
                        </InputLabel>
                        {/*<Select
                          labelId='select-resource-label'
                          id='select-resource'
                          value={searchOption.resource}
                          onChange={({ option }) =>
                            editSearch(i, 'resource', option)
                          }>
                          {options.map((option) => (
                            <MenuItem value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                          */}
                      </FormControl>
                      <Select
                        placeholder='Recurso'
                        options={options}
                        value={searchOption.resource}
                        onChange={({ option }) =>
                          editSearch(i, 'resource', option)
                        }
                      />
                    </Grid>
                    <Grid item xs>
                      <TextField
                        id='coun-resource'
                        label='Cantidad Minima'
                        type='number'
                        onChange={(e) => console.log(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs>
                      <Button
                        onClick={() => hadlerDelete(searchOption)}
                        icon={<Trash />}></Button>
                    </Grid>
                  </Grid>
                </Grid>
              ))}

              <Button
                onClick={() =>
                  setSearchOpctions((prev) =>
                    prev.concat({ resource: '', minAmount: '0' })
                  )
                }
                icon={<Add />}></Button>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>

      <Heading level='2' margin={{ top: 'xlarge' }}>
        Lista de salas
      </Heading>

      <Grid>
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
                  <Tip
                    background='white'
                    content={
                      <Box>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableCell scope='col' border='bottom'>
                                Recurso
                              </TableCell>
                              <TableCell scope='col' border='bottom'>
                                Cantidad
                              </TableCell>
                            </TableRow>
                          </TableHeader>
                        </Table>
                        <TableBody>
                          {resource.map((rec) =>
                            rec.idRoom === sala.id ? (
                              <TableRow key={rec.i}>
                                <TableCell scope='col'>
                                  <Text>{rec.name}</Text>
                                </TableCell>
                                <TableCell scope='col'>
                                  <Text>
                                    <Text>{rec.quantity}</Text>
                                  </Text>
                                </TableCell>
                              </TableRow>
                            ) : null
                          )}
                        </TableBody>
                      </Box>
                    }>
                    <Text>{sala.name}</Text>
                  </Tip>
                </TableCell>
                <TableCell scope='col'>
                  <Text>
                    <Text>{sala.description}</Text>
                  </Text>
                </TableCell>
                <TableCell>
                  <Button
                    icon={<Calendar />}
                    onClick={() => history.push(`/calendar/${sala.id}`)}
                  />
                  <Button
                    icon={<Edit />}
                    onClick={() => history.push(`/room/${sala.id}`)}
                  />

                  <Button icon={<Trash />} onClick={() => eliminarSala(sala)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>

      <Link to='/room'>
        <Button icon={<Add />} />
      </Link>
    </Grid>
  );
}

export default AdministrarSalas;
