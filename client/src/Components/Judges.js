import React from 'react';

class Judges extends React.Component {
  render() {
    return (
      <div className="clicker">
        <div className="clickerList">
          {this.props.clickers.list.map((id) => {
            const { name, negative, positive, img } = this.props.clickers[id];
            return (
              <div className="clickerUnit" key={id} id={id}>
                <img src={img} alt="" />
                <div className="text">
                  <div className="name">{name}</div>
                  <div className="score">
                    <div>
                      <span className="negative">- </span>
                      <span id="negativeNumber">{negative}</span>
                    </div>
                    <div>
                      <span className="positive">+ </span>
                      <span id="positiveNumber">{positive}</span>
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
