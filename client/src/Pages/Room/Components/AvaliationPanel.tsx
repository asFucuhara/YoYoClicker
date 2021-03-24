import React, { useState } from 'react';

interface AvaliationPanelProps {
  clicks: number;
  save(data: any): void;
  evalRules: EvalRules;
}

interface MessageConfig {
  function(): void;
  text: string;
  hide?: boolean;
}

export interface EvalRules {
  total?: number;
  keys: Array<keyof EvalRules['values']>;
  values: {
    [key: string]: { weight?: number; type?: string; title: string };
  };
  click?: { weight?: number; type?: string; title: string };
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

    //clicks must always be a number
    if (empty.length === Object.keys(evals).length - 1) {
      //todo are you sure you want to submit?
      showMessageFunction(
        'Voce não colocou nenhum critério, deseja enviar vazio?',
        {
          text: 'Sim',
          function: () => {
            props.save({ ...evals });
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
        props.save({ ...evals });
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
      {props.evalRules.keys.map((key) => {
        const { title } = props.evalRules.values[key];
        return (
          <div>
            {title}
            <input
              type="text"
              onChange={(e) => setEvals({ ...evals, [key]: e.target.value })}
              value={evals[key]}
            />
          </div>
        );
      })}
      <div className="save" onClick={save}>
        Save
      </div>
    </div>
  );
};

export default AvaliationPanel;
