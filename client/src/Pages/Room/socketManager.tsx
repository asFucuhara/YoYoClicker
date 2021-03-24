import { Clickers, ClickersObject, Judge } from './Components/JudgesList';
import { PlayerControl } from './Components/Player';
import { session } from '../../utils/socket';
import { EvalRules } from './Components/AvaliationPanel';

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

interface JoinedRoomData {
  isAdmin: boolean;
  room: {
    evalRules: EvalRules;
  };
}

interface SocketManager {
  session: typeof session;
  playerControl: PlayerControl;
  clickers: Clickers;
  evalRulesDispatcher: React.Dispatch<React.SetStateAction<EvalRules>>;
  clickersDispatcher: React.Dispatch<React.SetStateAction<Clickers>>;
  isAdminDispatcher: React.Dispatch<React.SetStateAction<boolean>>;
  flash: (elementId: string, cssClass: string) => void;
  timerDisplay: (
    time: number,
    hide: boolean,
    callback: Function,
    message: string
  ) => void;
  resetVariables: () => void;

  updateClickers: (clickers: typeof socketManager['clickers']) => void;
  setClickersDispatcher: (
    clickersDispatcher: typeof socketManager['clickersDispatcher']
  ) => void;
  setIsAdminDispatcher: (
    clickersDispatcher: typeof socketManager['isAdminDispatcher']
  ) => void;
  setEvalRulesDispatcher: (
    evalRulesDispatcher: typeof socketManager['evalRulesDispatcher']
  ) => void;
  setSession: (session: typeof socketManager['session']) => void;
  setPlayerControl: (player: typeof socketManager['playerControl']) => void;
  setFlash: (flashFunction: typeof socketManager['flash']) => void;
  setTimerDisplay: (timerDisplay: typeof socketManager['timerDisplay']) => void;
  setResetVariables: (
    resetVariables: typeof socketManager['resetVariables']
  ) => void;
  subscribeSocketListeners: () => void;
}

