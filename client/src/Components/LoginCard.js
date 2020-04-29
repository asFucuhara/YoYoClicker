import React from 'react';

class LoginCard extends React.Component {
  state = {
    loginEmail: '',
    loginCode: '',
    signUpEmail: '',
    singUpName: '',
  };
  render() {
    return (
      <div className="loginComponent">
        <div className="card">
          <div className="login">
            <p>Email:</p>
            <input
              type="text"
              value={this.state.loginEmail}
              onChange={(e) => this.setState({ loginEmail: e.target.value })}
            />
            <p>Código:</p>
            <input
              type="password"
              value={this.state.loginCode}
              onChange={(e) => this.setState({ loginCode: e.target.value })}
            />
            <br />
            <button
              onClick={() => {
                const { loginEmail, loginCode } = this.state;
                this.props.socketAuthenticate({
                  email: loginEmail,
                  code: loginCode,
                });
              }}
            >
              Entrar
            </button>
          </div>
          <div className="divisory" />
          <div className="signup">
            <p>Email:</p>
            <input
              type="text"
              value={this.state.signUpEmail}
              onChange={(e) => this.setState({ signUpEmail: e.target.value })}
            />
            <p>Name:</p>
            <input
              type="text"
              value={this.state.singUpName}
              onChange={(e) => this.setState({ singUpName: e.target.value })}
            />
            <br />
            <button
              onClick={() => {
                const { signUpEmail, singUpName } = this.state;
                this.props.socketAuthenticate({
                  email: signUpEmail,
                  name: singUpName,
                  isNew: true,
                });
              }}
            >
              Registrar
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginCard;
