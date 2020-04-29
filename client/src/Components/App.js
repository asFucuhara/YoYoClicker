import React from 'react';
import socketIOClient from 'socket.io-client';

import Control from './Control';
import Judges from './Judges';
import LoginCard from './LoginCard';

import './App.css';

class App extends React.Component {
  state = {
    isAdmin: false,
    isAuth: false,
    clickers: {
      list: [],
      //ids...
    },
  };

  //change for a form of auth
  id = '';

  addClicker = (clickers) => {
    if (!Array.isArray(clickers)) {
      clickers = [clickers];
    }
    const newClickerList = [...this.state.clickers.list];
    const newClickers = { ...this.state.clickers };
    clickers.forEach((clicker) => {
      if (!newClickerList.find((id) => id === clicker.id)) {
        newClickerList.push(clicker.id);
        newClickers[clicker.id] = clicker;
      }
    });
    newClickers.list = newClickerList;
    this.setState({ clickers: newClickers });
  };

  socketFunctions = {
    newClicker: (data) => {
      this.addClicker(data);
      console.log('message received', data);
    },
    clicked: (data) => {
      //data = {id, click: true} //true positive/ false negative
      const { id, click } = data;
      const newClickerList = { ...this.state.clickers };
      if (click) {
        newClickerList[id].positive += 1;
      } else {
        newClickerList[id].negative += 1;
      }

      this.setState(newClickerList);
      console.log('messsage received' + data);
    },
    syncClick: (data) => {
      //data = {id, sync=true, positivo, negativo}; ||
      //implement if generating a lot of errors
    },
    videoChange: (data) => {
      //data = url
      console.log('messsage received' + data);
    },
    videoStart: (data) => {
      //data = true
      console.log('messsage received' + data);
    },
    forceFinishVideo: (data) => {
      //data = true
      console.log('messsage received' + data);
    },
  };

  socketAuthenticate = (params = {}) => {
    //connect socket
    this.socket = socketIOClient('/');

    this.socket.on('connect', () => {
      //authentication
      this.socket.emit('authentication', params);

      //handling authentication
      this.socket.on('unauthorized', (e) => alert(e.message));
      this.socket.on('authenticated', (data) => {
        this.id = data.id;
        //adding all receiving messages from socket
        Object.keys(this.socketFunctions).forEach((key) =>
          this.socket.on(key, this.socketFunctions[key])
        );

        //setting clickersList
        this.addClicker(data.clickerList);
        this.setState({ isAuth: true });
      });
    });
  };

  socketSignUp = () => {};

  render() {
    return (
      <div className="App">
        <div className="header">Campeonato de Yoyo Online</div>
        {this.state.isAuth ? (
          <div className="main">
            <Judges clickers={this.state.clickers} />
            <div className="video">
              {/* todo implement player */}
              <div className="videoContainer">
                <iframe
                  src="https://www.youtube.com/embed/3US1fbmwZ40?controls=0"
                  frameborder="0"
                  allow="autoplay; encrypted-media"
                  allowFullscreen="0"
                ></iframe>
              </div>
            </div>
            <Control socket={this.socket} clientId={this.id} />
          </div>
        ) : (
          <LoginCard socketAuthenticate={this.socketAuthenticate} />
        )}
        <div className="footer">
          Ideia: Heitor Peres / Design: Hideki / Dev: Shindi
        </div>
      </div>
    );
  }
}

export default App;
