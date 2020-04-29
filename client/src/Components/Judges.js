import React from 'react';

class Judges extends React.Component {
  render() {
    return (
      <div className="clicker">
        <div className="clickerList">
          {this.props.clickers.list.map((id) => {
            const { name, negative, positive, img } = this.props.clickers[id];
            return (
              <div className="clickerUnit">
                <img src={img} />
                <div className="text">
                  <div className="name">{name}</div>
                  <div className="score">
                    <div>
                      <spam className="negative">- </spam>
                      <spam id="negativeNumber">{negative}</spam>
                    </div>
                    <div>
                      <spam className="positive">+ </spam>
                      <spam id="positiveNumber">{positive}</spam>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Judges;
