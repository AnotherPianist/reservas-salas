/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import { Button, Box, Grommet } from 'grommet';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { grommet as light } from 'grommet/themes';
import Edicion_de_salas from '../sala/Edicion_de_salas';
import AdministrarSalas from '../sala/AdministrarSalas';
import BarraLateral from '../sidebar/BarraLateral';

function PrincipalAdmin() {
  return (
    <Router>
      <Grommet theme={light} full>
        <Box height='xxsmall' width='100%' background='#02475e'>
          <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
            <Button
              style={{ marginTop: '5px' }}
              primary
              label='Cerrar sesión'
              color={'#f4971a'}
              component={Link}
              to='/admin'
            />
          </div>
        </Box>
        <Box direction='row' fill responsive>
          <BarraLateral />

          <Box direction='column' width='100%'>
            <Box>
              <Switch>
                <Route path='/'>
                  <AdministrarSalas />
                </Route>
                <Route path='/Sala'>
                  <Edicion_de_salas />
                </Route>
                <Route path='/Calendario'>
                  <h1>calendario</h1>
                </Route>
                <Route path='/'></Route>
              </Switch>
            </Box>
          </Box>
        </Box>
      </Grommet>
    </Router>
  );
}

export default PrincipalAdmin;
