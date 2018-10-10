import React from "react";
import ReactDOM from "react-dom";
import MainView from "./MainView";
//RangeStepInput and utils file are taken and modified from https://github.com/ccnmtl/astro-interactives
import RangeStepInput from "./RangeStepInput";
import { degToRad, forceNumber } from "./utils";

class PlanetFormationTempPlot extends React.Component {
   constructor(props) {
     super(props);
     this.initialState = {
       temperature: 600
     };
     this.state = this.initialState;
     this.handleInputChange = this.handleInputChange.bind(this);
   }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-md navbar-light bg-light d-flex justify-content-between">
          <span className="navbar-brand mb-0 h1">Planet Formation Temperatures Plot</span>
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
              <div>
                <MainView></MainView>
              </div>
            </div>
            <div className="col-lg-2" />
          </div>
          <div className="row mt-2">
            <div className="col-lg-1" />
            <div className="col-lg-3">
              <div className="vcenter"><b> Temperature: </b></div>
            </div>
            <input
                className="col-lg-3 form-control"
                type="temperature"
                placeholder="Temperature"
                onChange={this.onTemperature.bind(this)}
                value={this.state.temperature}
            />
            <div className="col-lg-3">
              <RangeStepInput
                  name="temperature"
                  className="custom-range vcenter"
                  value={this.state.objectMassOne}
                  onChange={this.onTemperature.bind(this)}
                  step={0.1}
                  min={32}
                  max={1520}
              />
            </div>
            <div className="col-lg-2" />
          </div>
          <div className="row mt-2">
            <div className="col-lg-1" />
            <div className="col-lg-3">

            </div>

            <div className="col-lg-3">

            </div>
            <div className="col-lg-2" />
          </div>
          <div className="row mt-2">
            <div className="col-lg-1" />
            <div className="col-lg-3">

            </div>

            <div className="col-lg-3">

            </div>
            <div className="col-lg-2" />
          </div>
          <div className="row mt-2">
            <div className="col-lg-8" />
            <div className="custom-control custom-checkbox">

            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  onTemperature(e){
    var value = forceNumber(e.target.value);
    this.setState({
      temperature: value
    });
  }

//   onObjectMassOneChange(e) {
//     var value = forceNumber(e.target.value);
//     if (value > 10) {
//       alert("Mass value has to be in between 1 to 10.");
//       value = 10;
//     }
//     if (value < 1) {
//       alert("Mass value has to be in between 1 to 10.");
//       value = 1;
//     }
//     this.setState({
//       objectMassOne: value
//     });
//   }

//   onObjectMassTwoChange(e) {
//     var value = forceNumber(e.target.value);
//     if (value > 10) {
//       alert("Mass value has to be in between 1 to 10.");
//       value = 10;
//     }
//     if (value < 1) {
//       alert("Mass value has to be in between 1 to 10.");
//       value = 1;
//     }
//     this.setState({
//       objectMassTwo: value
//     });
//   }

//   onSeparationChange(e) {
//     var value = forceNumber(e.target.value);
//     if (value > 20) {
//       alert("Mass value has to be in between 1 to 10.");
//       value = 20;
//     }
//     if (value < 1) {
//       alert("Mass value has to be in between 1 to 10.");
//       value = 1;
//     }
//     this.setState({
//       separation: value
//     });
//   }

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

const domContainer = document.querySelector("#planet-formation-temp");
ReactDOM.render(<PlanetFormationTempPlot/>, domContainer);
