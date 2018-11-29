import React from "react";
import ReactDOM from "react-dom";
import DatePicker from "./DatePicker";
import Clock from "./Clock";
import { forceNumber, getTimeOfDay, getDayOfYear } from "./utils";
import NorthStarView from "./NorthStarView";
import TimeSetting from "./TimeSetting";

class BigDipperClockSim extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      days: 31,
      currentDay: 20,
      dateTime: new Date(
        // Use current year
        new Date().getFullYear(),
        // Initial state is always March 20th, at 1:12
        2,
        20,
        1,
        12
      ),
      dayOfYear: 79,
      timeOfDay: 0.05,
      daylightSavingDelta:
        //Standard Offset as July 1 - DaylightSaving Offset as January 1
        (new Date(new Date().getFullYear(), 6, 1).getTimezoneOffset() -
          new Date(new Date().getFullYear(), 0, 1).getTimezoneOffset()) /
        1440,
      solarDaySinceZero: 0,
      isShowDetails: true,
      displayTime: "01:12",
      errorMessage: ""
    };

    this.state = this.initialState;

    //Function(s) binding
    this.onDateTimeUpdate = this.onDateTimeUpdate.bind(this);
    this.validateTime = this.validateTime.bind(this);
    this.onMonthUpdate = this.onMonthUpdate.bind(this);
    this.onDateControlUpdate = this.onDateControlUpdate.bind(this);
    this.onDayUpdate = this.onDayUpdate.bind(this);
    this.setToSystemClock = this.setToSystemClock.bind(this);
    this.update = this.update.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-md navbar-light bg-light d-flex justify-content-between">
          <span className="navbar-brand mb-0 h1">Big Dipper Clock</span>

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
        <div className="row mt-2">
          <div className="col-md-auto">
            <NorthStarView
              solDaysSinceZero={this.state.solarDaySinceZero}
              isShowDetails={this.state.isShowDetails}
            />
            <div
              className="custom-control custom-checkbox"
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              <input
                type="checkbox"
                className="custom-control-input"
                name="isShowDetails"
                onChange={this.handleInputChange}
                checked={this.state.isShowDetails}
                id="isShowDetails"
              />
              <label className="custom-control-label" htmlFor="isShowDetails">
                Show Details
              </label>
            </div>
          </div>
          <div className="col-md-7">
            <h5 className="title">Time and Date Controls</h5>
            <div className="row mt-1">
              <div
                className="col-md-5 mt-4"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <Clock
                  dateTime={this.state.dateTime}
                  onDateTimeUpdate={this.onDateTimeUpdate}
                />
              </div>
              <div className="col-md-7">
                <TimeSetting
                  months={this.setMonthsDropDownElement()}
                  date={this.state.currentDay}
                  dateTime={this.state.dateTime}
                  onDayUpdate={this.onDayUpdate}
                  onMonthUpdate={this.onMonthUpdate}
                  setToSystemClock={this.setToSystemClock}
                  handleInputChange={this.handleInputChange}
                  displayTime={this.state.displayTime}
                  errorMessage={this.state.errorMessage}
                />
              </div>
            </div>
            <div
              className="col-lg-12 mt-5"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <form className="form">
                <DatePicker
                  dateTime={this.state.dateTime}
                  onDayUpdate={this.onDayUpdate}
                  onMonthUpdate={this.onMonthUpdate}
                  onDateControlUpdate={this.onDateControlUpdate}
                />
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }

  onResetClick(e) {
    e.preventDefault();
    this.setState(this.initialState);
    //Have to reinitialize new date object, otherwise it doesn't get resetted
    this.setState({
      dateTime: new Date(
        // Use current year
        new Date().getFullYear(),
        // Initial state is always March 20th, at 1:12
        2,
        20,
        1,
        12
      )
    });
    this.update(new Date(new Date().getFullYear(), 2, 20, 1, 12));
  }

  setMonthsDropDownElement() {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return months.map(function(name, index) {
      return (
        <option value={index} key={index}>
          {name}
        </option>
      );
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    if (target.type === "checkbox") {
      this.setState({
        [name]: value
      });
    } else {
      if (
        value === "" ||
        !value.match(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/)
      ) {
        this.setState({
          displayTime: value
        });
      } else {
        var hours = value.split(":")[0];
        var minutes = value.split(":")[1];
        var newTime = this.state.dateTime;
        newTime.setHours(hours);
        newTime.setMinutes(minutes);
        this.onDateTimeUpdate(newTime);
        this.update(newTime);
        this.setState({
          displayTime: hours + ":" + minutes
        });
      }
    }
  }

  onDateTimeUpdate(dateTime) {
    this.setState({
      dateTime: dateTime,
      currentDay: dateTime.getDate(),
      days: new Date(
        new Date().getFullYear(),
        dateTime.getMonth() + 1,
        0
      ).getDate(),
      dayOfYear: getDayOfYear(dateTime),
      timeOfDay: getTimeOfDay(dateTime),
      displayTime:
        this.validateTime(dateTime.getHours()) +
        ":" +
        this.validateTime(dateTime.getMinutes())
    });
    this.update(dateTime);
  }

  validateTime(minutes) {
    if (minutes < 10) {
      return "0" + minutes;
    } else {
      return minutes;
    }
  }

  /**
   * Handle the update for the <input type="number">
   */
  onDayUpdate(e) {
    const newDay = forceNumber(e.target.value);
    if (newDay == 0 || newDay > this.state.days) {
      this.setState({
        currentDay: 0,
        errorMessage: "date cannot be 0 or " + this.state.days + " in month."
      });
    } else {
      const d = new Date(this.state.dateTime);
      d.setDate(newDay);
      this.setState({
        dateTime: d,
        currentDay: d.getDate(),
        days: new Date(new Date().getFullYear(), d.getMonth() + 1, 0).getDate(),
        dayOfYear: getDayOfYear(d),
        errorMessage: ""
      });
      this.update(d);
    }
  }

  /**
   * Handle the update for the month select box.
   */
  onMonthUpdate(e) {
    const newMonth = forceNumber(e.target.value);
    const d = new Date(this.state.dateTime);
    d.setMonth(newMonth);
    this.setState({
      dateTime: d,
      days: new Date(new Date().getFullYear(), d.getMonth() + 1, 0).getDate(),
      dayOfYear: getDayOfYear(d)
    });
    this.update(d);
  }

  /**
   * Handle the update for the date picker.
   *
   * All the control-specific logic is handled in DatePicker.jsx.
   */
  onDateControlUpdate(newDate) {
    newDate.setHours(this.state.dateTime.getHours());
    newDate.setMinutes(this.state.dateTime.getMinutes());
    newDate.setSeconds(this.state.dateTime.getSeconds());
    this.setState({
      dateTime: newDate,
      currentDay: newDate.getDate(),
      days: new Date(
        new Date().getFullYear(),
        newDate.getMonth() + 1,
        0
      ).getDate(),
      dayOfYear: getDayOfYear(newDate),
      timeOfDay: getTimeOfDay(newDate)
    });
    this.update(newDate);
  }

  /*
   * Set the date and time to current time
   */
  setToSystemClock() {
    const d = new Date();
    this.setState({
      dateTime: d,
      currentDay: d.getDate(),
      days: new Date(new Date().getFullYear(), d.getMonth() + 1, 0).getDate(),
      dayOfYear: getDayOfYear(d),
      timeOfDay: getTimeOfDay(d),
      displayTime:
        this.validateTime(d.getHours()) +
        ":" +
        this.validateTime(d.getMinutes())
    });
    this.update(d);
  }

  /**
   *
   * Pass in the date object as an argument and set the solarDaysSinceZero
   */
  update(dateTime) {
    var timeOfDay = getTimeOfDay(dateTime);
    var fhour = timeOfDay * 24;
    var hour = Math.floor(fhour);
    var decimalMinutes = 60 * (fhour - hour);
    var minutes = Math.floor(decimalMinutes);
    var second = Math.floor(60 * (decimalMinutes - minutes));
    var daylightSavingOffset = new Date(
      new Date().getFullYear(),
      6,
      1
    ).getTimezoneOffset();
    var dstPlacardVisible =
      dateTime.getTimezoneOffset() == daylightSavingOffset;
    var delta = !dstPlacardVisible ? 0 : this.state.daylightSavingDelta;
    this.setState({
      solarDaySinceZero: getDayOfYear(dateTime) + timeOfDay - 78.5 + delta
    });
  }

  /*
   *Call the update function to calculate and set the initial value of solarDaysSinceZero
   */
  componentDidMount() {
    this.update(new Date(new Date().getFullYear(), 2, 20, 1, 12));
  }
}

const domContainer = document.querySelector("#sim-container");
ReactDOM.render(<BigDipperClockSim />, domContainer);
