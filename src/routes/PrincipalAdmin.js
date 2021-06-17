import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Sala from '../sala/Sala';
import AdministrarSalas from '../sala/AdministrarSalas';
import BarraLateral from '../layout/BarraLateral';
import CalendarView from '../calendar/CalendarView';
import { Container } from '@material-ui/core';

/**
 * Función principal del componente PrincipalAdmin.js
 * @returns retorna las rutas a las que se le permite ingresar al usuario de tipo Administrador y
 * sus respectivos componentes a renderizar.
 */

function PrincipalAdmin() {
  return (
    <div style={{ display: 'flex' }}>
      {/*<BarraLateral />*/}
      <Container>
        <Switch>
          <Route exact path='/'>
            <AdministrarSalas />
          </Route>
          <Route exact path='/room'>
            <Sala />
          </Route>
          <Route path='/room/:id'>
            <Sala />
          </Route>
          <Route path='/calendar/:roomId'>
            <CalendarView />
          </Route>
        </Switch>
      </Container>
    </div>
  );
}

export default PrincipalAdmin;
