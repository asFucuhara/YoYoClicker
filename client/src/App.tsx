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
      <Route path="/room" exact render={() => <Room />} />
      {/* <Route path="/room/:id" render={() => <Room />} /> */}
      {/* <Route path="/rooms" component={<div />} /> */}
    </Router>
  );
};

export default App;
