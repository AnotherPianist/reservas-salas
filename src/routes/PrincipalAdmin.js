import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Sala from '../sala/Sala';
import AdministrarSalas from '../sala/AdministrarSalas';
import CalendarView from '../calendar/CalendarView';
import { Container } from '@material-ui/core';

/**
 * Función principal del componente PrincipalAdmin.js
 * @returns retorna las rutas a las que se le permite ingresar al usuario de tipo Administrador y
 * sus respectivos componentes a renderizar.
 */

function PrincipalAdmin() {
  return (
    <Switch>
      <Route exact path='/'>
        <Container style={{ marginTop: '2rem' }}>
          <AdministrarSalas />
        </Container>
      </Route>
      <Route exact path='/room'>
        <Container style={{ marginTop: '2rem' }}>
          <Sala />
        </Container>
      </Route>
      <Route path='/room/:id'>
        <Container style={{ marginTop: '2rem' }}>
          <Sala />
        </Container>
      </Route>
      <Route path='/calendar/:roomId'>
        <Container maxWidth='xl' style={{ marginTop: '2rem' }}>
          <CalendarView />
        </Container>
      </Route>
    </Switch>
  );
}

export default PrincipalAdmin;
