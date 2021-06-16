import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
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
  MenuItem,
  Select,
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Button,
  Container
} from '@material-ui/core';
import { CalendarToday, Delete, ExpandMore, Add } from '@material-ui/icons';
import React from 'react';
import CalendarView from '../calendar/CalendarView';

function PrincipalEstudiante() {
  const [search, setSearch] = useState('');
  const [salas, setSalas] = useState([]);
  const [options, setOptions] = useState([]);
  const [flag, setFlag] = useState([]);
  const [resource, setResources] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [salaId, setSalaId] = useState();

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
      });
      setOptions(temp);
    });
  }, []);

  useEffect(() => {
    setFlag(false);
  }, [flag]);

  const [salasSearch, setSalasSearch] = useState(salas);

  function editSearch(index, camp, newValue) {
    const temp = searchOptions;
    temp[index][camp] = newValue;
    setSearchOptions(temp);
    setFlag(true);
  }

  function hadlerDelete(element) {
    setSearchOptions((prev) => prev.filter((el) => el !== element));
  }

  function checkSearch(element) {
    for (let index = 0; index < searchOptions.length; index++) {
      const searchOption = searchOptions[index];
      if (
        element.name === searchOption.resource &&
        parseInt(element.quantity) >= parseInt(searchOption.minAmount)
      ) {
        return true;
      }
    }
    return false;
  }

  useEffect(() => {
    const searchOptionsAux = [];
    for (let index = 0; index < searchOptions.length; index++) {
      const element = searchOptions[index];
      if (element.resource !== '' && element.minAmount !== '0') {
        searchOptionsAux.push(element);
      }
    }
    setSearchOptions(searchOptionsAux);

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
          if (sala.id === idSala) contAux++;
        });
        if (contAux === parseInt(count)) aux.push(sala);
      });

      setSalasSearch(
        aux.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
      );

      setFlag(true);
    } else {
      const aux = salas;
      setSalasSearch(
        aux.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [salasSearch]);

  return (
    <Container style={{ marginTop: '2rem' }}>
      <Grid container spacing={3} direction='column'>
        <Grid item>
          <Typography variant='h3'>Selecciona una sala</Typography>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            id='search'
            label='Buscar'
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid container style={{ width: '100%' }}>
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
                          <Select
                            labelId='select-resource-label'
                            id='select-resource'
                            value={searchOption.resource}
                            onChange={(e) =>
                              editSearch(i, 'resource', e.target.value)
                            }>
                            {options.map((option) => (
                              <MenuItem value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs>
                        <TextField
                          id='coun-resource'
                          label='cant. Min'
                          type='number'
                          onChange={(e) =>
                            editSearch(i, 'minAmount', e.target.value)
                          }
                        />
                      </Grid>
                      <Grid item xs>
                        <IconButton onClick={() => hadlerDelete(searchOption)}>
                          <Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}

                <Button
                  onClick={() =>
                    setSearchOptions((prev) =>
                      prev.concat({ resource: '', minAmount: '0' })
                    )
                  }
                  startIcon={<Add />}></Button>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Typography variant='h2'>Lista de salas</Typography>

        <Grid>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell scope='col' border='bottom'>
                  Nombre
                </TableCell>
                <TableCell scope='col' border='bottom'>
                  Descripción
                </TableCell>
                <TableCell scope='col' border='bottom'></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salasSearch.map((sala) => (
                <TableRow>
                  <TableCell scope='col'>
                    <Tooltip
                      color='rgba(0, 0, 0, 0.87)'
                      placement='right'
                      title={
                        <Grid style={{ backgroundColor: 'white' }}>
                          <Table>
                            <TableHead>
                              <TableRow>
                                <TableCell scope='col' border='bottom'>
                                  Recurso
                                </TableCell>
                                <TableCell scope='col' border='bottom'>
                                  Cantidad
                                </TableCell>
                              </TableRow>
                            </TableHead>
                          </Table>
                          <TableBody>
                            {resource.map((rec) =>
                              rec.idRoom === sala.id ? (
                                <TableRow key={rec.i}>
                                  <TableCell scope='col'>
                                    <Typography>{rec.name}</Typography>
                                  </TableCell>
                                  <TableCell scope='col'>
                                    <Typography>
                                      <Typography>{rec.quantity}</Typography>
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ) : null
                            )}
                          </TableBody>
                        </Grid>
                      }>
                      <Typography>{sala.name}</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell scope='col'>
                    <Typography>
                      <Typography>{sala.description}</Typography>
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => setSalaId(sala.id)}>
                      <CalendarToday />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      {salaId && <CalendarView roomProp={salaId} />}
    </Container>
  );
}

export default PrincipalEstudiante;
