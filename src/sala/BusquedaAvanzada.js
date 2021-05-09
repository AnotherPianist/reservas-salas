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
import { useState } from 'react';
import AdministrarSalas from './AdministrarSalas';
function BusquedaAvanzada(props) {
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
      <Button label='Guardar' onClick={() => props.setShowBusqueda(false)} />
    </Box>
  );
}
export default BusquedaAvanzada;
