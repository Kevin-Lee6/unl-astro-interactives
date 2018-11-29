import React from "react";
import PropTypes from "prop-types";

export default class UnitSetting extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h5 className="text-center">Unit</h5>
        <div className="form-group offset-lg-4">
          <div className="custom-control custom-radio">
            <input
              type="radio"
              id="isYearsRadio"
              checked={this.props.isYears}
              onChange={this.props.onChange}
              name="isYears"
              className="custom-control-input"
            />
            <label className="custom-control-label" htmlFor="isYearsRadio">
              Years
            </label>
          </div>
          <div className="custom-control custom-radio">
            <input
              type="radio"
              id="isDayRadio"
              checked={!this.props.isYears}
              onChange={this.props.onChange}
              name="isYears"
              className="custom-control-input"
            />
            <label className="custom-control-label" htmlFor="isDayRadio">
              Days
            </label>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

UnitSetting.propTypes = {
  isYears: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
