import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Toolbar,
  Typography
} from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';

/**
 * Estilos de la barra lateral.
 */
const useStyles = makeStyles((theme) => ({
  paper: {
    background: theme.palette.primary.main
  },
  drawer: {
    width: 260,
    flexShrink: 0
  },
  itemTextColor: {
    color: 'inherit'
  }
}));

/**
 * Elementos visualizados en la barra lateral.
 */
const items = [
  {
    icon: <ListIcon />,
    label: 'Administrar Salas',
    path: '/'
  },
  {
    icon: <SystemUpdateAltIcon />,
    label: 'Exportar',
    path: '/export'
  }
];

/**
 * Función principal del componente BarraLateral.js
 * @returns retorna y renderiza los elementos pertenecientes a la barra lateral.
 */
function BarraLateral() {
  const classes = useStyles();
  const history = useHistory();

  return (
    <Drawer
      className={classes.drawer}
      variant='permanent'
      classes={{ paper: classes.paper }}>
      <Toolbar />
      <List>
        {items.map((item) => (
          <ListItem
            button
            key={item.label}
            onClick={() => history.push(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText
              primary={
                <Typography variant='body1' color='inherit'>
                  {item.label}
                </Typography>
              }
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}

export default BarraLateral;
