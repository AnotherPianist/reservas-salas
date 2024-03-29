import React, { useState } from 'react';
import useAuth from '../providers/Auth';
import {
  Grid,
  Button,
  makeStyles,
  Card,
  Typography,
  TextField,
  CircularProgress,
  CardContent
} from '@material-ui/core';

/**
 * Estilos para el fondo y el login.
 */
const useStyles = makeStyles({
  root: {
    height: '100vh',
    backgroundImage: 'url(Fondo.jpg)',
    backgroundSize: 'cover'
  },
  loginBackground: {
    backgroundColor: '#F2F2F2D0',
    borderRadius: '1rem',
    paddingTop: '3rem',
    paddingBottom: '3rem',
    paddingLeft: '1rem',
    paddingRight: '1rem'
  },
  logo: {
    maxWidth: '22.5rem'
  }
});

/**
 * Función principal de Landing.js
 * @returns retorna y renderiza los elementos visualizados en la sección del login de la página.
 */
function Landing() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { login } = useAuth();
  const classes = useStyles();

  /**
   * Función que se ejecuta al loguear en la página.
   * @param {*} e, no utilizado, sin embargo es el evento de presionar la tecla "Enter" o presionar el botón "Ingresar"
   * Se encarga de mostrar la animación de cargando por la pantalla y de validar tanto el correo
   * y la contraseña ingresados en el login, en caso de ser correctos se redirige al usuario a su sección
   * correspondiente, en caso contrario se muestra un error al intentar loguear.
   */
  function handleOnSubmit(e) {
    setLoading(true);
    setError(false);
    login(email, password)
      .then(() => setLoading(false))
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
  }

  return (
    <Grid
      container
      direction='row'
      justify='space-evenly'
      alignItems='center'
      className={classes.root}>
      <Grid item>
        <Card className={classes.loginBackground}>
          <CardContent>
            <Grid container direction='column' spacing={3}>
              <Grid item>
                <Typography align='center' variant='h4'>
                  Reserva de Salas
                </Typography>
                <Typography align='center' variant='h5'>
                  Organiza tu tiempo
                </Typography>
              </Grid>
              {loading ? (
                <Grid container='row' justify='center'>
                  <Grid item>
                    <CircularProgress />
                  </Grid>
                </Grid>
              ) : (
                <Grid item>
                  <form onSubmit={handleOnSubmit}>
                    <Grid
                      container
                      direction='column'
                      spacing={2}
                      alignItems='center'>
                      <Grid item>
                        <Typography variant='h5' style={{ color: '#002e5e' }}>
                          Iniciar sesión
                        </Typography>
                      </Grid>
                      {error && (
                        <Grid item>
                          <Typography color='error'>
                            Error iniciando sesión. <br />
                            Por favor revise sus credenciales.
                          </Typography>
                        </Grid>
                      )}
                      <Grid item>
                        <TextField
                          id='text-input-email'
                          label='Email'
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          type='email'
                          variant='outlined'
                        />
                      </Grid>
                      <Grid item>
                        <TextField
                          id='text-input-password'
                          label='Contraseña'
                          onChange={(e) => setPassword(e.target.value)}
                          required
                          type='password'
                          variant='outlined'
                        />
                      </Grid>
                      <Grid item>
                        <Button
                          color='primary'
                          type='submit'
                          variant='contained'>
                          Ingresar
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Grid>
              )}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item></Grid>
    </Grid>
  );
}

export default Landing;
