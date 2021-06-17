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
  const { logout } = useAuth();
  let history = useHistory();
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position='static'>
      <Toolbar>
        <IconButton color='inherit' onClick={() => history.push('/')}>
          <HomeIcon />
        </IconButton>
        <div style={{ flexGrow: 1 }} />
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
