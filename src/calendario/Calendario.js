import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles.css';
import 'moment/locale/es';
import { Trash } from 'grommet-icons';
import {
  Layer,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  TextInput,
  TextArea,
  Text,
  DateInput,
  Grid,
  MaskedInput
} from 'grommet';

moment.locale('es');

export const Calendario = () => {
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [idc, setIdc] = useState(0);
  const today = moment().toDate().toISOString();
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [name, setName] = useState('');
  const [requeriments, setRequeriments] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [activeEvent, setActiveEvent] = useState('');
  const [events, setEvents] = useState([]);

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

  function eventGetter(event) {
    setActiveEvent(event);
  }

  function handleSlotSelection({ start, end, slots, action }) {
    if (action === 'click') {
      setShowEventDialog(true);
      setSelectedDay(start.getDate());
    }
  }

  function handleTodayDate(events) {
    console.log(events);
  }

  function handleReservar() {
    setShowEventDialog(false);
    if (startHour && endHour && requeriments && name) {
      const startTime = startHour.split(':');
      let hora = parseInt(startTime[0], 10);
      let minutos = parseInt(startTime[1], 10);
      const start = moment({
        day: selectedDay,
        hour: hora,
        minutes: minutos
      }).toDate();
      const endTime = endHour.split(':');
      hora = parseInt(endTime[0], 10);
      minutos = parseInt(endTime[1], 10);
      const end = moment({
        day: selectedDay,
        hour: hora,
        minutes: minutos
      }).toDate();

      const newEvents = events.slice();
      newEvents.push({
        id: idc + 1,
        title: requeriments,
        start: start,
        end: end,
        userName: name
      });

      setIdc(idc + 1);
      setEvents(newEvents);
      setName('');
      setRequeriments('');
      setStartHour('');
      setEndHour('');
    } else {
      console.log('faltan campos por rellenar');
    }
  }

  function handleRemoveEvent(event) {
    console.log(event.id);
    setEvents((events) => events.filter((ev) => ev.id !== event.id));
  }

  function calendarEvent({ event }) {
    return (
      <div>
        <div style={{ float: 'right', size: 'small' }}>
          <Button
            onClick={(e) => {
              console.log(e.id);
              handleRemoveEvent(event);
            }}
            style={{
              border: '2px solid black',
              backgroundColor: 'white',
              width: '1.7rem',
              height: '1.7rem'
            }}>
            <Trash color='plain' style={{ padding: '0.1rem' }} />
          </Button>
        </div>
        <br></br>
        <span>{event.title}</span>
        <span>-{event.userName}</span>
      </div>
    );
  }

  return (
    <div className='calendar-screen'>
      <Calendar
        views={['work_week']}
        defaultDate={new Date()}
        defaultView='work_week'
        min={new Date(0, 0, 0, 8, 30, 0)}
        max={new Date(0, 0, 0, 20, 0, 0)}
        localizer={localizer}
        events={events}
        timeslots={1}
        step={70}
        selectable={true}
        messages={messages}
        eventPropGetter={eventGetter}
        onSelectSlot={handleSlotSelection}
        onSelectEvent={(e) => console.log()}
        components={{
          event: calendarEvent
        }}
      />
      {showEventDialog && (
        <Layer
          onEsc={() => setShowEventDialog(false)}
          onClickOutside={() => setShowEventDialog(false)}>
          <Card>
            <CardHeader direction='column' pad='medium'>
              <TextInput
                value={name}
                placeholder='Nombre reserva'
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <TextArea
                resize={false}
                placeholder='Requerimiento o descripción'
                value={requeriments}
                onChange={(e) => {
                  setRequeriments(e.target.value);
                }}
              />
            </CardHeader>
            <CardBody pad='medium'>
              <Grid
                rows={['xsmall', 'xsmall']}
                columns={['10rem', '10rem']}
                gap='small'
                areas={[
                  { name: 'nav', start: [0, 0], end: [0, 0] },
                  { name: 'main', start: [1, 0], end: [1, 0] },
                  { name: 'hh', start: [0, 1], end: [1, 1] },
                  { name: 'hm', start: [1, 1], end: [1, 1] }
                ]}>
                <Box gridArea='nav' background='light-2'>
                  <Text>Desde</Text>
                  <DateInput format='dd/mm/yyyy' />
                </Box>
                <Box gridArea='main' background='light-2'>
                  <Text>Hasta</Text>
                  <DateInput format='dd/mm/yyyy' />
                </Box>
                <Box gridArea='hh' background='light-2'>
                  <Text>Desde</Text>
                  <MaskedInput
                    mask={[
                      {
                        length: [1, 2],
                        options: [
                          '8:30',
                          '9:40',
                          '10:50',
                          '12:00',
                          '13:10',
                          '14:20',
                          '15:30',
                          '16:40',
                          '17:50',
                          '19 :00'
                        ],
                        regexp: /^1[1-2]$|^[0-9]$/
                      }
                    ]}
                    value={startHour}
                    onChange={(event) => {
                      setStartHour(event.target.value);
                    }}
                  />
                </Box>
                <Box gridArea='hm' background='light-2'>
                  <Text>Hasta</Text>
                  <MaskedInput
                    mask={[
                      {
                        length: [1, 2],
                        options: [
                          '9:30',
                          '10:40',
                          '11:50',
                          '13:00',
                          '14:10',
                          '15:20',
                          '16:30',
                          '17:40',
                          '18:50',
                          '20:00'
                        ],
                        regexp: /^1[1-2]$|^[0-9]$/
                      }
                    ]}
                    value={endHour}
                    onChange={(event) => {
                      setEndHour(event.target.value);
                    }}
                  />
                </Box>
              </Grid>
              <br />
              <Grid
                rows={['xxsmall']}
                columns={['xxxsmall', 'xxxsmall']}
                areas={[{ name: 'header', start: [0, 0], end: [1, 0] }]}>
                <Box
                  gridArea='header'
                  background='light-2'
                  style={{ paddingBottom: '4rem' }}>
                  <Button label='Confirmar reserva' onClick={handleReservar} />
                </Box>
              </Grid>
            </CardBody>
          </Card>
        </Layer>
      )}
    </div>
  );
};
