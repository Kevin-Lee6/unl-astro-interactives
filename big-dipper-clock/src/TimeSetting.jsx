import React from "react";
import PropTypes from "prop-types";

export default class TimeSettings extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="row mt-4">
          <div className="col-md-auto align-self-center">
            the time of the day:{" "}
          </div>
          <input
            type="time"
            className="form-control col-md-4 align-self-center text-align-center"
            step="60"
            value={this.props.displayTime}
            onChange={this.props.handleInputChange}
          />
          <div
            className="col-md-2 align-self-center"
            style={{ opacity: 0.5, fontSize: 9 }}
          >
            <em>Daylight saving time in effect</em>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-12">
            <span className="float-right">
              <button
                type="button"
                className="btn btn-primary"
                onClick={this.props.setToSystemClock}
              >
                Set to System Clock
              </button>
            </span>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-auto align-self-center">
            the day of the year:
          </div>
          <input
            type="number"
            name="currentDay"
            className="form-control col-md-2 align-self-center text-align-center"
            style={{ textAlign: "center", marginRight: 5 }}
            value={this.props.date}
            onChange={this.props.onDayUpdate}
          />
          <select
            className="form-control col-md-4 align-self-center text-align-center"
            id="monthSelector"
            onChange={this.props.onMonthUpdate}
            value={this.props.dateTime.getMonth()}
          >
            {this.props.months}
          </select>
        </div>
        <div className="float-right" style={{ color: "red" }}>
          <p> {this.props.errorMessage}</p>
        </div>
      </React.Fragment>
    );
  }
}

TimeSettings.propTypes = {
  months: PropTypes.array.isRequired,
  date: PropTypes.number.isRequired,
  dateTime: PropTypes.object.isRequired,
  onDayUpdate: PropTypes.func.isRequired,
  onMonthUpdate: PropTypes.func.isRequired,
  setToSystemClock: PropTypes.func.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  displayTime: PropTypes.string.isRequired,
  errorMessage: PropTypes.string.isRequired
};
