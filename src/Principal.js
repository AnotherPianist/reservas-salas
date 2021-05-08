/* eslint-disable react/jsx-pascal-case */
import React from 'react';
import {
  Avatar,
  Button,
  Box,
  grommet,
  Grommet,
  Nav,
  Sidebar,
  Main,
  Heading,
  Paragraph,
  Card,
  Header
} from 'grommet';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { grommet as light, dark } from 'grommet/themes';
import { Menu } from 'grommet-icons';
import {
  Analytics,
  Chat,
  Clock,
  Configure,
  Help,
  Projects,
  StatusInfoSmall
} from 'grommet-icons';
import Edicion_de_salas from './Creacion/Edicion_de_salas';
import AdministrarSalas from './admin/AdministrarSalas';
import Landing from './landing/Landing';
import { Calendario } from './calendario/Calendario.js';

function Principal() {
  return (
    <Router>
      <Grommet theme={light} full>
        <Box direction='row' fill responsive>
          <Sidebar
            background='#02475e'
            round='large'
            align='15px'
            justify='stretch'
            round='none'
            //direction={'row-responsive'}
            responsive
            header={<h2>Reserva de Salas</h2>}>
            <Nav gap='none'>
              <Button pad='small' background='#687980' round='none'>
                Administrar Salas
              </Button>
              <Button pad='small' background='#687980' round='none'>
                Exportar
              </Button>
            </Nav>
          </Sidebar>
          <Box direction='column' width='100%'>
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
            <Box>
              <Switch>
                <Route path='/admin'>
                  <AdministrarSalas />
                </Route>
                <Route path='/Sala'>
                  <Edicion_de_salas />
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

export default Principal;
