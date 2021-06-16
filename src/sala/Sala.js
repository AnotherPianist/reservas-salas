import { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { db } from '../firebase';
import ResourceSelect from '../components/ResourceSelect';
import {
  TableHead,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Grid,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
  IconButton,
  Typography,
  Modal,
  Box
} from '@material-ui/core';
import { Delete, Save, Add } from '@material-ui/icons';

/**
 *
 * @returns
 */
function Sala() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [recursos, setRecursos] = useState([]);

  const [showRecurso, setshowRecurso] = useState();
  const [resourcesDeleted, setResourcesDeleted] = useState([]);
  const [resourcesAdded, setResourcesAdded] = useState([]);
  const [flag, setFlag] = useState(false);

  /**
   * UseEffect ejecutado en caso de que exista el id de la sala que se quiere mostrar, principalmente
   * se encarga de obtener los datos de la sala y los datos de los recursos de esta según el id dado.
   */
  useEffect(() => {
    if (id) {
      db.collection('resources')
        .where('idRoom', '==', id)
        .get()
        .then((querySnapshot) => {
          const temp = [];
          querySnapshot.forEach((recurso) => {
            temp.push({ id: recurso.id, ...recurso.data() });
          });
          setRecursos(temp);
        });
      db.collection('rooms')
        .doc(id)
        .get()
        .then((sala) => {
          const data = sala.data();
          setName(data.name);
          setDescription(data.description);
          setType(data.type);
        });
      setFlag(true);
    }
  }, []);

  /**
   *  UseEffect que detecta cuando cambia la variable flag, en caso de que cambie, se renderiza
   * la información de la sala.
   */
  useEffect(() => {
    setFlag(false);
  }, [flag]);

  /**
   * Función que recibe un recurso perteneciente a la sala para eliminar.
   * @param {*} rec, recurso a eliminar
   * Se actualiza la lista que contiene los recursos utilizando un filtro, excluyendo al recurso dado
   * como parámetro, en caso de que el id esté definido, se agrega el id del recurso eliminado a la
   * lista que contiene dichos recursos, para eliminarlos posteriormente de la base de datos.
   */
  function eliminarElemento(rec) {
    setRecursos((prevRecursos) => prevRecursos.filter((el) => el !== rec));
    if (id) {
      const temp = resourcesDeleted.slice();
      temp.push(rec.id);
      setResourcesDeleted(temp);
    }
  }

  /**
   *Función que agrega un recurso a la lista de recursos agregados por el usuario.
   * @param {*} recurso, recurso a agregar a la lista de recursos.
   * En caso que el id esté definido, se agrega el recurso a la lista de recursos agregados,
   * que posteriormente se guardarán en la base de datos.
   */
  function agregarRecurso(recurso) {
    setRecursos((prevRecursos) => prevRecursos.concat(recurso));
    if (id) {
      setResourcesAdded((prevRecursos) => prevRecursos.concat(recurso));
    }
  }

  /**
   * Función encargada de guardar y actualizar los cambios realizados en la sala.
   * -En caso de que la sala no tenga un id creado, entonces se agregan los elementos entregados
   * por el usuario a un nuevo documento en las salas y un nuevo documento en los recursos definidos
   * en la base de datos.
   * -En caso de que la sala ya tenga un id creado, se actualizan los datos según los datos agregados por el
   * usuario y en el caso de los recursos se actualizan las listas de elementos agregados o
   * eliminados de la sala (resourcesDeleted, resoursesAdded).
   * @returns, se retornan los recursos actualizados en la base de datos.
   *
   */
  function guardarHandler() {
    if (!id) {
      db.collection('rooms')
        .add({
          name: name,
          description: description,
          type: type
        })
        .then((docRef) => {
          recursos.forEach((recurso) => {
            db.collection('resources').add({
              idRoom: docRef.id,
              name: recurso.name,
              quantity: recurso.quantity
            });
          });
        });
    } else {
      //update room
      var room = db.collection('rooms').doc(id);
      return (
        room.update({
          name: name,
          description: description,
          type: type
        }),
        //delete resources
        resourcesDeleted.forEach((idDelete) =>
          db.collection('resources').doc(idDelete).delete()
        ),
        //add new resources
        resourcesAdded.forEach((resourcesAdd) =>
          db.collection('resources').add({
            idRoom: id,
            name: resourcesAdd.name,
            quantity: resourcesAdd.quantity
          })
        )
      );
    }
  }

  let history = useHistory();

  /**
   * @param {*} props, no se utilizan props.
   * @returns, retorna o renderiza el Modal para agregar los recursos a la sala.
   * Para controlar la aparición del componente se hace a través de la variable showRecurso,
   * dentro de componente modal se hace un llamado al componente ResourseSelect, utilizado para seleccionar
   * un recurso ya creado o para agregar uno nuevo, además se muestra el componente TextField para ingresar la
   * cantidad del recurso seleccionado, además se muestra un último componente con el ícono de un disquete
   * para guardar los cambios realizados.
   */
  function Recurso(props) {
    const [quantity, setQuantity] = useState('');
    const [type, setType] = useState('');

    return (
      <Modal
        open={showRecurso}
        onClose={() => setshowRecurso(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
        <Box bgcolor='white' padding={8}>
          <Typography variant='h5'>Recurso</Typography>

          <ResourceSelect
            id='company-name'
            name='company-name'
            onParentChange={(newValue) => {
              setType(newValue.label);
            }}
          />

          <TextField
            id='coun-resource'
            label='Cantidad'
            type='number'
            onChange={(e) => setQuantity(e.target.value)}
          />

          <IconButton
            onClick={() => {
              agregarRecurso({
                name: type,
                quantity: quantity
              });
              setshowRecurso(false);
            }}>
            <Save />
          </IconButton>
        </Box>
      </Modal>
    );
  }

  /*
   * Retorno del componente Sala.js, que se encarga de renderizar la sección de edición y agregación
   * de una sala.
   */
  return (
    <>
      {showRecurso && <Recurso />}

      <Grid container direction='column' spacing={4}>
        {/*Input name*/}
        <Grid item>
          <TextField
            fullWidth
            variant='outlined'
            defaultValue={name}
            value={name}
            id='name'
            label='Nombre'
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        {/*Input description*/}
        <Grid item>
          <TextField
            fullWidth
            multiline
            variant='outlined'
            defaultValue={description}
            value={description}
            rowsMax={4}
            id='name'
            label='Descripción'
            onChange={(e) => setDescription(e.target.value)}
          />
        </Grid>
        {/*Select type*/}

        <Grid item>
          <Grid container></Grid>
        </Grid>

        <Grid item>
          <FormControl fullWidth>
            <InputLabel id='select-resource-label'>Tipo</InputLabel>
            <Select
              labelId='select-type-label'
              id='select-type'
              value={type}
              onChange={(e) => setType(e.target.value)}>
              <MenuItem value={'Laboratorio de Computación'}>
                Laboratorio de Computación
              </MenuItem>
              <MenuItem value={'Laboratorio de Física'}>
                Laboratorio de Física
              </MenuItem>
              <MenuItem value={'Laboratorio de Química'}>
                Laboratorio de Química
              </MenuItem>
              <MenuItem value={'Sala'}>Sala</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        {/*table resourse*/}
        <Grid item>
          <Grid container direction='column'>
            <Grid item>
              <Typography size='xlarge'>Recursos</Typography>
            </Grid>
            <Grid item>
              <Grid>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell scope='col' border='bottom'>
                        Recurso
                      </TableCell>
                      <TableCell scope='col' border='bottom'>
                        Cantidad
                      </TableCell>
                      <TableCell scope='col' border='bottom'></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recursos.map((rec) => (
                      <TableRow key={rec.i}>
                        <TableCell scope='col'>
                          <Typography>{rec.name}</Typography>
                        </TableCell>
                        <TableCell scope='col'>
                          <Typography>{rec.quantity}</Typography>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => eliminarElemento(rec)}>
                            <Delete />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <Button
                  startIcon={<Add />}
                  alignSelf='start'
                  onClick={() => setshowRecurso(true)}></Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/*button save*/}
        <Grid item>
          <IconButton
            onClick={() => {
              guardarHandler();
              history.replace('/');
            }}>
            <Save />
          </IconButton>
        </Grid>
      </Grid>
    </>
  );
}

export default Sala;
