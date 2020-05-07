import React from 'react';

class AvaliationPanel extends React.Component {
  state = {
    showMessage: false,
    message: '',
    primaryConfig: {},
    secondaryConfig: { hide: true },
    clicks: this.props.clicks,
    coreografia: '',
    diversidade: '',
    controle: '',
    execucao: '',
  };

  save = () => {
    const fields = [
      'clicks',
      'coreografia',
      'diversidade',
      'controle',
      'execucao',
    ];

    let message = '';
    let empty = [];

    //testing clicks
    fields.forEach((field) => {
      console.log(this);
      const aux = this.state[field];
      const auxParsed = parseInt(aux);
      if (field === 'clicks') {
        if (isNaN(auxParsed)) {
          message = `${message} | Clicks deve ser um numero`;
        }
      } else {
        if (aux === '') {
          empty.push(field);
        } else if (isNaN(auxParsed)) {
          message = `${message} | ${field} numero invalido`;
        } else if (aux < 0 || aux > 10) {
          message = `${message} | ${field} numero deve ser entre 0 e 10`;
        }
      }
    });
    //clicks must always be a number
    if (empty.length === fields.length - 1) {
      //todo are you sure you want to submit?
      this.showMessage(
        'Voce não colocou nenhum critério, deseja enviar vazio?',
        {
          text: 'Sim',
          function: () => {
            const {
              clicks,
              coreografia,
              diversidade,
              controle,
              execucao,
            } = this.state;
            this.props.save({
              clicks,
              coreografia,
              diversidade,
              controle,
              execucao,
            });
            this.showMessage('Salvando...');
          },
        },
        {
          text: 'Não',
          function: () => {
            this.setState({ showMessage: false });
          },
        }
      );
    } else {
      if (message !== '') {
        this.showMessage(
          `Voce pode deixar os camps vazios caso nao queira julgar ${message}`,
          {
            text: 'Ok',
            function: () => {
              this.setState({ showMessage: false });
            },
          }
        );
      } else {
        const {
          clicks,
          coreografia,
          diversidade,
          controle,
          execucao,
        } = this.state;
        this.props.save({
          clicks,
          coreografia,
          diversidade,
          controle,
          execucao,
        });
        this.showMessage('Salvando...');
      }
    }
  };

  showMessage = (
    message,
    primaryConfig = { hide: true },
    secondaryConfig = { hide: true }
  ) => {
    this.setState({
      message,
      primaryConfig,
      secondaryConfig,
      showMessage: true,
    });
  };

  render() {
    return this.state.showMessage ? (
      <div className="message">
        <div className="messageText">{this.state.message}</div>
        {this.state.primaryConfig.hide ? null : (
          <div onClick={this.state.primaryConfig.function}>
            {this.state.primaryConfig.text}
          </div>
        )}
        {this.state.secondaryConfig.hide ? null : (
          <div onClick={this.state.secondaryConfig.function}>
            {this.state.secondaryConfig.text}
          </div>
        )}
      </div>
    ) : (
      <div className="avaliation">
        <div>
          Clicks(60%)
          <input
            type="text"
            onChange={(e) => this.setState({ clicks: e.target.value })}
            value={this.state.clicks}
            disabled="disabled"
          />
        </div>
        {/* todo make up and down arrow */}
        <div>
          Coreografia(10%)
          <input
            type="text"
            onChange={(e) => this.setState({ coreografia: e.target.value })}
            value={this.state.coreografia}
          />
        </div>
        <div>
          Diversidade(10%)
          <input
            type="text"
            onChange={(e) => this.setState({ diversidade: e.target.value })}
            value={this.state.diversidade}
          />
        </div>
        <div>
          Controle(10%)
          <input
            type="text"
            onChange={(e) => this.setState({ controle: e.target.value })}
            value={this.state.controle}
          />
        </div>
        <div>
          Execução(10%)
          <input
            type="text"
            onChange={(e) => this.setState({ execucao: e.target.value })}
            value={this.state.execucao}
          />
        </div>
        <div className="save" onClick={this.save}>
          Save
        </div>
      </div>
    );
  }
}

export default AvaliationPanel;