const socketManager = {
  session: {},
  playerControl: {},
  clickers: {},
  clickersDispatcher: {},
  isAdminDispatcher: {},
  evalRulesDispatcher: {},
  flash: {},
  timerDisplay: {},
  resetVariables: {},
  updateClickers: (clickers) => {
    socketManager.clickers = clickers;
  },
  setSession: (session) => {
    socketManager.session = session;
  },
  setPlayerControl: (playerControl) => {
    socketManager.playerControl = playerControl;
  },
  setFlash: (flashFunction) => {
    socketManager.flash = flashFunction;
  },
  setClickersDispatcher: (clickersDispatcher) => {
    socketManager.clickersDispatcher = clickersDispatcher;
  },
  setIsAdminDispatcher: (isAdminDispatcher) => {
    socketManager.isAdminDispatcher = isAdminDispatcher;
  },
  setEvalRulesDispatcher: (evalRulesDispatcher) => {
    socketManager.evalRulesDispatcher = evalRulesDispatcher;
  },
  setTimerDisplay: (timerDisplay) => {
    socketManager.timerDisplay = timerDisplay;
  },
  setResetVariables: (resetVariable) => {
    socketManager.resetVariables = resetVariable;
  },
  subscribeSocketListeners: () => {
    try {
      if (!socketManager.clickers) {
        throw new Error('clickers not defined');
      }
      if (!socketManager.flash) {
        throw new Error('flash not defined');
      }
      if (!socketManager.clickersDispatcher) {
        throw new Error('clickersDispatcher not defined');
      }

      const socketFunctions = {
        clicked: (data: ClickedData) => {
          //data = {id, click: true} //true positive/ false negative
          const { id, click } = data;
          const newClickers = { ...socketManager.clickers };

          //todo: flash
          if (click) {
            socketManager.flash(id, 'flashPositive');
            newClickers.objects[id].positive += 1;
          } else {
            socketManager.flash(id, 'flashNegative');
            newClickers.objects[id].negative += 1;
          }
          socketManager.clickersDispatcher(newClickers);
        },
        newClicker: (data: Judge) => {
          const newClickerList = [...socketManager.clickers.list];
          const newClickersObject = { ...socketManager.clickers.objects };
          console.log('newClicker');
          if (
            data.id !== socketManager.session.clientId &&
            !newClickerList.find((id) => id === data.id)
          ) {
            newClickerList.push(data.id);
            newClickersObject[data.id] = data;
          }

          socketManager.clickersDispatcher({
            list: newClickerList,
            objects: newClickersObject,
          });
        },
        removeClicker: (data: Judge) => {
          const newClickerList = socketManager.clickers.list.filter(
            (id) => id !== data.id
          );
          const newClickersObject: ClickersObject = {};
          Object.keys(socketManager.clickers.objects).forEach((key) => {
            if (socketManager.clickers.objects[key].id !== data.id) {
              newClickersObject[key] = socketManager.clickers.objects[key];
            }
          });

          socketManager.clickersDispatcher({
            list: newClickerList,
            objects: newClickersObject,
          });
        },
        clickerList: (data: Array<Judge>) => {
          const newClickerList = [...socketManager.clickers.list];
          const newClickersObject = { ...socketManager.clickers.objects };
          data.forEach((judge) => {
            if (
              judge.id !== socketManager.session.clientId &&
              !newClickerList.find((id) => id === judge.id)
            ) {
              newClickerList.push(judge.id);
              newClickersObject[judge.id] = judge;
            }
          });
          socketManager.clickersDispatcher({
            list: newClickerList,
            objects: newClickersObject,
          });
        },
        saved: () => {
          socketManager.resetVariables();

          // this.clickHistory = [];
          // this.timeManager.restart();
          console.log('saved');
        },
        //todo: implement
        // clickHistorySaved: () => {
        //   console.log('clickHistorySaved');
        // },
        syncClick: (data: SyncClickData) => {
          //data = {id, positivo, negativo};
          const { id, positive, negative } = data;
          const newClickersObject = { ...socketManager.clickers.objects };
          newClickersObject[id].positive = positive;
          newClickersObject[id].negative = negative;
          socketManager.clickersDispatcher({
            objects: newClickersObject,
            list: socketManager.clickers.list,
          });
        },
        videoChange: (data: VideoChangeData) => {
          // this.videoId = data.videoId;
          //change Player Video
          socketManager.playerControl.cueVideoById(data.videoId);
          //todo restart variables
          socketManager.resetVariables();
          // this.clickHistory = [];
          // this.timeManager.restart();
          console.log('messsage received' + data.videoId);
        },
        videoStart: () => {
          console.log('videostart');
          socketManager.timerDisplay(
            3,
            true,
            () => socketManager.playerControl.playVideo(),
            ''
          );
        },
        videoPause: () => {
          console.log('video pause');
          socketManager.timerDisplay(
            0,
            false,
            () => socketManager.playerControl.pauseVideo(),
            'Pausado pelo Admin'
          );
          // console.log('messsage received' + data);
        },
        videoRestart: () => {
          console.log('video restart');
          socketManager.playerControl.pauseVideo();
          socketManager.playerControl.seekTo(0, false);
          //timeManager.restart();
          socketManager.timerDisplay(
            0,
            false,
            () => socketManager.playerControl.pauseVideo(),
            'Reiniciado pelo Admin'
          );
          socketManager.resetVariables();
        },
        forceFinishVideo: () => {
          //data = true
          console.log('WIP messsage received, force restart');
        },
        joinedRoom: (data: JoinedRoomData) => {
          const {
            isAdmin,
            room: { evalRules },
          } = data;

          socketManager.isAdminDispatcher(isAdmin);
          socketManager.evalRulesDispatcher(evalRules);
        },
      };
      (Object.keys(socketFunctions) as Array<
        keyof typeof socketFunctions
      >).forEach((key) => {
        console.log('subscribed:', key);
        session.socket.removeListener(key);
        session.socket.on(key, socketFunctions[key]);
      });
    } catch (error) {}
  },
} as SocketManager;

export default socketManager;
