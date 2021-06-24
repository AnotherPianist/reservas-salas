import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/es';
import EventView from './EventView';
import { useHistory, useParams } from 'react-router-dom';
import { db } from '../firebase';
import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { daysInWeek } from 'date-fns/fp';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import { GetApp } from '@material-ui/icons';
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
  const [roomName, setRoomName] = useState('');
  const [showCreateEventDialog, setShowCreateEventDialog] = useState(false);
  const [showEventDialogDetails, setShowEventDialogDetails] = useState(false);
  const [showExport, setShowExport] = useState(false);
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

  useEffect(() =>
    db
      .collection('rooms')
      .doc(room)
      .get()
      .then((doc) => setRoomName(doc.data().name))
  );

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
  /**
   * Función que extrae la hora y minutos de una fecha dada.
   * @param {*} date, Fecha a la cual se le extrae la hora y minutos.
   * @returns retorna hora y minutos.
   */
  function hourMinute(date) {
    return date.toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  /**
   * Función que extrae el dia de la semana de una fecha.
   * @param {*} date, Fecha a la cual se le extrae el dia.
   * @returns retorna el nombre del día de la semana.
   */
  function getDayDate(date) {
    let day = date.getDay();
    const days = [
      'Domingo',
      'Lunes',
      'Martes',
      'Miércoles',
      'Jueves',
      'Viernes',
      'Sabado'
    ];
    return days[day];
  }
  /**
   * Función que extrae el mes de  una fecha
   * @param {*} date, Fecha a la cual se le extrae el mes
   * @returns retorna el nombre del mes de la fecha
   */
  function getNameMonth(date) {
    let month = date.getMonth();
    const months = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ];
    return months[month];
  }
  /**
   * Función que genera un .csv con las resevas dentro de un rango de fechas.
   * @param {*} startDateExport,fecha inicial del rango.
   * @param {*} endDateExport, fecha final del rango.
   */
  function exportar(startDateExport, endDateExport) {
    var Results = [['Fecha', 'Hora', 'Evento', 'Propietario']];
    events.forEach((element) => {
      let auxDate = new Date(
        element.start.getUTCFullYear(),
        element.start.getMonth(),
        element.start.getDate()
      );
      if (auxDate >= startDateExport && auxDate <= endDateExport) {
        let hour = hourMinute(element.start) + '-' + hourMinute(element.end);
        let date =
          getDayDate(element.start) +
          ' ' +
          element.start.getDate() +
          '' +
          getNameMonth(element.start);
        let detail = element.title;
        let username = element.username;
        Results.push([date, hour, detail, username]);
      }
    });

    var CsvString = '';
    Results.forEach(function (RowItem, RowIndex) {
      RowItem.forEach(function (ColItem, ColIndex) {
        CsvString += ColItem + ',';
      });
      CsvString += '\r\n';
    });
    CsvString = 'data:application/csv,' + encodeURIComponent(CsvString);
    var x = document.createElement('A');
    x.setAttribute('href', CsvString);
    x.setAttribute('download', 'export.csv');
    document.body.appendChild(x);
    x.click();
  }
  function DialogExport({ open, setOpen }) {
    const [startDateExport, SetStartDateExport] = useState();
    const [endDateExport, SetEndDateExport] = useState();

    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Rango de fechas</DialogTitle>

          <DialogContent>
            <Grid container spacing={2}>
              <Grid item>
                <DatePicker
                  fullWidth
                  disableToolbar
                  variant='inline'
                  format='dd/MM/yyyy'
                  label={'fecha inicio'}
                  value={startDateExport ? startDateExport : null}
                  onChange={(date) => {
                    let auxDate = new Date(
                      date.getUTCFullYear(),
                      date.getMonth(),
                      date.getDate()
                    );
                    SetStartDateExport(auxDate);
                  }}
                />
              </Grid>
              <Grid item>
                <DatePicker
                  fullWidth
                  disableToolbar
                  variant='inline'
                  format='dd/MM/yyyy'
                  label={'fecha fin'}
                  value={endDateExport ? endDateExport : null}
                  onChange={(date) => {
                    let auxDate = new Date(
                      date.getUTCFullYear(),
                      date.getMonth(),
                      date.getDate()
                    );
                    SetEndDateExport(auxDate);
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={!startDateExport || !endDateExport}
              onClick={() => {
                exportar(startDateExport, endDateExport);
                setOpen(false);
              }}>
              aceptar
            </Button>
          </DialogActions>
        </Dialog>
      </MuiPickersUtilsProvider>
    );
  }
  return (
    <div>
      <DialogExport open={showExport} setOpen={() => setShowExport()} />
      <Grid container justify='space-between' style={{ marginBottom: '2rem' }}>
        <Grid item>
          <Button startIcon={<GetApp />} onClick={() => setShowExport(true)}>
            exportar
          </Button>
        </Grid>
        <Grid item>
          <Typography variant='h4'>{`${roomName}`}</Typography>
        </Grid>
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
        style={{ height: '80vh' }}
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
