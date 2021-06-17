import React from 'react';
import { Container } from '@material-ui/core';
import { Route, Switch } from 'react-router-dom';
import CalendarView from '../calendar/CalendarView';
import ListaSalasUsuario from '../usersView/ListaSalasUsuario';

/**
 * Función principal del componente PrincipalEstudiante.js
 * @returns retorna las rutas a las que se le permite ingresar al usuario de tipo Estudiante y
 * sus respectivos componentes a renderizar.
 */

function PrincipalEstudiante() {
  return (
    <Container style={{ marginTop: '2rem' }}>
      <Switch>
        <Route exact path='/'>
          <ListaSalasUsuario />
        </Route>
        <Route path='/calendar/:roomId'>
          <CalendarView />
        </Route>
      </Switch>
    </Container>
  );
}

export default PrincipalEstudiante;
