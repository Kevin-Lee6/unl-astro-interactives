import React from "react";
import PropTypes from "prop-types";

export default class PlanetSetting extends React.Component {
  render() {
    return (
      <React.Fragment>
        <h5 className="text-center">Planets</h5>
        <div className="form-group offset-lg-4">
          <div className="custom-control custom-radio">
            <input
              type="radio"
              id="isSuperiorRadio"
              checked={this.props.isSuperior}
              onChange={this.props.onChange}
              name="isSuperior"
              className="custom-control-input"
            />
            <label className="custom-control-label" htmlFor="isSuperiorRadio">
              Superior
            </label>
          </div>
          <div className="custom-control custom-radio">
            <input
              type="radio"
              id="inferiorRadio"
              checked={!this.props.isSuperior}
              onChange={this.props.onChange}
              name="isSuperior"
              className="custom-control-input"
            />
            <label className="custom-control-label" htmlFor="inferiorRadio">
              Inferior
            </label>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

PlanetSetting.propTypes = {
  isSuperior: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};
