import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import EventView from './EventView';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { Container, Grid, Typography } from '@material-ui/core';

moment.locale('es');

function CalendarView() {
  const { roomId } = useParams();
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [showEventDialogDetails, setShowEventDialogDetails] = useState(false);
  const [events, setEvents] = useState([]);
  const [selection, setSelection] = useState();
  const [eventSelected, setEventSelected] = useState();

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

  useEffect(() => {
    const unsubscribe = db
      .collection('rooms')
      .doc(roomId)
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
  }, [roomId]);

  return (
    <Container>
      <Grid>
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
            roomId={roomId}
            selection={selection}
          />
        )}
        {showEventDialogDetails && (
          <EventView
            show={showEventDialogDetails}
            close={() => setShowEventDialogDetails(false)}
            roomId={roomId}
            event={eventSelected}
          />
        )}
      </Grid>
    </Container>
  );
}

function CalendarEvent({ event }) {
  return (
    <Grid>
      <Typography>{event.title}</Typography>
      <Typography>{event.username}</Typography>
    </Grid>
  );
}

export default CalendarView;
