import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { session } from '../../utils/socket';
import history from '../../utils/history';
import socketManager from './socketManager';

import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

import JudgesList, { Clickers } from './Components/JudgesList';
import AdminPanel from './Components/AdminPanel';
import Control from './Components/Control';
import AvaliationPanel from './Components/AvaliationPanel';
import Player, { VideoEvents, PlayerControl } from './Components/Player';

interface MatchParams {
  roomId: string;
}
interface RoomProps extends RouteComponentProps<MatchParams> {}

const Room: React.FC<RoomProps> = (props) => {
  if (!session.socket.connected) {
    history.push('/');
  }

  const { socket } = session;
  //const clickHistory = [];

  //todo remove later
  const evalRules = {
    total: 100,
    keys: ['ORI', 'CON', 'VAR', 'MUS'],
    values: {
      ORI: { weight: 10, type: '0-10', title: 'ORIGINALIDADE/RISCO(10)' },
      CON: { weight: 10, type: '0-10', title: 'CONTROLE(10)' },
      VAR: { weight: 10, type: '0-10', title: 'VARIAÇÃO/USO DE ESPAÇO(10)' },
      MUS: { weight: 10, type: '0-10', title: 'MUSICA/PERFORMANCE(10)' },
    },
    click: { weight: 60, type: 'click', title: 'Tecnical(click)' },
  };

  //*States
  const [clickers, setClickers] = useState<Clickers>({ list: [], objects: {} });
  const [playerControl, setPlayerControl] = useState<PlayerControl>({
    playVideo: () => {},
    cueVideoById: (videoId: string) => {},
    pauseVideo: () => {},
    playerInfo: { videoData: { video_id: '' } },
    seekTo: (time: number, allowSeekAhead: boolean) => {},
  });

  const [showAvaliation, setShowAvaliationPanel] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isBlocked, setIsBlocked] = useState(true);

  //states for score
  const [positive, setPositive] = useState(0);
  const [negative, setNegative] = useState(0);
  const [score, setScore] = useState(0);

  //*Functions
  const click = (isPositive: boolean) => {
    //exit if its blocked
    if (isBlocked) {
      return;
    }

    //todo implement click history non mvp
    // clickHistory.push({
    //   time: Math.floor(this.playerControl.getCurrentTime() * 1000),
    //   type: isPositive,
    // });
    //todo implement flash on Player
    if (isPositive) {
      flash('player', 'flashPositive');
      setPositive(positive + 1);
      setScore(positive - negative + 1);
    } else {
      flash('player', 'flashNegative');
      setNegative(negative + 1);
      setScore(positive - negative - 1);
    }
    socket.emit('clicked', {
      id: session.clientId,
      click: isPositive,
    });
  };

  const flash = (elementId: string, cssClass: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.classList.add(cssClass);
      setTimeout(() => element.classList.remove(cssClass), 100);
    }
  };

  const timerDisplay = (
    time: number,
    hide: boolean,
    callback: Function,
    message: string
  ) => {
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
        setIsBlocked(!hide);
        callback();
        clearInterval(interval);
      }
    }, 1000);
  };

  const resetVariables = () => {
    setPositive(0);
    setNegative(0);
    setScore(0);
    setShowAvaliationPanel(false);
    setIsBlocked(true);
  };

  //Video Events
  const videoEvents = {
    onReady: (event) => {
      const playerControl = event.target;
      playerControl.playVideo();
      playerControl.pauseVideo();
      //this.timeManager.restart();

      //Socket configuration and subscription
      socketManager.setPlayerControl(playerControl);
      socketManager.subscribeSocketListeners();
      session.socket.emit('getClickerList');
    },
    onStateChange: (event) => {
      switch (event.data) {
        //ENDED = 0
        case 0:
          //todo send history maybe implement
          setTimeout(() => {
            //this.timeManager.pause();
            const clientId = session.clientId;
            const videoId = event.target.getVideoData()['video_id'];
            //clickhistory from x?
            socket.emit('videoEnded', {
              videoId,
              clicker: clientId,
              //todo::clicks: clickHistory,
              clicks: [],
            });
            setShowAvaliationPanel(true);
          }, 3000);
          console.log('video ended');
          break;
        //PLAYING = 1
        case 1:
          //this.timeManager.continue();
          break;
        //PAUSED = 2
        case 2:
          //this.timeManager.pause();
          break;
        //BUFFERING = 3
        case 3:
          //this.timeManager.pause();
          break;
        //CUED = 5
        case 5:
          event.target.playVideo();
          event.target.pauseVideo();
          break;
        //defaul
        default:
          break;
      }
    },
  } as VideoEvents;

  //todo: evals poteintial bugs
  const saveEval = (data: any) => {
    socket.emit('save', {
      ...data,
      clicker: session.clientId,
      videoId: playerControl.playerInfo.videoData.video_id,
    });
  };

  //*Effects
  useEffect(() => {
    //update clickers on socket manager
    socketManager.updateClickers(clickers);
  }, [clickers]);

  useEffect(() => {
    //update clickersDispather on socket manager
    socketManager.setClickersDispatcher(setClickers);
    socketManager.setIsAdminDispatcher(setIsAdmin);
    socketManager.setFlash(flash);
    socketManager.setSession(session);
    socketManager.setTimerDisplay(timerDisplay);
    socketManager.setResetVariables(resetVariables);
  }, []);

  useEffect(() => {
    const roomId = props.match.params.roomId;
    socket.emit('joinRoom', { roomId });
  });

  return (
    <>
      {isBlocked && !isAdmin ? (
        <div id="blocker" className="blocker">
          Esperando Admin Iniciar: ?? segundos
        </div>
      ) : null}
      <Header />
      <main className="">
        <JudgesList clickers={clickers} />
        <Player
          videoEvents={videoEvents}
          videoId="3US1fbmwZ40"
          setPlayerRef={setPlayerControl}
        />
        {isAdmin ? (
          <AdminPanel socket={socket} />
        ) : showAvaliation ? (
          <AvaliationPanel save={saveEval} clicks={score} />
        ) : (
          <Control
            positive={positive}
            negative={negative}
            score={score}
            click={click}
          />
        )}
      </main>
      <Footer />
    </>
  );
};

export default Room;
