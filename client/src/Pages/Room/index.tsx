import React, { useEffect, useState } from 'react';

import Header from '../../Components/Header';
import JudgesList, {
  Clickers,
  ClickersObject,
  Judge,
} from '../../Components/JudgesList';
import AdminPanel from '../../Components/AdminPanel';
import Footer from '../../Components/Footer';

import { session } from '../../utils/socket';
import Control from '../../Components/Control';
import AvaliationPanel from '../../Components/AvaliationPanel';
import Player, { VideoEvents, PlayerControl } from '../../Components/Player';
import history from '../../utils/history';
import socketManager from './socketManager';

interface RoomProps {}

interface ClickedData {
  id: string;
  click: boolean;
}
interface VideoChangeData {
  videoId: string;
}
interface SyncClickData {
  id: string;
  positive: number;
  negative: number;
}

const Room: React.FC<RoomProps> = (props) => {
  if (!session.socket.connected) {
    history.push('/');
  }

  const { isAdmin, socket } = session;
  //const clickHistory = [];

  //*States
  const [clickers, setClicker] = useState<Clickers>({ list: [], objects: {} });
  const [playerControl, setPlayerControl] = useState<PlayerControl>({
    playVideo: () => {},
    cueVideoById: (videoId: string) => {},
    pauseVideo: () => {},
    playerInfo: { videoData: { video_id: '' } },
    seekTo: (time: number, allowSeekAhead: boolean) => {},
  });

  const [showAvaliation, setShowAvaliationPanel] = useState(false);
  const [showAdminControls] = useState(isAdmin);
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

  //Video Events
  const videoEvents = {
    onReady: (event) => {
      const playerControl = event.target;
      playerControl.playVideo();
      playerControl.pauseVideo();
      //this.timeManager.restart();
      console.log('player Ready');

      //Socket configuration that must be done after player is ready
      //!change for new format/
      subscibeAllSocketEvents(playerControl);
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

  //socket events
  console.log('yooo', socketManager.socket);
  //todo make a socket subscribing controller
  //!transfer noNeedPlayer to sockets manager
  //events that dont need player
  const noNeedPlayerSocketEvents = {
    clicked: (data: ClickedData) => {
      //data = {id, click: true} //true positive/ false negative
      console.log(data, clickers);
      const { id, click } = data;
      const newClickers = { ...clickers };

      //todo: flash
      if (click) {
        flash(id, 'flashPositive');
        newClickers.objects[id].positive += 1;
        //!Erro newClickers.objects[id] is undefined
      } else {
        flash(id, 'flashNegative');
        newClickers.objects[id].negative += 1;
      }
      setClicker(newClickers);
    },
  };
  //subscribing functions to eventlistener
  (Object.keys(noNeedPlayerSocketEvents) as Array<
    keyof typeof noNeedPlayerSocketEvents
  >).forEach((key) => {
    console.log('subscribed:', key);
    session.socket.removeListener(key);
    session.socket.on(key, noNeedPlayerSocketEvents[key]);
  });

  //!transfer need player to sockets manager
  //events that need player
  const subscibeAllSocketEvents = (playerControl: PlayerControl) => {
    //have to run once after player is mouted
    //adding all receiving messages from socket

    //defining all functions
    const socketFunctions = {
      newClicker: (data: Judge) => {
        const newClickerList = [...clickers.list];
        const newClickersObject = { ...clickers.objects };
        console.log('newClicker');
        if (
          data.id !== session.clientId &&
          !newClickerList.find((id) => id === data.id)
        ) {
          newClickerList.push(data.id);
          newClickersObject[data.id] = data;
        }

        setClicker({ list: newClickerList, objects: newClickersObject });
      },
      removeClicker: (data: Judge) => {
        const newClickerList = clickers.list.filter((id) => id !== data.id);
        const newClickersObject: ClickersObject = {};
        Object.keys(clickers.objects).forEach((key) => {
          if (clickers.objects[key].id !== data.id) {
            newClickersObject[key] = clickers.objects[key];
          }
        });

        setClicker({ list: newClickerList, objects: newClickersObject });
      },
      //todo bugged: clicker cannot get a reference from here, maybe insulate dom|Socket|data manipulation
      // clicked: (data: ClickedData) => {
      //   //data = {id, click: true} //true positive/ false negative
      //   console.log(data, clickers);
      //   const { id, click } = data;
      //   const newClickers = { ...clickers };

      //   //todo: flash
      //   if (click) {
      //     flash(id, 'flashPositive');
      //     newClickers.objects[id].positive += 1;
      //     //!Erro newClickers.objects[id] is undefined
      //   } else {
      //     flash(id, 'flashNegative');
      //     newClickers.objects[id].negative += 1;
      //   }
      //   setClicker(newClickers);
      // },
      clickerList: (data: Array<Judge>) => {
        const newClickerList = [...clickers.list];
        const newClickersObject = { ...clickers.objects };
        data.forEach((judge) => {
          if (
            judge.id !== session.clientId &&
            !newClickerList.find((id) => id === judge.id)
          ) {
            newClickerList.push(judge.id);
            newClickersObject[judge.id] = judge;
          }
        });
        setClicker({ list: newClickerList, objects: newClickersObject });
      },
      saved: () => {
        setPositive(0);
        setNegative(0);
        setScore(0);
        setShowAvaliationPanel(false);
        setIsBlocked(true);

        // this.clickHistory = [];
        // this.timeManager.restart();
        console.log('saved');
      },
      // clickHistorySaved: () => {
      //   console.log('clickHistorySaved');
      // },
      syncClick: (data: SyncClickData) => {
        //data = {id, positivo, negativo};
        const { id, positive, negative } = data;
        const newClickersObject = { ...clickers.objects };
        newClickersObject[id].positive = positive;
        newClickersObject[id].negative = negative;
        setClicker({ objects: newClickersObject, list: clickers.list });
      },
      videoChange: (data: VideoChangeData) => {
        // this.videoId = data.videoId;
        // this.playerControl.cueVideoById(data.videoId);
        // this.save({ clicks: this.state.score });

        //change Player Video
        console.log(playerControl);
        playerControl.cueVideoById(data.videoId);
        //restart variables
        setIsBlocked(true);
        setPositive(0);
        setNegative(0);
        setScore(0);
        setShowAvaliationPanel(false);
        // this.clickHistory = [];
        // this.timeManager.restart();
        console.log('messsage received' + data.videoId);
      },
      videoStart: () => {
        console.log('videostart');
        timerDisplay(3, true, () => playerControl.playVideo(), '');
      },
      videoPause: () => {
        console.log('video pause');
        timerDisplay(
          0,
          false,
          () => playerControl.pauseVideo(),
          'Pausado pelo Admin'
        );
        // console.log('messsage received' + data);
      },
      videoRestart: () => {
        console.log('video restart');
        playerControl.pauseVideo();
        playerControl.seekTo(0, false);
        //timeManager.restart();
        timerDisplay(
          0,
          false,
          () => playerControl.pauseVideo(),
          'Reiniciado pelo Admin'
        );
        //todo zero all variables
      },
      forceFinishVideo: () => {
        //data = true
        console.log('messsage received, force restart');
      },
    };

    //subscribing functions to eventlistener
    (Object.keys(socketFunctions) as Array<
      keyof typeof socketFunctions
    >).forEach((key) => {
      console.log('subscribed:', key);
      session.socket.removeListener(key);
      session.socket.on(key, socketFunctions[key]);
    });
  };

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
    //todo clickerList on socket manager update
  }, []);

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
        {showAdminControls ? (
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
