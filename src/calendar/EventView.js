import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  DateInput,
  Select,
  Text,
  TextArea,
  TextInput
} from 'grommet';
import React, { useState } from 'react';
import { db } from '../firebase';
import useAuth from '../providers/Auth';

function EventView({ close, event, roomId, selection }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(event ? event.title : '');
  const [details, setDetails] = useState(event ? event.details : '');
  const [date, setDate] = useState(
    event ? event.start.toISOString() : selection.start.toISOString()
  );
  const [startHour, setStartHour] = useState(
    event
      ? `${event.start.getHours()}:${event.start.getMinutes() || '00'}`
      : `${selection.start.getHours()}:${selection.start.getMinutes() || '00'}`
  );
  const [endHour, setEndHour] = useState(
    event
      ? `${event.end.getHours()}:${event.end.getMinutes() || '00'}`
      : `${selection.end.getHours()}:${selection.end.getMinutes() || '00'}`
  );

  function handleBook() {
    const startDate = new Date(date);
    startDate.setHours(...startHour.split(':'), 0);
    const endDate = new Date(date);
    endDate.setHours(...endHour.split(':'), 0);
    const event = {
      username: user.displayName,
      title: title,
      details: details,
      start: startDate,
      end: endDate
    };
    db.collection('rooms').doc(roomId).collection('bookings').add(event);
    close();
  }

  function handleEdit() {
    const startDate = new Date(date);
    startDate.setHours(...startHour.split(':'), 0);
    const endDate = new Date(date);
    endDate.setHours(...endHour.split(':'), 0);
    const updatedEvent = {
      username: event.username,
      title: title,
      details: details,
      start: startDate,
      end: endDate
    };
    db.collection('rooms')
      .doc(roomId)
      .collection('bookings')
      .doc(event.id)
      .update(updatedEvent);
    close();
  }

  function handleDelete() {
    db.collection('rooms')
      .doc(roomId)
      .collection('bookings')
      .doc(event.id)
      .delete();
    close();
  }

  return (
    <Card>
      <CardHeader direction='column' pad='medium'>
        <TextInput value={event ? event.username : user.displayName} disabled />
        <TextInput
          value={title}
          placeholder='Nombre reserva'
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <TextArea
          resize={false}
          placeholder='Detalles adicionales'
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
          }}
        />
      </CardHeader>
      <CardBody pad='medium'>
        <Text>Fecha</Text>
        <DateInput
          format='dd/mm/yy'
          value={date}
          onChange={({ value }) => setDate(value)}
        />

        <Box direction='row-responsive' margin={{ top: 'small' }}>
          <Box margin={{ right: 'small' }}>
            <Text>Desde</Text>
            <Select
              defaultValue={startHour}
              options={[
                '8:30',
                '9:40',
                '10:50',
                '12:00',
                '13:10',
                '14:20',
                '15:30',
                '16:40',
                '17:50',
                '19:00'
              ]}
              onChange={({ option }) => setStartHour(option)}
            />
          </Box>
          <Box margin={{ left: 'small' }}>
            <Text>Hasta</Text>
            <Select
              defaultValue={endHour}
              options={[
                '9:40',
                '10:50',
                '12:00',
                '13:10',
                '14:20',
                '15:30',
                '16:40',
                '17:50',
                '19:00',
                '20:00'
              ]}
              onChange={({ option }) => setEndHour(option)}
            />
          </Box>
        </Box>
      </CardBody>
      <CardFooter justify='center' pad='medium'>
        {event ? (
          <Box direction='row-responsive' flex='grow' justify='between'>
            <Button
              disabled={title.length === 0}
              label='Confirmar edición'
              primary
              onClick={handleEdit}
            />
            <Button label='Eliminar' onClick={handleDelete} />
          </Box>
        ) : (
          <Button
            disabled={title.length === 0}
            label='Confirmar reserva'
            primary
            onClick={handleBook}
          />
        )}
      </CardFooter>
    </Card>
  );
}

export default EventView;
