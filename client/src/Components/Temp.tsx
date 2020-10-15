// @ts-nocheck
import React from 'react';
import socketIOClient from 'socket.io-client';

import Control from '../Components/Control';
import Judges from '../Components/JudgesList';
import LoginCard from '../Components/LoginCard';
import AdminPanel from '../Components/AdminPanel';
import AvaliationPanel from '../Components/AvaliationPanel';

import '../Components/App.css';

class Temp extends React.Component {
  state = {
    isAuth: false, //false
    isAdmin: false,
    isBlocked: false,
    negative: 0,
    positive: 0,
    score: 0,
    showAvaliationPanel: false, //false
    clickers: {
      list: [],
      //ids...
    },
  };

  //var used in Temp
  //application on "this" context
  //socket
  socket: any;
  //player object, has control over player and states
  //player = undefined;
  //Video id of currently playing
  videoId = '3US1fbmwZ40';
  //controls when player is ready
  youTubeAPIReady = false;
  videoContainerReady = false;
  //var for preventing second instance of YT
  YTalredyMounted = false;
  //list of clicks history to send for replaying later
  clickHistory = [];

  socketAuthenticate = (params = {}) => {
    //connect socket
    this.socket = socketIOClient('/');

    this.socket.on('connect', () => {
      //authentication
      this.socket.emit('authentication', params);

      //handling authentication
      this.socket.on('unauthorized', (e: Error) => alert(e.message));
      this.socket.on('authenticated', (data) => {
        const { isAdmin, id } = data;
        this.clientId = id;

        //adding all receiving messages from socket
        Object.keys(this.socketFunctions).forEach((key) =>
          this.socket.on(key, this.socketFunctions[key])
        );

        //setting clickersList
        this.addClicker(data.clickerList);
        this.setState({ isAuth: true, isAdmin, isBlocked: !isAdmin });
      });
    });
  };

  socketFunctions = {
    newClicker: (data) => {
      this.addClicker(data);
    },
    removeClicker: (data) => {
      const newClickers = { ...this.state.clickers };
      newClickers.list = newClickers.list.filter((id) => id !== data.id);
      newClickers[data.id] = {};
      this.setState({ clickers: newClickers });
    },
    clicked: (data) => {
      //data = {id, click: true} //true positive/ false negative
      const { id, click } = data;
      const newClickerList = { ...this.state.clickers };
      if (click) {
        this.flash(id, 'flashPositive');
        newClickerList[id].positive += 1;
      } else {
        this.flash(id, 'flashNegative');
        newClickerList[id].negative += 1;
      }

      this.setState({ clickers: newClickerList });
    },
    saved: () => {
      this.setState({
        positive: 0,
        negative: 0,
        score: 0,
        showAvaliationPanel: false,
        isBlocked: true,
      });
      this.clickHistory = [];
      this.timeManager.restart();
      console.log('saved');
    },
    clickHistorySaved: () => {
      console.log('clickHistorySaved');
    },
    syncClick: (data) => {
      //data = {id, positivo, negativo};
      const { id, positive, negative } = data;
      const newClickerList = { ...this.state.clickers };
      newClickerList[id].positive = positive;
      newClickerList[id].negative = negative;
      this.setState({ clickers: newClickerList });
    },
    videoChange: (data) => {
      //data = url
      this.videoId = data.videoId;
      this.player.cueVideoById(data.videoId);
      this.save({ clicks: this.state.score });
      //restart variables
      this.setState({
        positive: 0,
        negative: 0,
        score: 0,
        showAvaliationPanel: false,
        isBlocked: true,
      });
      this.clickHistory = [];
      this.timeManager.restart();

      console.log('messsage received' + data.url);
    },
    videoStart: (data) => {
      //data = true
      this.timerDisplay(3, true, () => this.player.playVideo());
    },
    videoPause: (data) => {
      //data = true
      this.timerDisplay(
        0,
        false,
        () => this.player.pauseVideo(),
        'Pausado pelo Admin'
      );
      console.log('messsage received' + data);
    },
    videoRestart: (data) => {
      //data = true
      this.player.pauseVideo();
      this.player.seekTo(0, false);
      this.timeManager.restart();
      this.timerDisplay(
        0,
        false,
        () => this.player.pauseVideo(),
        'Reiniciado pelo Admin'
      );
      //todo zero all variables
      console.log('messsage received' + data);
    },
    forceFinishVideo: (data) => {
      //data = true
      console.log('messsage received' + data);
    },
  };

  //timer for clicks history in millis used in case of video paused or buffering
  timer = 0;
  //lastUpdateTime fo history
  lastDate = Date.now();
  //timer is paused
  isPaused = true;

  /****Obsolete, use  */
  timeManager = {
    restart: () => {
      this.timer = 0;
      this.lastDate = Date.now();
    },
    pause: () => {
      this.isPaused = true;
      this.timer = this.timer + Date.now() - this.lastDate;
    },
    continue: () => {
      this.isPaused = false;
      this.lastDate = Date.now();
    },
    get: () => {
      if (this.isPaused) {
        return this.timer;
      }
      return this.timer + (Date.now() - this.lastDate);
    },
  };

