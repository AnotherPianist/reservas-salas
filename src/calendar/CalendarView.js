import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import { Layer, Box, Text } from 'grommet';
import EventView from './EventView';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';

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
    <Box flex>
      <Calendar
        views={['work_week']}
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
          setShowEventDialogDetails(true);
          setEventSelected(e);
        }}
        onSelectSlot={(e) => {
          setShowCreateEventDialog(true);
          setSelection(e);
        }}
        components={{
          event: CalendarEvent
        }}
      />
      {showCreateEventDialog && (
        <Layer
          onEsc={() => setShowCreateEventDialog(false)}
          onClickOutside={() => setShowCreateEventDialog(false)}>
          <EventView
            close={() => setShowCreateEventDialog(false)}
            roomId={roomId}
            selection={selection}
          />
        </Layer>
      )}
      {showEventDialogDetails && (
        <Layer
          onEsc={() => setShowEventDialogDetails(false)}
          onClickOutside={() => setShowEventDialogDetails(false)}>
          <EventView
            close={() => setShowEventDialogDetails(false)}
            roomId={roomId}
            event={eventSelected}
          />
        </Layer>
      )}
    </Box>
  );
}

function CalendarEvent({ event }) {
  return (
    <Box>
      <Text>{event.title}</Text>
      <Text>{event.username}</Text>
    </Box>
  );
}

export default CalendarView;
