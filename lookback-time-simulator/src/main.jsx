import React from "react";
import ReactDOM from "react-dom";
import MainView from "./MainView";
import TimelinePicker from "./TimelinePicker";
import { degToRad, forceNumber, getTimelineValue } from "./utils";

class LookbackTimeSim extends React.Component {
  constructor(props) {
    super(props);
    this.initialState = {
      distance: 30,
      lightYear: 3000,
      superNovaOccurYear: 1200,
      isStart: false,
      isPlaying: false,
      isPausing: false,
      isEnd: false,
      isReset: false,
      startBtnText: "go supernova",
      pauseBtnText: "...",
      superNovaObservedYear: 0,
      superNovaCurrentYear: 1200,
      distanceStarObserverInPixel: 0,
      distanceOccurAndObserveYearInPixel: 0,
      isObserved: false
    };
    this.state = this.initialState;
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onResetClick = this.onResetClick.bind(this);
    this.onDistanceUpdate = this.onDistanceUpdate.bind(this);
    this.onLightYearUpdate = this.onLightYearUpdate.bind(this);
    this.onSuperNovaOccurYear = this.onSuperNovaOccurYear.bind(this);
    this.onTimelineEnds = this.onTimelineEnds.bind(this);
    this.onResetUpdate = this.onResetUpdate.bind(this);
    this.onObserverDistanceInPixelUpdate = this.onObserverDistanceInPixelUpdate.bind(
      this
    );
    this.onUpdateCurrentYear = this.onUpdateCurrentYear.bind(this);
    this.onUpdateIsObserved = this.onUpdateIsObserved.bind(this);
    this.onUpdateIsObservedAndExploded = this.onUpdateIsObservedAndExploded.bind(
      this
    );
    this.onUpdateIsNotObserved = this.onUpdateIsNotObserved.bind(this);
  }
  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-expand-md navbar-light bg-light d-flex justify-content-between">
          <span className="navbar-brand mb-0 h1">Lookback Time Simulator</span>

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
          <div className="col-12">
            <MainView
              distance={this.state.distance}
              lightYear={this.state.lightYear}
              onDistanceUpdate={this.onDistanceUpdate}
              onLightYearUpdate={this.onLightYearUpdate}
              onObserverDistanceInPixelUpdate={
                this.onObserverDistanceInPixelUpdate
              }
              superNovaCurrentYear={this.state.superNovaCurrentYear}
              superNovaObservedYear={this.state.superNovaObservedYear}
              superNovaOccurYear={this.state.superNovaOccurYear}
              isStart={this.state.isStart}
              isPausing={this.state.isPausing}
              onTimelineEnds={this.onTimelineEnds}
              isReset={this.state.isReset}
              isEnd={this.state.isEnd}
              onResetUpdate={this.onResetUpdate}
              isObserved={this.state.isObserved}
              onUpdateIsObservedAndExploded={this.onUpdateIsObservedAndExploded}
              distanceStarObserverInPixel={
                this.state.distanceStarObserverInPixel
              }
              onUpdateIsNotObserved={this.onUpdateIsNotObserved}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="col-12">
            <h5 className="title">Timeline and Date Controls</h5>
            <TimelinePicker
              superNovaOccurYear={this.state.superNovaOccurYear}
              onSuperNovaOccurYear={this.onSuperNovaOccurYear}
              superNovaObservedYear={this.state.superNovaObservedYear}
              superNovaCurrentYear={this.state.superNovaCurrentYear}
              onOccurObserveDistanceInPixelUpdate={
                this.onOccurObserveDistanceInPixelUpdate
              }
              isStart={this.state.isStart}
              isPausing={this.state.isPausing}
              onTimelineEnds={this.onTimelineEnds}
              isReset={this.state.isReset}
              onResetUpdate={this.onResetUpdate}
              isEnd={this.state.isEnd}
              onUpdateCurrentYear={this.onUpdateCurrentYear}
              onUpdateIsObserved={this.onUpdateIsObserved}
            />
          </div>
        </div>
        <div className="d-flex">
          <div className="mr-auto p-2">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ marginLeft: "15px" }}
              onClick={this.onStartClick.bind(this)}
              disabled={
                this.state.isStart && !this.state.isPausing && !this.state.isEnd
              }
            >
              {this.state.startBtnText}
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              style={{ marginLeft: "30px" }}
              onClick={this.onPauseResumeClick.bind(this)}
              disabled={!this.state.isStart || this.state.isEnd}
            >
              {this.state.pauseBtnText}
            </button>
          </div>
          <div className="ml-auto p-2">
            <label htmlFor="superNovaYear" style={{ marginRight: "-100px" }}>
              supernova occurs:{" "}
            </label>
          </div>
          <div className="ml-auto" style={{ marginRight: "50px" }}>
            <input
              name="superNovaOccurYear"
              id="superNovaYear"
              type="text"
              className="form-control"
              style={{ marginLeft: "5px" }}
              value={getTimelineValue(this.state.superNovaOccurYear)}
            />
          </div>
        </div>
        <div className="row mt-2">
          <div
            className="col-9 text-right"
            style={{
              display:
                this.state.isStart &&
                this.state.superNovaCurrentYear >=
                  this.state.superNovaObservedYear
                  ? true
                  : "none"
            }}
          >
            is observed: {getTimelineValue(this.state.superNovaObservedYear)}
          </div>
        </div>
      </React.Fragment>
    );
  }
  handleInputChange(event) {
    const target = event.target;

    this.setState({
      [target.name]: forceNumber(target.value)
    });
  }
  onDistanceUpdate(distance) {
    this.setState({ distance: distance });
  }

  onLightYearUpdate(lightYear) {
    this.setState({ lightYear: lightYear });
  }

  onSuperNovaOccurYear(year) {
    year = Math.round(year);
    if (!this.state.isStart) {
      this.setState({ superNovaOccurYear: year });
    }
    this.setState({
      superNovaCurrentYear: year
    });
  }

  onResetClick() {
    this.setState(this.initialState);
    this.setState({
      isReset: true
    });
    setTimeout(
      function() {
        this.setState({
          isReset: false
        });
      }.bind(this),
      1200
    );
  }

  animate() {
    const me = this;
    this.raf = requestAnimationFrame(this.animate.bind(this));
  }

  onStartClick() {
    if (!this.state.isStart) {
      this.raf = requestAnimationFrame(this.animate.bind(this));
      this.setState({
        isStart: true,
        isPlaying: true,
        isPausing: false,
        isEnd: false,
        startBtnText: "reset",
        pauseBtnText: "pause",
        superNovaObservedYear:
          this.state.superNovaOccurYear + this.state.lightYear,
        isReset: false
      });
    } else {
      cancelAnimationFrame(this.raf);
      this.setState({
        isStart: false,
        isPlaying: false,
        isPausing: false,
        startBtnText: "go supernova",
        pauseBtnText: "...",
        isReset: true
      });
    }
  }

  onPauseResumeClick() {
    if (this.state.isPlaying) {
      cancelAnimationFrame(this.raf);
      this.setState({
        isStart: true,
        isPlaying: false,
        isPausing: true,
        pauseBtnText: "resume",
        isReset: false
      });
    } else {
      this.raf = requestAnimationFrame(this.animate.bind(this));
      this.setState({
        isStart: true,
        isPlaying: true,
        isPausing: false,
        pauseBtnText: "pause",
        isReset: false
      });
    }
  }

  onTimelineEnds() {
    cancelAnimationFrame(this.raf);
    this.setState({
      isStart: true,
      isPlaying: false,
      isPausing: false,
      pauseBtnText: "...",
      isEnd: true,
      isReset: false
    });
  }

  onResetUpdate() {
    this.setState({
      isReset: false
    });
  }

  onObserverDistanceInPixelUpdate(distance) {
    this.setState({
      distanceStarObserverInPixel: distance
    });
  }

  onUpdateCurrentYear(year) {
    year = Math.round(year);
    if (!this.state.isStart) {
      this.setState({
        superNovaOccurYear: year
      });
    }
    this.setState({
      superNovaCurrentYear: year
    });
  }

  onUpdateIsObserved() {
    this.setState({
      isObserved: true
    });
  }

  onUpdateIsNotObserved() {
    this.setState({
      isObserved: false
    });
  }

  onUpdateIsObservedAndExploded() {
    this.setState({
      isObserved: false
    });
  }
}

const domContainer = document.querySelector("#sim-container");
ReactDOM.render(<LookbackTimeSim />, domContainer);
