import React, { useEffect, useState } from 'react';

import { session } from '../../utils/socket';

import Header from '../../Components/Header';
import Footer from '../../Components/Footer';
import history from '../../utils/history';

export interface RoomsProps {}

interface Room {
  _id: string;
  name: string;
  desc?: string;
  admins?: Array<String>;
  judges?: Array<String>;
  guests?: Array<String>;
  owner: String;
  evalScheme: Object;
}

const Rooms: React.FC<RoomsProps> = (props) => {
  if (!session.socket.connected) {
    history.push('/');
  }

  const [rooms, setRooms] = useState<Array<Room>>([]);

  useEffect(() => {
    session.socket.on('rooms', (data: Array<Room>) => {
      setRooms(data);
    });
    session.socket.emit('getRooms');
  }, []);

  useEffect(() => {
    console.log(rooms);
  }, [rooms]);

  return (
    <>
      <Header />
      {rooms.map((room) => {
        if (room) {
          return (
            <div>
              <button
                onClick={() => {
                  history.push(`/room/${room._id}`);
                }}
              >
                {room.name}
              </button>
            </div>
          );
        } else {
          return <div></div>;
        }
      })}
      <Footer />
    </>
  );
};

export default Rooms;
