import React, { Component } from 'react';

class MouseTracker extends Component {
  state = {
    mouseX: 0,
    mouseY: 0,
  };

  componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
  }

  handleMouseMove = (e) => {
    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY,
    });
  };

  render() {
    const { mouseX, mouseY } = this.state;

    const lineHorizontalStyle = {
      bottom: '20px', // Stała odległość od dolnej krawędzi ekranu
      left: '0',
      right: '0',
      border: '1px solid #000',
    };

    const lineVerticalStyle = {
      left: '20px', // Stała odległość od lewej krawędzi ekranu
      top: '0',
      bottom: '0',
      border: '1px solid #000',
    };

    const markerHorizontalStyle = {
      bottom: '-20px', // Stała odległość od dolnej krawędzi ekranu
      left: mouseX + 'px',
    };

    const markerVerticalStyle = {
      left: '-10px', // Stała odległość od lewej krawędzi ekranu
      top: mouseY + 'px',
    };

    return (
      <div className="mouse-tracker">
        <div className="line-horizontal" style={lineHorizontalStyle}>
          <div className="marker-horizontal" style={markerHorizontalStyle} />
        </div>
        <div className="line-vertical" style={lineVerticalStyle}>
          <div className="marker-vertical" style={markerVerticalStyle} />
        </div>
      </div>
    );
  }
}

export default MouseTracker;