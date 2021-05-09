import { Sidebar, Nav, Button, ResponsiveContext } from 'grommet';
import React from 'react';
import { Menu } from 'grommet-icons';
import { Link } from 'react-router-dom';

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
