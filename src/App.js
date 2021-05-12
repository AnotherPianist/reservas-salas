import './App.css';
import { Grommet, Image } from 'grommet';
import PrincipalAdmin from './vistas/PrincipalAdmin';
import Landing from './landing/Landing.js';
import { useAuth } from './providers/Auth';

function App() {
  const { user } = useAuth();
  return (
    <Grommet full>
      {user ? (
        user.admin ? (
          <PrincipalAdmin />
        ) : (
          <Image src='https://web.archive.org/web/20170429030154if_/http://img.pandawhale.com/100953-Michael-Scott-NO-gif-Imgur-C7Xd.gif' />
        )
      ) : (
        <Landing />
      )}
    </Grommet>
  );
}

export default App;
