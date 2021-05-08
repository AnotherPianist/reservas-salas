import React from 'react';
import ReactDOM from 'react-dom';
import Calendario from './calendario/Calendario';
import './index.css';
import Landing from './landing/Landing.js';
import reportWebVitals from './reportWebVitals';
import firebase from 'firebase/app';
import 'firebase/analytics';
import UserProvider from './UserProvider';
import Pricipal from './Principal';

var firebaseConfig = {
  apiKey: 'AIzaSyDT3RmRH7Cgp7Y4zCIH0ythSsmR2OJYHNQ',
  authDomain: 'gestion-practicas.firebaseapp.com',
  projectId: 'gestion-practicas',
  storageBucket: 'gestion-practicas.appspot.com',
  messagingSenderId: '556815124831',
  appId: '1:556815124831:web:59b82a0edf39c2eb9eceea',
  measurementId: 'G-SYXNF6CT55'
};

firebase.initializeApp(firebaseConfig);

ReactDOM.render(
  <UserProvider>
    <React.StrictMode>
      <Pricipal />
    </React.StrictMode>
  </UserProvider>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
