import React, { useState } from 'react';

interface AvaliationPanelProps {
  clicks: number;
  save(data: any): void;
}

interface MessageConfig {
  function(): void;
  text: string;
  hide?: boolean;
}

const AvaliationPanel = (props: AvaliationPanelProps) => {
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');
  const [primaryConfig, setPrimaryConfig] = useState<MessageConfig>({
    function: () => {},
    text: '',
    hide: true,
  });
  const [secondaryConfig, setSecondaryConfig] = useState<MessageConfig>({
    function: () => {},
    text: '',
    hide: true,
  });

  const [evals, setEvals] = useState<{ [key: string]: string }>({
    coreografia: '',
    diversidade: '',
    controle: '',
    execucao: '',
    clicks: props.clicks.toString(),
  });

  const save = () => {
    let message = '';
    let empty = [];

    //testing clicks
    (Object.keys(evals) as Array<keyof typeof evals>).forEach((field) => {
      const aux = evals[field];
      const auxParsed = parseInt(aux);
      if (aux === '') {
        empty.push(field);
        message = `${message} | ${field} está vazio`;
      } else if (isNaN(auxParsed)) {
        message = `${message} | ${field} numero invalido`;
      } else if (+aux < 0 || +aux > 10) {
        message = `${message} | ${field} numero deve ser entre 0 e 10`;
      }
    });

    //todo change
    const { clicks, coreografia, diversidade, controle, execucao } = evals;

    //clicks must always be a number
    if (empty.length === Object.keys(evals).length - 1) {
      //todo are you sure you want to submit?
      showMessageFunction(
        'Voce não colocou nenhum critério, deseja enviar vazio?',
        {
          text: 'Sim',
          function: () => {
            props.save({
              clicks,
              coreografia,
              diversidade,
              controle,
              execucao,
            });
            showMessageFunction('Salvando...');
          },
        },
        {
          text: 'Não',
          function: () => {
            setShowMessage(false);
          },
        }
      );
    } else {
      if (message !== '') {
        showMessageFunction(`${message}`, {
          text: 'Ok',
          function: () => {
            setShowMessage(false);
          },
        });
      } else {
        props.save({
          clicks,
          coreografia,
          diversidade,
          controle,
          execucao,
        });
        showMessageFunction('Salvando...');
      }
    }
  };

  const showMessageFunction = (
    message: string,
    primaryConfig?: MessageConfig,
    secondaryConfig?: MessageConfig
  ) => {
    setShowMessage(true);
    setMessage(message);
    if (primaryConfig) {
      setPrimaryConfig({ ...primaryConfig, hide: false });
    }
    if (secondaryConfig) {
      setSecondaryConfig({ ...secondaryConfig, hide: false });
    }
  };

  return showMessage ? (
    <div className="message">
      <div className="messageText">{message}</div>
      {primaryConfig.hide ? null : (
        <div onClick={primaryConfig.function}>{primaryConfig.text}</div>
      )}
      {secondaryConfig.hide ? null : (
        <div onClick={secondaryConfig.function}>{secondaryConfig.text}</div>
      )}
    </div>
  ) : (
    <div className="avaliation">
      <div>
        Clicks
        <input
          type="text"
          /*onChange={(e) => this.setState({ clicks: e.target.value })}*/
          value={evals.clicks}
          disabled
        />
      </div>
      {
        //todo change to acomodate dynamically changing things
      }
      <div>
        Musicalidade/Performance
        <input
          type="text"
          onChange={(e) => setEvals({ ...evals, coreografia: e.target.value })}
          value={evals.coreografia}
        />
      </div>
      <div>
        Originalidade
        <input
          type="text"
          onChange={(e) => setEvals({ ...evals, diversidade: e.target.value })}
          value={evals.diversidade}
        />
      </div>
      <div>
        Controle
        <input
          type="text"
          onChange={(e) => setEvals({ ...evals, controle: e.target.value })}
          value={evals.controle}
        />
      </div>
      <div>
        Carisma/Presença
        <input
          type="text"
          onChange={(e) => setEvals({ ...evals, execucao: e.target.value })}
          value={evals.execucao}
        />
      </div>
      <div className="save" onClick={save}>
        Save
      </div>
    </div>
  );
};

export default AvaliationPanel;