  videoEvents = {
    onReady: () => {
      this.player.playVideo();
      this.player.pauseVideo();
      this.timeManager.restart();
      console.log('player Ready');
    },
    onStateChange: (event) => {
      switch (event.data) {
        //ENDED = 0
        case 0:
          //todo send history maybe implement
          setTimeout(() => {
            this.timeManager.pause();
            const { videoId, clientId, clickHistory } = this;
            this.socket.emit('videoEnded', {
              videoId,
              clicker: clientId,
              clicks: clickHistory,
            });
            this.setState({ showAvaliationPanel: true });
          }, 3000);
          console.log('video ended');
          break;
        //PLAYING = 1
        case 1:
          this.timeManager.continue();
          break;
        //PAUSED = 2
        case 2:
          this.timeManager.pause();
          break;
        //BUFFERING = 3
        case 3:
          this.timeManager.pause();
          break;
        //CUED = 5
        case 5:
          this.player.playVideo();
          this.player.pauseVideo();
          break;
        //defaul
        default:
          break;
      }
    },
  };

  mountPlayer() {
    if (
      !this.YTalredyMounted &&
      this.youTubeAPIReady &&
      this.videoContainerReady
    ) {
      this.YTalredyMounted = true;
      this.player = new window.YT.Player(`player`, {
        videoId: this.videoId,
        playerVars: {
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
        },
        events: this.videoEvents,
      });
    }
  }

  timerDisplay = (time, hide, callback, message) => {
    //timer
    const interval = setInterval(() => {
      if (time >= 0) {
        const element = document.getElementById('blocker');
        if (element) {
          element.innerHTML =
            message || `Video iniciando em: ${time} segundo(s)`;
        }
        time--;
      } else {
        this.setState({ isBlocked: !hide });
        callback();
        clearInterval(interval);
      }
    }, 1000);
  };

  addClicker = (clickers) => {
    if (!Array.isArray(clickers)) {
      clickers = [clickers];
    }
    const newClickerList = [...this.state.clickers.list];
    const newClickers = { ...this.state.clickers };
    clickers.forEach((clicker) => {
      if (
        clicker.id !== this.clientId &&
        !newClickerList.find((id) => id === clicker.id)
      ) {
        newClickerList.push(clicker.id);
        newClickers[clicker.id] = clicker;
      }
    });
    newClickers.list = newClickerList;
    this.setState({ clickers: newClickers });
  };

  click = (isPositive) => {
    //exit if its blocked
    if (this.state.isBlocked) {
      return;
    }

    const { positive, negative } = this.state;
    this.clickHistory.push({
      time: Math.floor(this.player.getCurrentTime() * 1000),
      type: isPositive,
    });
    if (isPositive) {
      this.flash('player', 'flashPositive');
      this.setState({
        positive: positive + 1,
        score: positive - negative + 1,
      });
    } else {
      this.flash('player', 'flashNegative');
      this.setState({
        negative: negative + 1,
        score: positive - negative - 1,
      });
    }
    this.socket.emit('clicked', {
      id: this.clientId,
      click: isPositive,
    });
  };

  save = (data) => {
    //todo (maybe?) wait for response
    this.socket.emit('save', {
      ...data,
      clicker: this.clientId,
      videoId: this.videoId,
    });
  };

  flash = (elementId, cssClass) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add(cssClass);
      setTimeout(() => element.classList.remove(cssClass), 100);
    }
  };

  componentDidUpdate() {
    const playerElement = document.getElementById('player');
    if (!this.YTalredyMounted && playerElement) {
      console.log('videoContainer ready');
      this.videoContainerReady = true;
      this.mountPlayer();
    }
  }
  componentDidMount() {
    //Chceck if yt player already createrd
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';

      window.onYouTubeIframeAPIReady = () => {
        this.youTubeAPIReady = true;
        this.mountPlayer();
      };

      //inject script on html
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }

  render() {
    return (
      <div>
        {this.state.isBlocked ? (
          <div id="blocker" className="blocker">
            Esperando Admin Iniciar: ?? segundos
          </div>
        ) : null}
        <div className="Temp">
          <div className="header">Campeonato de Yoyo Online</div>
          {this.state.isAuth ? (
            <div className="main">
              <Judges clickers={this.state.clickers} />
              <div className="video">
                <div className="videoContainer">
                  <div id="player" />
                </div>
              </div>
              {this.state.isAdmin ? (
                <AdminPanel socket={this.socket} />
              ) : this.state.showAvaliationPanel ? (
                <AvaliationPanel save={this.save} clicks={this.state.score} />
              ) : (
                <Control
                  positive={this.state.positive}
                  negative={this.state.negative}
                  score={this.state.score}
                  click={this.click}
                />
              )}
            </div>
          ) : (
            <LoginCard socketAuthenticate={this.socketAuthenticate} />
          )}
          <div className="footer">
            Ideia: Heitor Peres / Design: Hideki / Dev: Shindi
          </div>
        </div>
      </div>
    );
  }
}

export default Temp;
