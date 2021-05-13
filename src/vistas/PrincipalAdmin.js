import React from 'react';
import { Box } from 'grommet';
import { Switch, Route } from 'react-router-dom';
import Sala from '../sala/Sala';
import AdministrarSalas from '../sala/AdministrarSalas';
import BarraLateral from '../layout/BarraLateral';
import BarraSuperior from '../layout/BarraSuperior';
import { Calendario } from '../calendario/Calendario';

function PrincipalAdmin() {
  return (
    <>
      <BarraSuperior />
      <Box direction='row' fill>
        <BarraLateral />
        <Box width='100%' pad='large'>
          <Switch>
            <Route exact path='/'>
              <AdministrarSalas />
            </Route>
            <Route exact path='/sala'>
              <Sala />
            </Route>
            <Route path='/sala/:id'>
              <Sala />
            </Route>
            <Route path='/calendario/:roomId'>
              <Calendario />
            </Route>
            <Route exact path='/'></Route>
          </Switch>
        </Box>
      </Box>
    </>
  );
}

export default PrincipalAdmin;
