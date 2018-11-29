import React from "react";
import ReactDOM from "react-dom";
import PlanetSetting from "./PlanetSetting";
import UnitSetting from "./UnitSetting";
import Formula from "./Formula";
import { roundToTwoPlace, validate } from "./utils";

class SynodicPeriodCalculator extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      isSuperior: true,
      isYears: true,
      unit: 1,
      formulaImgSource: "./img/superior.png",
      valueOne: 1,
      valueTwo: "",
      result: "",
      isValueOneDisable: true,
      isValueTwoDisable: false,
      isResultDisable: false
    };
    this.state = this.initialState;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.handleFormulaInputChange = this.handleFormulaInputChange.bind(this);
  }
  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-md navbar-light bg-light d-flex justify-content-between">
          <span className="navbar-brand mb-0 h1">
            Synodic Period Calculator
          </span>

          <ul className="navbar-nav">
            <li className="nav-item">
              <a
                className="nav-link"
                href="#"
                data-toggle="modal"
                data-target="#questionModal"
              >
                Question
              </a>
            </li>
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
        <div className="row mt-2">
          <div className="col-lg-3" />
          <div className="col-lg-6">
            <h2 className="text-center font-weight-bold">
              Synodic Period Calculator
            </h2>
          </div>
          <div className="col-lg-3" />
        </div>
        <div className="row justify-content-center">
          <div className="col-lg-3">
            <PlanetSetting
              isSuperior={this.state.isSuperior}
              onChange={this.handleInputChange}
            />
          </div>
          <div className="col-lg-1" />
          <div className="col-lg-3">
            <UnitSetting
              isYears={this.state.isYears}
              onChange={this.handleInputChange}
            />
          </div>
        </div>
        <div className="row justify-content-center">
          <Formula formulaImgSource={this.state.formulaImgSource} />
        </div>
        <div className="row justify-content-center mt-4 vertical-align">
          <div className="col-lg-2 fraction">
            <h2 className="text-center font-weight-bold numerator">1</h2>
            <input
              className="col-lg-12 text-center form-control"
              name="result"
              disabled={this.state.isResultDisable}
              onChange={this.handleFormulaInputChange.bind(this)}
              value={this.state.result}
            />
          </div>
          <div className="col-lg-1">
            <h2 className="text-center font-weight-bold">=</h2>
          </div>
          <div className="col-lg-2 fraction">
            <h2 className="text-center font-weight-bold numerator">1</h2>
            <input
              className="col-lg-12 text-center form-control"
              name="valueOne"
              type="text"
              disabled={this.state.isValueOneDisable}
              onChange={this.handleFormulaInputChange.bind(this)}
              value={this.state.valueOne}
            />
          </div>
          <div className="col-lg-1">
            <h2 className="text-center font-weight-bold">-</h2>
          </div>
          <div className="col-lg-2 fraction">
            <h2 className="text-center font-weight-bold numerator">1</h2>
            <input
              className="col-lg-12 text-center form-control"
              name="valueTwo"
              type="text"
              disabled={this.state.isValueTwoDisable}
              onChange={this.handleFormulaInputChange.bind(this)}
              value={this.state.valueTwo}
            />
          </div>
        </div>
      </React.Fragment>
    );
  }

  onResetClick(e) {
    e.preventDefault();
    this.setState(this.initialState);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    let value = target.value;
    value = target.id === target.name + "Radio";

    this.setState({
      [name]: value
    });

    if (name == "isSuperior") {
      if (this.state.isSuperior === false) {
        this.setState({
          formulaImgSource: "./img/superior.png",
          valueOne: 1 * this.state.unit,
          valueTwo: "",
          result: "",
          isValueOneDisable: true,
          isValueTwoDisable: false,
          isResultDisable: false
        });
      } else {
        this.setState({
          formulaImgSource: "./img/inferior.png",
          valueOne: "",
          valueTwo: 1 * this.state.unit,
          result: "",
          isValueOneDisable: false,
          isValueTwoDisable: true,
          isResultDisable: false
        });
      }
    }

    if (name == "isYears") {
      if (this.state.isYears === true) {
        this.setState({
          valueOne: this.state.isValueOneDisable ? 1 * 365.25 : "",
          valueTwo: this.state.isValueTwoDisable ? 1 * 365.25 : "",
          result: "",
          unit: 365.25
        });
      } else {
        this.setState({
          valueOne: this.state.isValueOneDisable ? 1 : "",
          valueTwo: this.state.isValueTwoDisable ? 1 : "",
          result: "",
          unit: 1
        });
      }
    }
  }

  handleFormulaInputChange(event) {
    const target = event.target;
    const name = target.name;
    let value = target.value;
    var result;
    this.setState({
      [name]: value
    });
    if (value.length == 0) {
      this.setState({
        valueOne: this.state.isValueOneDisable ? 1 * this.state.unit : "",
        valueTwo: this.state.isValueTwoDisable ? 1 * this.state.unit : "",
        result: ""
      });
    }
    if (validate(value)) {
      this.setState({
        [name]: value
      });
      if (name == "result") {
        if (this.state.isSuperior) {
          result = roundToTwoPlace(1 / (1 / this.state.valueOne - 1 / value));
          this.setState({
            valueTwo: isFinite(result) && result > 0 ? result : "Ouch!"
          });
        } else if (!this.state.isSuperior) {
          result = roundToTwoPlace(1 / (1 / value + 1 / this.state.valueTwo));
          this.setState({
            valueOne: isFinite(result) && result > 0 ? result : "Ouch!"
          });
        }
      } else if (name == "valueOne") {
        result = roundToTwoPlace(1 / (1 / value - 1 / this.state.valueTwo));
        this.setState({
          result: isFinite(result) && result > 0 ? result : "Ouch!"
        });
      } else if (name == "valueTwo") {
        result = roundToTwoPlace(1 / (1 / this.state.valueOne - 1 / value));
        this.setState({
          result: isFinite(result) && result > 0 ? result : "Ouch!"
        });
      } else {
        alert("Something went wrong.");
      }
    }
  }
}

const domContainer = document.querySelector("#sim-container");
ReactDOM.render(<SynodicPeriodCalculator />, domContainer);
