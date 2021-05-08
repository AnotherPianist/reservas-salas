import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './styles.css';
import 'moment/locale/es';
import { messages } from './calendar-message-es';
import { Trash } from 'grommet-icons';

import {
  Layer,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
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
  const [show, setShow] = useState(false);
  const [idc, setIdc] = useState(0);
  const today = moment().toDate().toISOString();
  const [startHour, setStartHour] = useState('');
  const [endHour, setEndHour] = useState('');
  const [nombre, setNombre] = useState('');
  const [req, setReq] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [activeEvent, setActiveEvent] = useState('');
  const localizer = momentLocalizer(moment);

  const eventGetter = (event, start, end, isSelected) => {
    setActiveEvent(event);
  };
  const [events, setEvents] = useState([
    {
      id: 0,
      title: 'Horario protegido',
      start: moment({ day: 6, hours: 12 }).toDate(),
      end: moment({ day: 6, hours: 14, minute: 20 }).add().toDate(),
      bgcolor: '#fafafa',
      userName: 'Por el piña'
    },
    {
      id: 0,
      title: 'Horario protegido',
      start: moment({ day: 7, hours: 12 }).toDate(),
      end: moment({ day: 7, hours: 14, minute: 20 }).add().toDate(),
      bgcolor: '#fafafa',
      userName: 'Por el nico'
    }
  ]);

  const handleOnClick = (e) => {
    console.log(e);
  };

  const handleSlotSelection = ({ start, end, slots, action }) => {
    console.log(slots);
    if (action === 'click') {
      console.log(slots);
      setShow(true);
      setSelectedDay(start.getDay() + 2);
    }
  };
  const handleTodayDate = (events) => {
    console.log(events);
  };

  const handleReservar = () => {
    setShow(false);
    if (startHour && endHour && req && nombre) {
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
      let i = idc + 1;
      const newSchedule = {
        id: i,
        title: req,
        start: start,
        end: end,
        userName: nombre
      };

      setIdc(i);
      setEvents([...events, newSchedule]);
      setNombre('');
      setReq('');
      setStartHour('');
      setEndHour('');
    } else {
      console.log('faltan campos por rellenar');
    }
  };

  const handelRemoveEvent = (event) => {
    let newEvents = [...events];
    let index = -1;
    events.forEach((e, i) => {
      if (e.id == event.id) {
        index = i;
      }
    });
    newEvents.splice(index, 1);
    setEvents(newEvents);
    console.log(events);
  };

  const calendarEvent = ({ event }) => {
    return (
      <div>
        <div style={{ float: 'right', size: 'small' }}>
          <Button
            onClick={(e) => {
              handelRemoveEvent(event);
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
  };
  return (
    <div className='calendar-screen'>
      <Calendar
        views={['work_week']}
        defaultView={'work_week'}
        min={new Date(0, 0, 0, 8, 30, 0)}
        max={new Date(0, 0, 0, 20, 0, 0)}
        localizer={localizer}
        events={events}
        selectable={true}
        startAccessor='start'
        popup={true}
        endAccessor='end'
        messages={messages}
        eventPropGetter={eventGetter}
        onSelectSlot={handleSlotSelection}
        components={{
          event: calendarEvent
        }}
      />
      <Box align='start'>
        {show && (
          <Layer
            onEsc={() => setShow(false)}
            onClickOutside={() => setShow(false)}>
            <Card background='light-1'>
              <CardHeader
                pad={{ horizontal: 'medium' }}
                margin={{ top: '1rem' }}>
                <Grid
                  rows={['xxsmall', 'xxsmall']}
                  columns={['10rem', '10rem']}
                  gap='small'
                  areas={[
                    { name: 'header', start: [0, 0], end: [1, 0] },
                    { name: 'nav', start: [0, 1], end: [1, 1] }
                  ]}>
                  <Box gridArea='header' background='light-2'>
                    <TextInput
                      value={nombre}
                      placeholder='Aca iría el nombre de quién reserva'
                      onChange={(e) => {
                        setNombre(e.target.value);
                      }}></TextInput>
                  </Box>
                  <Box gridArea='nav' background='light-2'>
                    <TextArea
                      resize={false}
                      placeholder='Requerimiento o descripción'
                      value={req}
                      onChange={(e) => {
                        setReq(e.target.value);
                      }}></TextArea>
                  </Box>
                </Grid>
              </CardHeader>

              <CardBody
                pad='medium'
                margin={{ top: 'xxsmall', bottom: '-1rem' }}>
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
                    <DateInput
                      format='dd/mm/yyyy'
                      value={today}
                      onChange={() => {
                        handleTodayDate();
                      }}
                      inline={false}
                    />
                  </Box>
                  <Box gridArea='main' background='light-2'>
                    <Text>Hasta</Text>
                    <DateInput
                      format='dd/mm/yyyy'
                      value={moment().add(1, 'week').toDate().toISOString()}
                      onChange={({ value }) => {}}
                      inline={false}
                    />
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
                    <Button
                      label='Confirmar reserva'
                      onClick={(e) => {
                        handleReservar();
                      }}
                    />
                  </Box>
                </Grid>
              </CardBody>
            </Card>
          </Layer>
        )}
      </Box>
    </div>
  );
};
