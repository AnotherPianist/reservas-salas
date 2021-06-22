import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import EventView from '../calendar/EventView';
import { db } from '../firebase';
import useAuth from '../providers/Auth';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

function MisReservas() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [show, setShow] = useState(false);
  const [eventSelected, setEventSelected] = useState();
  const history = useHistory();

  useEffect(() => {
    db.collection('rooms')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((room) =>
          db
            .collection('rooms')
            .doc(room.id)
            .collection('bookings')
            .where('userId', '==', user.uid)
            .get()
            .then((querySnapshot2) => {
              const temp = [];
              querySnapshot2.forEach((booking) => {
                const data = booking.data();
                temp.push({
                  id: booking.id,
                  roomId: room.id,
                  roomName: room.data().name,
                  ...data,
                  start: data.start.toDate(),
                  end: data.end.toDate()
                });
              });
              setBookings((prev) => prev.slice().concat(temp));
            })
        );
      });
  }, []);

  return (
    <>
      <Grid container spacing={3} direction='column'>
        <Grid item container justify='space-between'>
          <Grid item>
            <Typography variant='h4'>Mis reservas</Typography>
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
        <Grid item>
          <List>
            {bookings.map((booking) => (
              <ListItem
                button
                key={booking.id}
                onClick={() => {
                  setEventSelected(booking);
                  setShow(true);
                }}>
                <ListItemText
                  primary={`${booking.title}  ·  ${booking.roomName}`}
                  secondary={`${booking.start.toLocaleDateString()} · De ${booking.start.getHours()}:${booking.start.getMinutes()} hasta ${booking.end.getHours()}:${booking.end.getMinutes()}`}
                />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>
      {show && (
        <EventView
          show={show}
          close={() => setShow(false)}
          roomId={eventSelected.roomId}
          event={eventSelected}
        />
      )}
    </>
  );
}

export default MisReservas;
