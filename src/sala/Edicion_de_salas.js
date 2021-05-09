import { useState } from 'react';
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
  DateInput
} from 'grommet';
import { Trash, Add } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
function Edicion_de_salas() {
  const [recursosAux, setRecursos] = useState([
    { name: 'sillas', cantidad: '3' },
    { name: 'computador', cantidad: '2' },
    { name: 'laptop', cantidad: '1' },
    { name: 'pc', cantidad: '5' }
  ]);
  const [fechasBloquedas, setFechasBlock] = useState([
    { inicio: '01/02/2020', fin: '08/02/2020' },
    { inicio: '01/03/2020', fin: '08/03/2020' }
  ]);

  const [sala, setSala] = useState({
    name: '',
    description: '',
    recursos: [
      { name: 'sillas', cantidad: '3' },
      { name: 'computador', cantidad: '2' },
      { name: 'laptop', cantidad: '1' },
      { name: 'pc', cantidad: '5' }
    ],
    fechas: [
      { inicio: '01/02/2020', fin: '08/02/2020' },
      { inicio: '01/03/2020', fin: '08/03/2020' }
    ]
  });
  const [showFechas, setshowFechas] = useState();
  const [showRecurso, setshowRecurso] = useState();
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const eliminarElemento = (rec) => {
    setRecursos((prevRecursos) => prevRecursos.filter((el) => el !== rec));
  };
  const eliminarFecha = (rec) => {
    setFechasBlock((prevRecursos) => prevRecursos.filter((el) => el !== rec));
  };
  const agregarReccurso = (recurso) => {
    setRecursos((prevRecursos) => prevRecursos.concat(recurso));
  };
  const agregarFechas = (fechas) => {
    setFechasBlock((prevRecursos) => prevRecursos.concat(fechas));
  };
  const guardarHandler = () => {
    console.log('guardar');
  };
  let history = useHistory();
  function Recurso(props) {
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState('');
    return (
      <>
        <Text size='xxlarge'>Recurso</Text>
        <Box>
          <FormField name='name' htmlFor='text-input-id' label='Nombre'>
            <TextInput
              id='text-input-id'
              name='name'
              type='email'
              onChange={(e) => setNombre(e.target.value)}
            />
          </FormField>
          <FormField name='count' htmlFor='text-input-id' label='Cantidad'>
            <TextInput
              name='cantidad'
              type='Paragraph'
              onChange={(e) => setCantidad(e.target.value)}
            />
          </FormField>
          <Button
            label='Guardar'
            onClick={() => (
              agregarReccurso({ name: nombre, cantidad: cantidad }),
              setshowRecurso(false)
            )}
          />
        </Box>
      </>
    );
  }

  function Fechas(props) {
    const [inicio, setInicio] = useState(props.inicio);
    const [fin, setFin] = useState(props.fin);
    return (
      <>
        <Text size='xxlarge'>Fechas</Text>
        <Box pad='xlarge'>
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
            onClick={() => (
              agregarFechas({ inicio: inicio, fin: fin }),
              setshowFechas(false),
              console.log(inicio)
            )}
          />
        </Box>
      </>
    );
  }

  return (
    <>
      {showRecurso && (
        <Layer
          onEsc={() => setshowRecurso(false)}
          onClickOutside={() => setshowRecurso(false)}>
          <Recurso />
        </Layer>
      )}
      {showFechas && (
        <Layer
          onEsc={() => setshowFechas(false)}
          onClickOutside={() => setshowFechas(false)}>
          <Fechas />
        </Layer>
      )}
      <Box>
        <FormField name='name' htmlFor='text-input-id' label='Nombre'>
          <TextInput id='text-input-id' name='name' type='email' />
        </FormField>
        <FormField name='email' htmlFor='text-input-id' label='Descripción'>
          <TextInput
            id='text-input-email'
            name='description'
            type='Paragraph'
          />
        </FormField>

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
                  {sala.recursos.map((rec) => (
                    <TableRow>
                      <TableCell scope='col'>
                        <Text>{rec.name}</Text>
                      </TableCell>
                      <TableCell scope='col'>
                        <Text>
                          <Text>{rec.cantidad}</Text>
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
                  {sala.fechas.map((fechas) => (
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
        </Box>
        <Button
          alignSelf='end'
          label='Guardar'
          onClick={() => {
            guardarHandler();
            history.replace('/admin');
          }}
        />
      </Box>
    </>
  );
}

export default Edicion_de_salas;
