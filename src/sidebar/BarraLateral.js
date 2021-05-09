import {
  Sidebar,
  Nav,
  Button,
  ResponsiveContext,
  Text,
  Header,
  Box
} from 'grommet';
import React, { Component } from 'react';
import {
  List,
  Group,
  Task,
  Upload,
  DocumentText,
  Archive,
  Menu
} from 'grommet-icons';
import { Route, Switch, Link, useHistory } from 'react-router-dom';

const items = [
  {
    label: 'Administrar Salas',

    path: '/admin'
  },
  {
    label: 'Importar',

    path: '/import'
  }
];
function BarraLateral(props) {
  let history = useHistory();
  const size = React.useContext(ResponsiveContext);
  return (
    <>
      <Sidebar
        elevation='large'
        background='#02475e'
        round='none'
        align='15px'
        justify='start'
        width='12rem'>
        {size === 'small' && (
          <Button>
            <Menu />
          </Button>
        )}
        {items.map((item) => (
          <>
            <Nav gap='none'>
              <Link
                style={{
                  color: 'inherit',
                  textDecoration: 'none',
                  margin: '10px 0 0 10px'
                }}
                to={item.path}>
                <Button plain={true} label={item.label}></Button>
              </Link>
            </Nav>
          </>
        ))}
      </Sidebar>
    </>
  );
}
export default BarraLateral;
