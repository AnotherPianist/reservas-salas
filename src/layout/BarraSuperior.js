import React from 'react';
import { Button, Header } from 'grommet';
import { Home } from 'grommet-icons';
import { Link } from 'react-router-dom';
import useAuth from '../providers/Auth';
import { useHistory } from 'react-router-dom';

function BarraSuperior(props) {
  const { logout } = useAuth();
  let history = useHistory();
  return (
    <Header background='#02475e'>
      <Button icon={<Home />} />
      <Button
        primary
        label='Cerrar sesión'
        color={'#f4971a'}
        component={Link}
        to='/'
        onClick={(e) => {
          e.preventDefault();
          logout();
          history.push('/');
        }}
      />
    </Header>
  );
}
export default BarraSuperior;
