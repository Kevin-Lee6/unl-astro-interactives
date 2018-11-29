import React from "react";
import ReactDOM from "react-dom";
import MainView from "./MainView";
//RangeStepInput and utils file are taken and modified from https://github.com/ccnmtl/astro-interactives
import RangeStepInput from "./RangeStepInput";
import { degToRad, forceNumber } from "./utils";

class CenterOfMassSim extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      isCmFixed: false,
      objectMassOne: 1,
      objectMassTwo: 1,
      separation: 10
    };
    this.state = this.initialState;
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-md navbar-light bg-light d-flex justify-content-between">
          <span className="navbar-brand mb-0 h1">Center of Mass Simulator</span>
          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                onClick={this.onResetClick.bind(this)}
              >
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
        <div className="form-group">
          <div className="row mt-2">
            <div className="col-lg-2" />
            <div className="col-lg-8 text-center">
              <MainView
                objectOneMass={this.state.objectMassOne}
                objectTwoMass={this.state.objectMassTwo}
                separation={this.state.separation}
                isCmFixed={this.state.isCmFixed}
              />
            </div>
            <div className="col-lg-2" />
          </div>
          <div className="row mt-2">
            <div className="col-lg-1" />
            <div className="col-lg-3">
              <div className="vcenter"> Object Mass 1: </div>
            </div>
            <input
              className="col-lg-3 form-control"
              type="mass"
              placeholder="Object 1 Mass"
              onChange={this.onObjectMassOneChange.bind(this)}
              value={this.state.objectMassOne}
            />
            <div className="col-lg-3">
              <RangeStepInput
                name="objectMassOne"
                className="custom-range vcenter"
                value={this.state.objectMassOne}
                onChange={this.onObjectMassOneChange.bind(this)}
                step={0.1}
                min={1.0}
                max={10}
              />
            </div>
            <div className="col-lg-2" />
          </div>
          <div className="row mt-2">
            <div className="col-lg-1" />
            <div className="col-lg-3">
              <div className="vcenter"> Object Mass 2: </div>
            </div>
            <input
              className="col-lg-3 form-control"
              type="mass"
              placeholder="Object 2 Mass"
              onChange={this.onObjectMassTwoChange.bind(this)}
              value={this.state.objectMassTwo}
            />
            <div className="col-lg-3">
              <RangeStepInput
                name="objectMassOne"
                className="custom-range vcenter"
                value={this.state.objectMassTwo}
                onChange={this.onObjectMassTwoChange.bind(this)}
                step={0.1}
                min={1.0}
                max={10}
              />
            </div>
            <div className="col-lg-2" />
          </div>
          <div className="row mt-2">
            <div className="col-lg-1" />
            <div className="col-lg-3">
              <div className="vcenter"> Separation: </div>
            </div>
            <input
              className="col-lg-3 form-control"
              type="separation"
              placeholder="Separation"
              onChange={this.onSeparationChange.bind(this)}
              value={this.state.separation}
            />
            <div className="col-lg-3">
              <RangeStepInput
                name="separation"
                className="custom-range vcenter"
                value={this.state.separation}
                onChange={this.onSeparationChange.bind(this)}
                step={0.1}
                min={1.0}
                max={20}
              />
            </div>
            <div className="col-lg-2" />
          </div>
          <div className="row mt-2">
            <div className="col-lg-8" />
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                name="isCmFixed"
                onChange={this.handleInputChange}
                checked={this.state.isCmFixed}
                id="isCmFixedToggle"
              />
              <label className="custom-control-label" htmlFor="isCmFixedToggle">
                Keep CM fixed
              </label>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  onObjectMassOneChange(e) {
    var value = forceNumber(e.target.value);
    if (value > 10) {
      alert("Mass value has to be in between 1 to 10.");
      value = 10;
    }
    if (value < 1) {
      alert("Mass value has to be in between 1 to 10.");
      value = 1;
    }
    this.setState({
      objectMassOne: value
    });
  }

  onObjectMassTwoChange(e) {
    var value = forceNumber(e.target.value);
    if (value > 10) {
      alert("Mass value has to be in between 1 to 10.");
      value = 10;
    }
    if (value < 1) {
      alert("Mass value has to be in between 1 to 10.");
      value = 1;
    }
    this.setState({
      objectMassTwo: value
    });
  }

  onSeparationChange(e) {
    var value = forceNumber(e.target.value);
    if (value > 20) {
      alert("Mass value has to be in between 1 to 10.");
      value = 20;
    }
    if (value < 1) {
      alert("Mass value has to be in between 1 to 10.");
      value = 1;
    }
    this.setState({
      separation: value
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value
    });
  }

  onResetClick(e) {
    e.preventDefault();
    this.setState(this.initialState);
  }
}

const domContainer = document.querySelector("#sim-container");
ReactDOM.render(<CenterOfMassSim />, domContainer);
