import './App.css';
import PrincipalAdmin from './vistas/PrincipalAdmin';
import Landing from './landing/Landing.js';
import { useAuth } from './providers/Auth';
import { CssBaseline, ThemeProvider } from '@material-ui/core';
import BarraSuperior from './layout/BarraSuperior';

function App() {
  const { user } = useAuth();
  return (
    <ThemeProvider>
      <CssBaseline />
      {user ? (
        <>
          <BarraSuperior />
          {user.admin ? <PrincipalAdmin /> : <h1>No disponible</h1>}
        </>
      ) : (
        <Landing />
      )}
    </ThemeProvider>
  );
}

export default App;
