import React from 'react';
import { Box } from 'grommet';
import { Switch, Route } from 'react-router-dom';
import Sala from '../sala/Sala';
import AdministrarSalas from '../sala/AdministrarSalas';
import BarraLateral from '../layout/BarraLateral';
import BarraSuperior from '../layout/BarraSuperior';
import CalendarView from '../calendar/CalendarView';

function PrincipalAdmin() {
  return (
    <Box direction='column' height='100%'>
      <Box height='7%'>
        <BarraSuperior />
      </Box>
      <Box direction='row' height='90%' fill>
        <Box width='10%'>
          <BarraLateral />
        </Box>
        <Box width='93%' height='100%' pad='large'>
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
        </Box>
      </Box>
    </Box>
  );
}

export default PrincipalAdmin;
