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
import { Close } from 'grommet-icons';
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
  function Recurso(props) {
    const [nombre, setNombre] = useState('');
    const [cantidad, setCantidad] = useState('');
    return (
      <Box>
        <FormField name='name' htmlFor='text-input-id' label='Nombre'>
          <TextInput
            id='text-input-id'
            name='name'
            type='email'
            onChange={(e) => setNombre(e.target.value)}
          />
        </FormField>
        <FormField name='email' htmlFor='text-input-id' label='Descripción'>
          <TextInput
            id='text-input-email'
            name='description'
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
    );
  }

  function Fechas(props) {
    const [inicio, setInicio] = useState(props.inicio);
    const [fin, setFin] = useState(props.fin);
    return (
      <Box>
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
        <Box direction='row'>
          <Box
            border={{ color: 'brand', size: 'small' }}
            width='medium'
            pad='medium'>
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
                {recursosAux.map((rec) => (
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
                        label='eliminar'
                        onClick={() => eliminarElemento(rec)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box>
            <Button label='+' onClick={() => setshowRecurso(true)}></Button>
          </Box>
        </Box>
        <Box direction='row'>
          <Box>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableCell scope='col' border='bottom'>
                    Fecha Inicio
                  </TableCell>
                  <TableCell scope='col' border='bottom'>
                    Fecha Fin
                  </TableCell>
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
                        label='eliminar'
                        onClick={() => eliminarFecha(fechas)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box>
            <Button label='+' onClick={() => setshowFechas(true)} />
          </Box>
        </Box>
        <Button label='Guardar' onClick={() => console.log('guardar')} />
      </Box>
    </>
  );
}

export default Edicion_de_salas;
