import React from 'react';
import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import history from '../../utils/history';

export interface RoomsProps {}

const Rooms: React.FC<RoomsProps> = (props) => {
  return (
    <>
      <Header />
      //todo change hardcoded room to dynamic listing(not mvp scope)
      <button
        onClick={() => {
          history.push('/room/1');
        }}
      >
        Prelimns
      </button>
      <button
        onClick={() => {
          history.push('/room/2');
        }}
      >
        Finals
      </button>
      <Footer />
    </>
  );
};

export default Rooms;
