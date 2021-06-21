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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import { Delete, Save, Add, Edit } from '@material-ui/icons';

/**
 * Componente Sala.js.
 * @returns retorna los elementos necesarios para agregar y editar la sala y sus recursos.
 */
function Sala() {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [recursos, setRecursos] = useState([]);
  const [showRecurso, setshowRecurso] = useState(false);
  const [showRecursoEdit, setshowRecursoEdit] = useState(false);
  const [resourceEdit, setResourceEdit] = useState();

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
    }
  }, []);

  /**
   * Función que elimina un recurso de la lista de recursos.
   * @param {*} rec, recurso a eliminar.
   * Se actualiza la lista que contiene los recursos utilizando un filtro, excluyendo al recurso dado
   * como parámetro.
   */
  function eliminarElemento(rec) {
    setRecursos((prevRecursos) => prevRecursos.filter((el) => el !== rec));
  }

  /**
   *Función que agrega un recurso a la lista de recursos .
   * @param {*} recurso, recurso a agregar a la lista de recursos.
   */
  function agregarRecurso(recurso) {
    setRecursos((prevRecursos) => prevRecursos.concat(recurso));
  }

  /**
   * Función encargada de guardar y actualizar los cambios realizados en la sala.
   * @returns, se retornan los recursos actualizados en la base de datos.
   * -En caso de que la sala no tenga un id creado, entonces se agregan los elementos entregados
   * por el usuario a un nuevo documento en las salas y un nuevo documento en los recursos definidos
   * en la base de datos.
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
      db.collection('rooms').doc(id).update({
        name: name,
        description: description,
        type: type
      });
      //update resources
      let temp = [];
      db.collection('resources')
        .where('idRoom', '==', id)
        .get()
        .then((prev) => {
          prev.forEach((element) => {
            temp.push(element.id);
          });
          temp.forEach((element) => {
            db.collection('resources').doc(element).delete();
          });

          recursos.forEach((element) => {
            db.collection('resources').add({
              idRoom: id,
              name: element.name,
              quantity: element.quantity
            });
          });
        });
    }
  }

  /**
   * @param {*} show, de tipo boolean para determinar si mostrar o no la ventana para agregar recursos.
   * @param {*} setshow, función para cambiar el valor de la variable show.
   * @param {*} typeEdit, valor del recurso a editar en el Select.
   * @param {*} quantityEdit, valor de la cantidad de recursos a editar.
   * @returns, retorna o renderiza la ventana para agregar los recursos a la sala.
   * Para controlar la aparición del componente se hace a través de la variable show,
   * dentro de componente modal se hace un llamado al componente ResourseSelect, utilizado para seleccionar
   * un recurso ya creado o para agregar uno nuevo, además se muestra el componente TextField para ingresar la
   * cantidad del recurso seleccionado, además se muestra un último componente con el ícono de un disquete
   * para guardar los cambios realizados.
   */
  function Recurso({ show, setshow, typeEdit, quantityEdit }) {
    const [quantity, setQuantity] = useState('');
    const [type, setType] = useState('');

    /**
     * UseEffect que se utiliza para actualizar los valores de las variables quantity y type, los cuales
     * son los valores que puede tomar el recurso y su cantidad.
     *
     */
    useEffect(() => {
      if (typeEdit && quantityEdit) {
        setQuantity(quantityEdit);
        setType(typeEdit);
      }
    }, []);

    return (
      <Dialog fullWidth open={show} onClose={() => setshow(false)}>
        <DialogTitle>Recurso</DialogTitle>
        <DialogContent>
          {!typeEdit ? (
            <ResourceSelect
              style={{ zindex: 1 }}
              onParentChange={(newValue) => {
                setType(newValue.label);
              }}
            />
          ) : (
            <TextField
              fullWidth
              disabled
              label='Tipo'
              variant='outlined'
              value={type}
              onChange={(e) => setQuantity(e.target.value)}
            />
          )}
          <TextField
            fullWidth
            label='Cantidad'
            type='number'
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          {!checkNewResource(type) && !typeEdit && type !== '' && (
            <Typography color='error'>Este recurso ya existe</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={
              (!checkNewResource(type) && !typeEdit) ||
              type === '' ||
              quantity === ''
            }
            startIcon={<Save />}
            onClick={() => {
              if (!typeEdit) {
                agregarRecurso({
                  name: type,
                  quantity: quantity
                });
                setshowRecurso(false);
              } else {
                for (let index = 0; index < recursos.length; index++) {
                  if (recursos[index].name === type) {
                    recursos[index].quantity = quantity;
                    setshowRecursoEdit(false);
                    return;
                  }
                }
              }
            }}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  function checkNewResource(resource) {
    for (let index = 0; index < recursos.length; index++) {
      if (recursos[index].name === resource) {
        return false;
      }
    }
    return true;
  }

  /**
   * Retorno del componente Sala.js, que se encarga de renderizar la sección de edición y agregación
   * de una sala.
   */
  return (
    <>
      {showRecurso && <Recurso show={showRecurso} setshow={setshowRecurso} />}
      {showRecursoEdit && (
        <Recurso
          show={showRecursoEdit}
          setshow={setshowRecursoEdit}
          typeEdit={resourceEdit.name}
          quantityEdit={resourceEdit.quantity}
        />
      )}

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

        {/*table resource*/}
        <Grid item>
          <Grid container direction='column'>
            <Grid item>
              <Typography variant='h6'>Recursos</Typography>
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
                          <IconButton
                            onClick={() => {
                              setResourceEdit(rec);
                              setshowRecursoEdit(true);
                            }}>
                            <Edit />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Grid container justify='flex-end'>
                  <Grid item>
                    <Button
                      startIcon={<Add />}
                      onClick={() => setshowRecurso(true)}>
                      Añadir recurso
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/*button save*/}
        <Grid item container justify='center'>
          <Grid item>
            <Button
              disabled={name === '' || description === '' || type === ''}
              startIcon={<Save />}
              onClick={() => {
                guardarHandler();
                history.replace('/');
              }}>
              Guardar
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default Sala;
