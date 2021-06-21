import React from 'react';
import useAuth from '../providers/Auth';
import { useHistory } from 'react-router-dom';
import {
  AppBar,
  Button,
  IconButton,
  makeStyles,
  Toolbar
} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import { Typography } from '@material-ui/core';

/**
 * Estilos de la barra superior.
 */
const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  }
}));

/**
 * Función principal del componente BarraSuperior.js
 * @returns retorna y renderiza los elementos pertenecientes a la barra superior.
 */
function BarraSuperior() {
  const { user, logout } = useAuth();
  const history = useHistory();
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position='static'>
      <Toolbar>
        <IconButton color='inherit' onClick={() => history.push('/')}>
          <HomeIcon />
        </IconButton>
        <Typography variant='h6'>Reserva de salas</Typography>
        <div style={{ flexGrow: 1 }} />
        {!user.admin && (
          <Button
            color='inherit'
            style={{ marginRight: '2rem' }}
            onClick={() => history.push('/my-reservations')}>
            Ver mis reservas
          </Button>
        )}
        <Button
          color='inherit'
          onClick={() => {
            logout();
            history.push('/');
          }}>
          Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}
export default BarraSuperior;
