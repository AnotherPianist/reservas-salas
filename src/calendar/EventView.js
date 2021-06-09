import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  TextField,
  Select,
  MenuItem,
  Button
} from '@material-ui/core';
import React, { useState } from 'react';
import { db } from '../firebase';
import useAuth from '../providers/Auth';

function EventView({ close, show, event, roomId, selection }) {
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

  const options = [
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
  ];
  return (
    <Dialog open={show} onClose={close} fullWidth>
      <DialogTitle>Evento</DialogTitle>
      <DialogContent>
        <Grid container direction='column' spacing={2}>
          <Grid item>
            <TextField
              label='Reservado por'
              fullWidth
              value={event ? event.username : user.displayName}
              disabled
            />
          </Grid>
          <Grid item>
            <TextField
              label='Nombre reserva'
              fullWidth
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              multiline
              rowsMax={4}
              label='Detalles adicionales'
              value={details}
              onChange={(e) => {
                setDetails(e.target.value);
              }}
            />
          </Grid>
          <Grid item>
            <TextField
              fullWidth
              id='date'
              label='Fecha'
              format='dd/mm/yy'
              type='date'
              value={date}
              onChange={({ value }) => {
                setDate(value);
              }}
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item>
            <Grid container direction='row' spacing={1}>
              <Grid item>
                <FormControl style={{ minWidth: '14rem' }} fullWidth>
                  <InputLabel id='start-date-select-label'>Desde</InputLabel>
                  <Select
                    fullWidth
                    labelId='start-date-select-label'
                    value={startHour}
                    onChange={(e) => {
                      setStartHour(e.target.value);
                    }}>
                    {options.map((option) => (
                      <MenuItem value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <div style={{ flexGrow: 1 }} />
              <Grid item>
                <FormControl style={{ minWidth: '14rem' }} fullWidth>
                  <InputLabel id='end-date-select-label'>Hasta</InputLabel>
                  <Select
                    fullWidth
                    labelId='end-date-select-label'
                    value={endHour}
                    onChange={(e) => setEndHour(e.target.value)}>
                    {options.map((option) => (
                      <MenuItem value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        {event ? (
          <>
            <Button color='secondary' onClick={handleDelete}>
              Eliminar
            </Button>
            <Button
              color='primary'
              disabled={title.length === 0}
              onClick={handleEdit}>
              Confirmar edición
            </Button>
          </>
        ) : (
          <Button
            disabled={title.length === 0}
            color='primary'
            onClick={handleBook}>
            Confirmar reserva
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default EventView;
