import React from 'react';
import { Box, Text } from 'grommet';
import { Switch, Route } from 'react-router-dom';
import Sala from '../sala/Sala';
import AdministrarSalas from '../sala/AdministrarSalas';
import BarraLateral from '../layout/BarraLateral';
import BarraSuperior from '../layout/BarraSuperior';

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
            <Route path='/sala'>
              <Sala />
            </Route>
            <Route path='/sala/:id'>
              <Sala />
            </Route>
            <Route path='/calendario'>
              <Text>Calendario</Text>
            </Route>
            <Route path='/'></Route>
          </Switch>
        </Box>
      </Box>
    </>
  );
}

export default PrincipalAdmin;
