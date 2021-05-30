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

function Sala() {
  const { id } = useParams();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [recursos, setRecursos] = useState([]);
  const [fechasBloquedas, setFechasBlock] = useState([]);
  const [showFechas, setshowFechas] = useState();
  const [showRecurso, setshowRecurso] = useState();
  const [resourcesDeleted, setResourcesDeleted] = useState([]);
  const [resourcesAdded, setResourcesAdded] = useState([]);
  const [flag, setFlag] = useState(false);

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

  useEffect(() => {
    setFlag(false);
  }, [flag]);

  function eliminarElemento(rec) {
    setRecursos((prevRecursos) => prevRecursos.filter((el) => el !== rec));
    if (id) {
      const temp = resourcesDeleted.slice();
      temp.push(rec.id);
      setResourcesDeleted(temp);
    }
  }

  function eliminarFecha(rec) {
    setFechasBlock((prevRecursos) => prevRecursos.filter((el) => el !== rec));
  }

  function agregarRecurso(recurso) {
    setRecursos((prevRecursos) => prevRecursos.concat(recurso));
    if (id) {
      setResourcesAdded((prevRecursos) => prevRecursos.concat(recurso));
    }
  }

  function agregarFechas(fechas) {
    setFechasBlock((prevRecursos) => prevRecursos.concat(fechas));
  }

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
        room
          .update({
            name: name,
            description: description,
            type: type
          })
          .then(() => {
            console.log('Document successfully updated!');
          })
          .catch((error) => {
            console.error('Error updating document: ', error);
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
          <Typography variant='h5'>Resurso</Typography>

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
  {
    /*
  function Fechas(props) {
    const [inicio, setInicio] = useState(props.inicio);
    const [fin, setFin] = useState(props.fin);
    return (
      <Layer
        onEsc={() => setshowFechas(false)}
        onClickOutside={() => setshowFechas(false)}>
        <Typography variant='h5'>Fechas</Typography>

        <Typography variant='h6'>Fecha de inicio</Typography>
        <DateInput
          format='dd/mm/yyyy'
          value={inicio}
          onChange={({ value }) => {
            setInicio(value);
          }}
        />
        <Typography variant='h6'>Fecha de Fin</Typography>
        <DateInput
          format='dd/mm/yyyy'
          value={fin}
          onChange={({ value }) => {
            setFin(value);
          }}
        />
        <Button
          label='Guardar'
          onClick={() => {
            agregarFechas({ inicio: inicio, fin: fin });
            setshowFechas(false);
            console.log(inicio);
          }}
        />
      </Layer>
    );
  }*/
  }

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
