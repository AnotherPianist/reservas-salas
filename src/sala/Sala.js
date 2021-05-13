import { useEffect, useState } from 'react';
import {
  FormField,
  TextInput,
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
  Text,
  Button,
  Box,
  Layer,
  DateInput,
  Select,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading
} from 'grommet';
import { Trash, Add } from 'grommet-icons';
import { useHistory, useParams } from 'react-router-dom';
import { db } from '../firebase';

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

  useEffect(() => {
    if (id) {
      db.collection('rooms')
        .doc(id)
        .get()
        .then((sala) => {
          const data = sala.data();
          setName(data.name);
          setDescription(data.description);
          setType(data.type);
        });
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
    }
  }, [id]);

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
      <Layer
        onEsc={() => setshowRecurso(false)}
        onClickOutside={() => setshowRecurso(false)}>
        <Card pad='small'>
          <CardHeader>
            <Heading level='3'>Recurso</Heading>
          </CardHeader>
          <CardBody>
            <Text>Tipo de recurso</Text>
            <Select
              options={['Computador', 'Proyector', 'Pizarra', 'A/C']}
              value={type}
              onChange={({ option }) => setType(option)}
            />
            <FormField
              name='count'
              htmlFor='resource-quantity'
              label='Cantidad'>
              <TextInput
                id='resource-quantity'
                name='cantidad'
                min={0}
                type='number'
                onChange={(e) => setQuantity(e.target.value)}
              />
            </FormField>
          </CardBody>
          <CardFooter>
            <Button
              label='Guardar'
              onClick={() => {
                agregarRecurso({
                  name: type,
                  quantity: quantity
                });
                setshowRecurso(false);
              }}
            />
          </CardFooter>
        </Card>
      </Layer>
    );
  }

  function Fechas(props) {
    const [inicio, setInicio] = useState(props.inicio);
    const [fin, setFin] = useState(props.fin);
    return (
      <Layer
        onEsc={() => setshowFechas(false)}
        onClickOutside={() => setshowFechas(false)}>
        <Text size='xxlarge'>Fechas</Text>
        <Box pad='small'>
          <Text>Fecha de inicio</Text>
          <DateInput
            format='dd/mm/yyyy'
            value={inicio}
            onChange={({ value }) => {
              setInicio(value);
            }}
          />
          <Text>Fecha de fin</Text>
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
        </Box>
      </Layer>
    );
  }

  return (
    <>
      {showRecurso && <Recurso />}
      {showFechas && <Fechas />}
      <Box>
        <FormField name='name' htmlFor='text-input-id' label='Nombre'>
          <TextInput
            id='text-input-id'
            value={name}
            name='name'
            type='email'
            onChange={(e) => setName(e.target.value)}
          />
        </FormField>
        <FormField
          name='description'
          htmlFor='text-input-id'
          label='Descripción'>
          <TextInput
            id='text-input-email'
            name='description'
            value={description}
            type='Paragraph'
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormField>
        <Text size='large'>Tipo</Text>
        <Select
          options={[
            'Laboratorio de Computación',
            'Laboratorio de Física',
            'Laboratorio de Química',
            'Sala'
          ]}
          value={type}
          onChange={({ option }) => setType(option)}
        />
        <Box pad='large'>
          <Text size='xlarge'>Recursos</Text>
          <Box direction='row' justify='center' align='center'>
            <Box width='auto' flex border={{ color: 'brand', size: 'small' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell scope='col' border='bottom'>
                      Recurso
                    </TableCell>
                    <TableCell scope='col' border='bottom'>
                      Cantidad
                    </TableCell>
                    <TableCell scope='col' border='bottom'></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recursos.map((rec) => (
                    <TableRow key={rec.i}>
                      <TableCell scope='col'>
                        <Text>{rec.name}</Text>
                      </TableCell>
                      <TableCell scope='col'>
                        <Text>
                          <Text>{rec.quantity}</Text>
                        </Text>
                      </TableCell>
                      <TableCell>
                        <Button
                          icon={<Trash />}
                          onClick={() => eliminarElemento(rec)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            <Button
              icon={<Add />}
              alignSelf='start'
              onClick={() => setshowRecurso(true)}></Button>
          </Box>
          {/*
          <Text size='xlarge'>Fechas Bloquedas</Text>
          
          <Box direction='row' justify='center' align='center'>
            <Box flex border={{ color: 'brand', size: 'small' }}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell scope='col' border='bottom'>
                      Fecha Inicio
                    </TableCell>
                    <TableCell scope='col' border='bottom'>
                      Fecha Fin
                    </TableCell>
                    <TableCell scope='col' border='bottom'></TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fechasBloquedas.map((fechas) => (
                    <TableRow>
                      <TableCell scope='col'>
                        <Text>{fechas.inicio}</Text>
                      </TableCell>
                      <TableCell scope='col'>
                        <Text>
                          <Text>{fechas.fin}</Text>
                        </Text>
                      </TableCell>
                      <TableCell scope='col'>
                        <Button
                          icon={<Trash />}
                          onClick={() => eliminarFecha(fechas)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Button
              icon={<Add />}
              onClick={() => setshowFechas(true)}
              alignSelf='start'
            />
          </Box>
          */}
        </Box>

        <Button
          alignSelf='end'
          label='Guardar'
          onClick={() => {
            guardarHandler();
            history.replace('/');
          }}
        />
      </Box>
    </>
  );
}

export default Sala;
