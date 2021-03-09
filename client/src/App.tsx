import React from 'react';
import { Route, Router } from 'react-router-dom';

import Login from './Pages/Login/index';
import Rooms from './Pages/Rooms';
import Room from './Pages/Room';

import history from './utils/history';

import './app.css';

const App = function () {
  return (
    <Router history={history}>
      <Route path="/" exact render={() => <Login />} />
      <Route path="/room/:roomId" exact component={Room} />
      {/* <Route path="/room/:id" render={() => <Room />} /> */}
      <Route path="/room" exact component={Rooms} />
    </Router>
  );
};

export default App;
