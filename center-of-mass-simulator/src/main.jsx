import React from "react";
import ReactDOM from "react-dom";

class CenterOfMassSim extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {};
    this.state = this.initialState;
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-md navbar-light bg-light d-flex justify-content-between">
          <span className="navbar-brand mb-0 h1">Center of Mass Simulator</span>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Reset
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                data-toggle="modal"
                data-target="#helpModal"
              >
                Help
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                data-toggle="modal"
                data-target="#aboutModal"
              >
                About
              </a>
            </li>
          </ul>
        </nav>
        <div>Enter code here</div>
      </React.Fragment>
    );
  }
}

const domContainer = document.querySelector("#sim-container");
ReactDOM.render(<CenterOfMassSim />, domContainer);
