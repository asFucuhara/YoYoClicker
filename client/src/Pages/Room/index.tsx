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
import Player, { VideoEvents } from '../../Components/Player';
import history from '../../utils/history';

interface RoomProps {}

const Room: React.FC<RoomProps> = (props) => {
  if (!session.socket.connected) {
    history.push('/');
  }

  const { isAdmin, socket } = session;
  //const clickHistory = [];

  //*States
  const [clickers, setClicker] = useState<Clickers>({ list: [], objects: {} });
  const [player, setPlayer] = useState({
    playVideo: () => {},
    cueVideoById: (videoId: string) => {},
    pauseVideo: () => {},
    playerInfo: { videoData: { video_id: '' } },
    seekTo: (time: number, allowSeekAhead: boolean) => {},
  });

  const [showAvaliation, setShowAvaliationPanel] = useState(false);
  const [showAdminControls, setShowAdminControls] = useState(isAdmin);
  const [isBlocked, setIsBlocked] = useState(true);

  //states for score
  const [positive, setPositive] = useState(0);
  const [negative, setNegative] = useState(0);
  const [score, setScore] = useState(0);

  //*Functions
  const click = (isPositive: boolean) => {
    console.log(isPositive);

    //exit if its blocked
    if (isBlocked) {
      return;
    }

    //todo implement click history non mvp
    // clickHistory.push({
    //   time: Math.floor(this.player.getCurrentTime() * 1000),
    //   type: isPositive,
    // });
    //todo implement flash
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

  //video events
  const videoEvents = {
    onReady: (event) => {
      const player = event.target;
      player.playVideo();
      player.pauseVideo();
      //this.timeManager.restart();
      console.log('player Ready');
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

  //socket events
  const socketFunctions = {
    newClicker: (data: Judge) => {
      const newClickerList = [...clickers.list];
      const newClickersObject = { ...clickers.objects };
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
          newClickersObject[key] = data;
        }
      });

      setClicker({ list: newClickerList, objects: newClickersObject });
    },
    clicked: (data: ClickedData) => {
      //data = {id, click: true} //true positive/ false negative
      console.log(data, clickers);
      const { id, click } = data;
      const newClickers = { ...clickers };

      //todo: flash
      if (click) {
        flash(id, 'flashPositive');
        newClickers.objects[id].positive += 1;
      } else {
        flash(id, 'flashNegative');
        newClickers.objects[id].negative += 1;
      }
      setClicker(newClickers);
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
      // this.player.cueVideoById(data.videoId);
      // this.save({ clicks: this.state.score });

      //change Player Video
      player.cueVideoById(data.videoId);
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
      timerDisplay(3, true, () => player.playVideo(), '');
    },
    videoPause: () => {
      console.log('video pause');
      timerDisplay(0, false, () => player.pauseVideo(), 'Pausado pelo Admin');
      // console.log('messsage received' + data);
    },
    videoRestart: () => {
      console.log('video restart');
      player.pauseVideo();
      player.seekTo(0, false);
      //timeManager.restart();
      timerDisplay(
        0,
        false,
        () => player.pauseVideo(),
        'Reiniciado pelo Admin'
      );
      //todo zero all variables
    },
    forceFinishVideo: () => {
      //data = true
      console.log('messsage received, force restart');
    },
  };

  const saveEval = (data: any) => {
    socket.emit('save', {
      ...data,
      clicker: session.clientId,
      videoId: player.playerInfo.videoData.video_id,
    });
  };

  //*Effects
  useEffect(() => {
    //adding all receiving messages from socket
    (Object.keys(socketFunctions) as Array<
      keyof typeof socketFunctions
    >).forEach((key) => {
      session.socket.removeListener(key);
      session.socket.on(key, socketFunctions[key]);
      console.log(key);
    });
  }, [socketFunctions, player]);

  useEffect(() => {
    console.log('clickers', clickers);
  }, [clickers]);

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
          setPlayerRef={setPlayer}
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
