import React from "react";
// import superior from "../../img/superior.png";
//import inferior from "../img/inferior.png";
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
  //   showDeclinationCircle: PropTypes.bool.isRequired,
  //   showEcliptic: PropTypes.bool.isRequired,
  //   showMonthLabels: PropTypes.bool.isRequired,
  //   showUnderside: PropTypes.bool.isRequired,
  //   showStickfigure: PropTypes.bool.isRequired,
  //   onInputChange: PropTypes.func.isRequired
};
