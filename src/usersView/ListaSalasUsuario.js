import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { db } from '../firebase';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  withStyles
} from '@material-ui/core';
import { Delete, ExpandMore, Add } from '@material-ui/icons';
import React from 'react';

/**
 * Componente AdministrarSalas.js
 * @returns retorna y renderiza los componenetes visualizados en la sección de administrar salas por el
 * administrador, en donde se muestra un buscador, una búsqueda avanzada y la lista de salas creadas.
 */
function ListaSalasUsuario() {
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
   * UseEffect encargado de ejecutarse cada vez que haya algún cambio en la variable search, su
   * objetivo es actualizar las salas a mostrar en caso de que cumplan tanto con la búsqueda de
   * nombre de salas como con la búsqueda avanzada.
   * Los pasos que realiza son en primer lugar recorrer la lista de recursos para filtrar en la
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
        if (checkSearch(rec)) temp.push(rec.idRoom);
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
      const aux = salas;
      setSalasSearch(
        aux.filter((x) => x.name.toLowerCase().includes(search.toLowerCase()))
      );
    }
  }, [search, searchOptions]);

  /**
   * Función ecargada de editar la lista de recursos que se tiene para filtrar.
   * @param {*} index, indice del recurso a filtrar.
   * @param {*} camp, campo a filtrar (resource o minAmount).
   * @param {*} newValue, nuevo valor en que se agregará (tipo de recurso o cantidad de recurso)
   */
  function editSearch(index, camp, newValue) {
    const temp = searchOptions.slice();
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
    var bool = false;
    searchOptions.forEach((option) => {
      if (
        element.name === option.resource &&
        parseInt(element.quantity) >= parseInt(option.minAmount)
      )
        bool = true;
    });
    return bool;
  }

  const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
      backgroundColor: '#f5f5f9',
      color: 'rgba(0, 0, 0, 0.87)',
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(12),
      border: '1px solid #dadde9'
    }
  }))(Tooltip);

  return (
    <Grid container spacing={3} direction='column'>
      <Grid item>
        <Typography variant='h3'>Salas disponibles</Typography>
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
                      InputProps={{ inputProps: { min: 0 } }}
                      value={searchOption.minAmount}
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
        <List>
          {salasSearch.map((sala) => (
            <HtmlTooltip
              title={
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Recurso</TableCell>
                      <TableCell>Cantidad</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {resource.map(
                      (rec) =>
                        rec.idRoom === sala.id && (
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
                        )
                    )}
                  </TableBody>
                </Table>
              }>
              <ListItem
                button
                key={sala.id}
                onClick={() => history.push(`/calendar/${sala.id}`)}>
                <ListItemText
                  primary={sala.name}
                  secondary={sala.description}
                />
              </ListItem>
            </HtmlTooltip>
          ))}
        </List>
      </Grid>
    </Grid>
  );
}

export default ListaSalasUsuario;
