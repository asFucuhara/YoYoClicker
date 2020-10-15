import React, { useState } from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';

import { socketAuthenticate } from '../../utils/socket';
import history from '../../utils/history';

export interface LoginProps {}

const Login: React.FC<LoginProps> = (props) => {
  const [code, setCode] = useState('');
  return (
    <>
      <Header />
      <div className="loginComponent">
        <div className="card">
          <div className="login">
            <p>Code:</p>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <br />
            <button
              onClick={async () => {
                try {
                  await socketAuthenticate({ email: code });
                  history.push('Room');
                } catch (e) {
                  alert(e.message);
                }
              }}
            >
              Entrar
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Login;
