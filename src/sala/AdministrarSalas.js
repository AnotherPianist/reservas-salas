import { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
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
  Button
} from '@material-ui/core';
import {
  CalendarToday,
  Delete,
  ExpandMore,
  Add,
  Edit
} from '@material-ui/icons';
import React from 'react';

/**
 * Componente AdministrarSalas.js
 * @returns retorna y renderiza los componenetes visualizados en la sección de administrar salas por el
 * administrador, en donde se muestra un buscador, una búsqueda avanzada y la lista de salas creadas.
 */
function AdministrarSalas() {
  const history = useHistory();
  const [search, setSearch] = useState('');
  const [salas, setSalas] = useState([]);
  const [options, setOptions] = useState([]);
  const [resource, setResources] = useState([]);
  const [searchOptions, setSearchOptions] = useState([]);
  const [salasSearch, setSalasSearch] = useState(salas);

  /**
   * useEffect utilizado para obtener los datos de las salas.
   */
  useEffect(() => {
    const unsubscribe = db.collection('rooms').onSnapshot((querySnapshot) => {
      const temp = [];
      querySnapshot.forEach((sala) => {
        temp.push({ id: sala.id, ...sala.data() });
      });
      setSalas(temp);
      setSalasSearch(temp);
    });
    return unsubscribe;
  }, []);

  /**
   * useEffect utilizado para obtener recursos desde la base de datos
   */
  useEffect(() => {
    const unsubscribe = db
      .collection('resources')
      .onSnapshot((querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((resource) => {
          temp.push(resource.data());
        });
        setResources(temp);
      });
    return unsubscribe;
  }, []);

  /**
   * useEffect utilizado para obtener los recursos disponibles que han sido registrados en la base de datos.
   */
  useEffect(() => {
    db.collection('resourcesSelect')
      .get()
      .then((querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((resource) => {
          temp.push(resource.data().label);
        });
        setOptions(temp);
      });
  }, []);

  /**
   * UseEffect encargado de ejecutarse cada vez que haya algún cambio en la variable search o searchOptions,
   * su objetivo es actualizar las salas a mostrar en caso de que cumplan tanto con la búsqueda de
   * nombre de salas como con la búsqueda avanzada.
   * Los pasos que realiza son, en primer lugar recorrer la lista de recursos para filtrar en la
   * búsqueda avanzada, para limpiarla en caso de que no se seleccione recurso y cantidad, luego:
   * -En caso de que la lista tenga algún elemento, se recorre la lista de recursos general y en
   * caso de que checkSearch retorne true, se agregará el id de la sala a la que pertenece el
   * recurso a una lista temporal y posteriormente se agregan las salas a una nueva lista que
   * coincidan con el id obtenido anteriormente, finalmente se aplica la busqueda por nombre
   * sobre la lista de salas final.
   * -En caso de que la lista esté vacía solo se aplica la búsqueda por nombre sobre la lista de salas.
   */
  useEffect(() => {
    if (searchOptions) {
      const temp = [];
      resource.forEach((rec) => {
        if (checkSearch(rec)) temp.push(rec.idRom);
      });

      const aux = [];
      salas.forEach((sala) => {
        let contAux = 0;
        temp.forEach((idSala) => {
          if (sala.id === idSala) contAux++;
        });
        if (contAux === searchOptions.length) aux.push(sala);
      });

      setSalasSearch(
        aux.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
      );
    } else {
      setSalasSearch(
        salas.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [search, searchOptions]);

  /**
   * Función encargada de eliminar una sala.
   * @param {*} sala, sala a eliminar de la base de datos.
   * En las variables que se guardan las salas y las salas a buscar se quita la sala dada como parámetro,
   * luego se elimina del documento "rooms", la sala según su id, además se eliminan los recursos que
   * ésta tenga agregados.
   */
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

  /**
   * Función ecargada de editar la lista de recursos que se tiene para filtrar.
   * @param {*} index, indice del recurso a filtrar.
   * @param {*} camp, campo a filtrar (resource o minAmount).
   * @param {*} newValue, nuevo valor en que se agregará (tipo de recurso o cantidad de recurso)
   */
  function editSearch(index, camp, newValue) {
    const temp = searchOptions;
    temp[index][camp] = newValue;
    setSearchOptions(temp);
  }

  /**
   * Función utilizada para eliminar un recurso de la lista de recursos para filtrar.
   * @param {*} element, recurso a eliminar de la lista.
   */
  function handleDelete(element) {
    setSearchOptions((prev) => prev.filter((el) => el !== element));
  }

  /**
   * Función encargada de verificar la búsqueda avanzada dado un recurso.
   * recorre la searchOptions y compara con el recurso dado como argumento.
   * @param {*} element, recurso a filtrar.
   * @returns retorna true en caso de el nombre del recurso entregado como parámetro
   * coincida con el nombre de algún recurso de la lista que contiene los recursos a filtrar y además
   * de que la cantidad que tenga asignado ese recurso sea mayor o igual al elemento contenido en la lista.
   * -Retorna false, en caso de que ninguno de los recursos de la lista coincida con el elemento dado como
   * parámetro.
   */
  function checkSearch(element) {
    searchOptions.forEach((option) => {
      if (
        element.name === option.resource &&
        parseInt(element.quantity) >= parseInt(option.minAmount)
      )
        return true;
    });
    return false;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <Grid container spacing={3} direction='column'>
        <Grid item>
          <Typography variant='h3'>Administrar salas</Typography>
        </Grid>
        <Grid item>
          <TextField
            fullWidth
            id='search'
            label='Buscar'
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>
        <Grid item>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMore />}>
              <Typography>Búsqueda Avanzada</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={3} direction='column'>
                {searchOptions.map((searchOption, i) => (
                  <Grid item container spacing={2}>
                    <Grid item>
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
                          }
                          style={{ minWidth: '12rem' }}>
                          {options.map((option) => (
                            <MenuItem value={option}>{option}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <TextField
                        label='Cantidad mínima'
                        type='number'
                        onChange={(e) =>
                          editSearch(i, 'minAmount', e.target.value)
                        }
                      />
                    </Grid>
                    <Grid item>
                      <IconButton onClick={() => handleDelete(searchOption)}>
                        <Delete />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))}
                <Button
                  onClick={() =>
                    setSearchOptions((prev) =>
                      prev.concat({ resource: '', minAmount: '0' })
                    )
                  }
                  startIcon={<Add />}>
                  Añadir filtro
                </Button>
              </Grid>
            </AccordionDetails>
          </Accordion>
        </Grid>

        <Grid item>
          <Typography variant='h4'>Lista de salas</Typography>
        </Grid>

        <Grid item>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {salasSearch.map((sala) => (
                <TableRow key={sala.id}>
                  <TableCell>
                    <Tooltip
                      placement='right'
                      title={
                        <Table style={{ backgroundColor: 'white' }}>
                          <TableHead>
                            <TableRow>
                              <TableCell>Recurso</TableCell>
                              <TableCell>Cantidad</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {resource.map((rec) =>
                              rec.idRoom === sala.id ? (
                                <TableRow key={rec.i}>
                                  <TableCell>
                                    <Typography>{rec.name}</Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography>
                                      <Typography>{rec.quantity}</Typography>
                                    </Typography>
                                  </TableCell>
                                </TableRow>
                              ) : null
                            )}
                          </TableBody>
                        </Table>
                      }>
                      <Typography>{sala.name}</Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography>{sala.description}</Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => history.push(`/calendar/${sala.id}`)}>
                      <CalendarToday />
                    </IconButton>
                    <IconButton
                      onClick={() => history.push(`/room/${sala.id}`)}>
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => eliminarSala(sala)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>
      <Grid container direction='column' alignItems='flex-end' spacing={4}>
        <Grid item>
          <Link to='/room'>
            <Button startIcon={<Add />}>Crear nueva sala</Button>
          </Link>
        </Grid>
      </Grid>
    </div>
  );
}

export default AdministrarSalas;
