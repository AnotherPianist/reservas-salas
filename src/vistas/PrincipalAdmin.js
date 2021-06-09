import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Sala from '../sala/Sala';
import AdministrarSalas from '../sala/AdministrarSalas';
import BarraLateral from '../layout/BarraLateral';
import CalendarView from '../calendar/CalendarView';
import { Container } from '@material-ui/core';

function PrincipalAdmin() {
  return (
    <div style={{ display: 'flex' }}>
      <BarraLateral />
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
        <Route exact path='/'></Route>
      </Switch>
    </div>
  );
}

export default PrincipalAdmin;
