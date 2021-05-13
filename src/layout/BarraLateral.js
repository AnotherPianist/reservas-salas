import { Sidebar, Nav, Button } from 'grommet';
import React from 'react';
import { Link } from 'react-router-dom';

const items = [
  {
    label: 'Administrar Salas',
    path: '/'
  },
  {
    label: 'Exmportar',
    path: '/export'
  }
];

function BarraLateral() {
  return (
    <Sidebar background='#02475e' width='12rem'>
      {items.map((item) => (
        <Nav key={item.label}>
          <Link style={{ color: 'inherit' }} to={item.path}>
            <Button plain={true} label={item.label} />
          </Link>
        </Nav>
      ))}
    </Sidebar>
  );
}

export default BarraLateral;
