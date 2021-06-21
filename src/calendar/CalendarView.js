import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import EventView from './EventView';
import { useHistory, useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Button, Grid, Typography } from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

moment.locale('es');

/**
 * Función principal del componente CalendarView.js
 * @param {*} roomProp, Propiedades de la sala seleccionada para visualizar sus reservas.
 * @returns retorna y renderiza la visualización del calendario y sus reservas.
 */
function CalendarView({ roomProp }) {
  const { roomId } = useParams();
  const history = useHistory();
  const room = roomProp ? roomProp : roomId;
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [showEventDialogDetails, setShowEventDialogDetails] = useState(false);
  const [events, setEvents] = useState([]);
  const [selection, setSelection] = useState();
  const [eventSelected, setEventSelected] = useState();

  /**
   * Variable encargada de dejar los elementos del calendario en espanol.
   */
  const messages = {
    allDay: 'Todo el día',
    previous: '<',
    next: '>',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay eventos en este rango',
    showMore: (total) => `+ Ver más (${total})`
  };

  const localizer = momentLocalizer(moment);

  /**
   * UseEffect que se ejecuta cada vez que haya un cambio en la variable "room" y está
   * encargado de obtener las reservas de la base de datos, encontradas en el documento de
   * "rooms" dado el id de la variable "room" dentro del documento llamado "bookings".
   */
  useEffect(() => {
    const unsubscribe = db
      .collection('rooms')
      .doc(room)
      .collection('bookings')
      .onSnapshot((querySnapshot) => {
        const temp = [];
        querySnapshot.forEach((event) => {
          const eventData = event.data();
          temp.push({
            id: event.id,
            ...eventData,
            start: eventData.start.toDate(),
            end: eventData.end.toDate()
          });
        });
        setEvents(temp);
      });
    return unsubscribe;
  }, [room]);

  return (
    <div>
      <Grid container justify='flex-end' style={{ marginBottom: '2rem' }}>
        <Grid item>
          <Button
            size='large'
            startIcon={<ArrowBackIcon />}
            onClick={() => history.push('/')}>
            Volver
          </Button>
        </Grid>
      </Grid>
      <Calendar
        views={['work_week', 'agenda']}
        defaultView='work_week'
        min={new Date(0, 0, 0, 8, 30, 0)}
        max={new Date(0, 0, 0, 20, 0, 0)}
        localizer={localizer}
        events={events}
        timeslots={1}
        step={70}
        selectable={true}
        messages={messages}
        onSelectEvent={(e) => {
          setEventSelected(e);
          setShowEventDialogDetails(true);
        }}
        onSelectSlot={(e) => {
          setSelection(e);
          setShowCreateEventDialog(true);
        }}
        components={{
          event: CalendarEvent
        }}
      />
      {showCreateEventDialog && (
        <EventView
          show={showCreateEventDialog}
          close={() => setShowCreateEventDialog(false)}
          roomId={room}
          selection={selection}
        />
      )}
      {showEventDialogDetails && (
        <EventView
          show={showEventDialogDetails}
          close={() => setShowEventDialogDetails(false)}
          roomId={room}
          event={eventSelected}
        />
      )}
    </div>
  );
}

/**
 * @param {*} event, parámetro con contiene el titulo de la reserva y el nombre de usuario de la
 * persona que hace o a quién pertenece la reserva.
 * @returns retorna y renderiza la reserva dentro de un determinado horario.
 */
function CalendarEvent({ event }) {
  return (
    <>
      <Typography>{event.title}</Typography>
      <Typography>{event.username}</Typography>
    </>
  );
}

export default CalendarView;
