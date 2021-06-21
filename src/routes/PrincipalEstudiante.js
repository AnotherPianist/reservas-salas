import React from 'react';
import { Container } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import CalendarView from '../calendar/CalendarView';
import ListaSalasUsuario from '../usersView/ListaSalasUsuario';
import MisReservas from '../usersView/MisReservas';

/**
 * Función principal del componente PrincipalEstudiante.js
 * @returns retorna las rutas a las que se le permite ingresar al usuario de tipo Estudiante y
 * sus respectivos componentes a renderizar.
 */

function PrincipalEstudiante() {
  return (
    <Switch>
      <Route exact path='/'>
        <Container style={{ marginTop: '2rem' }}>
          <ListaSalasUsuario />
        </Container>
      </Route>
      <Route path='/calendar/:roomId'>
        <Container maxWidth='xl' style={{ marginTop: '2rem' }}>
          <CalendarView />
        </Container>
      </Route>
      <Route path='/my-reservations'>
        <Container style={{ marginTop: '2rem' }}>
          <MisReservas />
        </Container>
      </Route>
    </Switch>
  );
}

export default PrincipalEstudiante;
