import './App.css';
import PrincipalAdmin from './routes/PrincipalAdmin';
import PrincipalEstudiante from './routes/PrincipalEstudiante';
import Landing from './landing/Landing.js';
import { useAuth } from './providers/Auth';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import BarraSuperior from './layout/BarraSuperior';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

/**
 * Función principal del componente App.js
 * @returns retorna los componentes a los que podrá ingresar el usuario.
 * Obtiene el usuario actual que interactúa con la aplicación:
 * -En caso de que el usuario exista o esté definido, se renderizará la vista del Administrador
 *  o el Estudiante según sea el caso.
 * -En caso que no se haya definido el usuario (que aún no haya logueado), solo se mostrará el componente
 * Landing.
 */
function App() {
  const { user } = useAuth();
  return (
    <ThemeProvider>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <CssBaseline />
        {user ? (
          <>
            <BarraSuperior />
            {user.admin ? <PrincipalAdmin /> : <PrincipalEstudiante />}
          </>
        ) : (
          <Landing />
        )}
      </MuiPickersUtilsProvider>
    </ThemeProvider>
  );
}

export default App;
