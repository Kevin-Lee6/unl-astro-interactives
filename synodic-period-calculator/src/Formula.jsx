import React from "react";
import PropTypes from "prop-types";

export default class Formula extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {};
    this.state = this.initialState;
  }
  render() {
    return (
      <React.Fragment>
        <div>
          <img
            src={this.props.formulaImgSource}
            className="center-block"
            name="formula"
            id="formula"
          />
        </div>
      </React.Fragment>
    );
  }
}

Formula.propTypes = {
  isSuperior: PropTypes.string.isRequired
};
