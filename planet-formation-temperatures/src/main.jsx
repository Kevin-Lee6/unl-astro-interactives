import React from "react";
import ReactDOM from "react-dom";
import MainView from "./MainView";
import MaterialState from "./MaterialState";
//import StateOfMaterial from "./StateOfMaterial";
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
            <div className="col-lg-6 text-center">
              <div>
                <MainView
                  temperature={this.state.temperature} />
              </div>
            </div>
            <div className="col-lg-2">
              <MaterialState
                temperature={this.state.temperature} />
            </div>
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
                  value={this.state.temperature}
                  onChange={this.onTemperature.bind(this)}
                  step={1.0}
                  min={35}
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
    if ( value > 1521){
      if(e.key == 'Enter'){
       console.log('alert');
      }
      //value = 1520;
    }
    if ( value < 34){
      if (e.key == 'Enter')
      console.log('alert');
      //value = 35;
    }
    this.setState({
      temperature: value
    });
  }

  handleInputChange(event) {
     const target = event.target;
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
