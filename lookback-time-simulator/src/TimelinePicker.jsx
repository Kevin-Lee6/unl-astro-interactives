import React from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";

export default class TimelinePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      superNovaOccurYear: 0,
      superNovaObservedYear: 0,
      isOccurLineTextDrawn: false,
      isObservedLineTextDrawn: false
    };

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onMove = this.onMove.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }
  render() {
    return (
      <React.Fragment>
        <div className="form-inline" />
        <div
          className="mt-2"
          ref={el => {
            this.calendarPicker = el;
          }}
        />
      </React.Fragment>
    );
  }
  componentDidMount() {
    const app = new PIXI.Application({
      backgroundColor: 0xffffff,
      width: 930,
      height: 100,
      sharedLoader: true,
      sharedTicker: true,
      forceCanvas: true
    });

    app.loader.add("timeline", "img/timeline.svg");

    this.app = app;

    this.calendarPicker.appendChild(app.view);
    const me = this;
    app.loader.load((loader, resources) => {
      me.resources = resources;
      me.drawCalendarScene(app, resources.timeline);
    });
    const pos = this.superNovaOccurYearToLocalPos(
      this.props.superNovaOccurYear
    );
    setTimeout(
      function() {
        this.control.position.x = pos;
        this.setState({
          superNovaOccurYear: this.props.superNovaOccurYear,
          superNovaObservedYear: this.props.superNovaObservedYear,
          superNovaCurrentYear: this.props.superNovaOccurYear
        });
      }.bind(this),
      200
    );
    me.start();
  }

  componentWillUnmount() {
    this.app.stop();
  }

  componentDidUpdate(prevProps) {
    //if it is not playing update
    if (
      prevProps.superNovaOccurYear !== this.props.superNovaOccurYear ||
      prevProps.superNovaCurrentYear !== this.props.superNovaCurrentYear
    ) {
      const pos = this.superNovaOccurYearToLocalPos(
        this.props.superNovaCurrentYear
      );
      this.setState({
        superNovaOccurYear: this.props.superNovaOccurYear,
        superNovaObservedYear: this.props.superNovaObservedYear
      });
      this.control.position.x = pos;
    }
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  animate() {
    const observedPos = this.superNovaOccurYearToLocalPos(
      this.props.superNovaObservedYear
    );
    const occurPos = this.superNovaOccurYearToLocalPos(
      this.props.superNovaOccurYear
    );
    this.setState({
      superNovaObservedYear: this.props.superNovaObservedYear
    });
    //if run animation (started, not pausing, not at the end of timeline)
    if (this.props.isStart && !this.props.isPausing && !this.props.isEnd) {
      this.arrowText.visible = false;
      //update current year using the position of arrow
      this.props.onUpdateCurrentYear(
        this.localPosToSuperNovaOccurYear(this.control.position.x, this.app)
      );
      //make arrow NOT interactive
      this.control.interactive = false;
      //draw Initial Occur Line
      if (
        this.props.superNovaOccurYear == this.props.superNovaCurrentYear &&
        !this.state.isOccurLineTextDrawn
      ) {
        this.superNovaStartline = new PIXI.Graphics()
          .lineStyle(1)
          .moveTo(occurPos, 15)
          .lineTo(occurPos, 40);
        this.occurText = new PIXI.Text("SN occurs", {
          fontFamily: "Arial",
          fontWeight: "bold",
          fontSize: 13,
          fill: 0x000000,
          align: "center"
        });
        this.occurText.anchor.set(0.5);
        this.occurText.position.y = 7;
        this.occurText.position.x = occurPos;
        this.setState({
          isOccurLineTextDrawn: true
        });
        this.app.stage.addChild(this.superNovaStartline);
        this.app.stage.addChild(this.occurText);
      }
      //move the arrow
      this.control.position.x = this.control.position.x + 0.2;
      //if the arrow is not at the end of timeline
      if (this.control.position.x < this.app.view.width - 33) {
        var year = this.localPosToSuperNovaOccurYear(
          this.control.position.x,
          this.app
        );
        if (
          Math.ceil(year) == this.props.superNovaObservedYear ||
          Math.ceil(year) + 1 == this.props.superNovaObservedYear ||
          Math.floor(year) == this.props.superNovaObservedYear ||
          Math.floor(year) - 1 == this.props.superNovaObservedYear
        ) {
          this.props.onUpdateIsObserved();
          if (!this.state.isObservedLineTextDrawn) {
            this.superNovaEndline = new PIXI.Graphics()
              .lineStyle(1)
              .moveTo(observedPos, 15)
              .lineTo(observedPos, 40);
            this.observedText = new PIXI.Text("SN observed", {
              fontFamily: "Arial",
              fontWeight: "bold",
              fontSize: 13,
              fill: 0x000000,
              align: "center"
            });
            this.observedText.anchor.set(0.5);
            this.observedText.position.y = 7;
            this.observedText.position.x = observedPos;
            this.setState({
              isObservedLineTextDrawn: true
            });
            this.app.stage.addChild(this.superNovaEndline);
            this.app.stage.addChild(this.observedText);
          }
        }
      }
      if (this.control.position.x >= this.app.view.width - 33) {
        this.props.onTimelineEnds();
      }
    } else {
      setTimeout(
        function() {
          this.control.interactive = true;
        }.bind(this),
        100
      );
      //case for reset
      if (this.props.isReset) {
        if (
          this.superNovaEndline != null &&
          this.state.isObservedLineTextDrawn
        ) {
          this.superNovaEndline.clear();
          //this.observedText.parent.removeChild(this.observedText);
          this.observedText.destroy(true);
        }
        if (
          this.superNovaStartline != null &&
          this.state.isOccurLineTextDrawn
        ) {
          this.superNovaStartline.clear();
          //this.occurText.parent.removeChild(this.occurText);
          this.occurText.destroy();
          this.arrowText.visible = true;
        }
        this.setState({
          isObservedLineTextDrawn: false,
          isOccurLineTextDrawn: false
        });
        this.control.position.x = occurPos;
        this.props.onResetUpdate();
      }
    }

    this.frameId = requestAnimationFrame(this.animate);
  }

  drawCalendarScene(app, resource) {
    const timeline = new PIXI.Sprite(resource.texture);
    timeline.width = this.app.screen.width - 30;
    timeline.anchor.set(0.5);
    timeline.position.set(this.app.screen.width / 2, 50);
    app.stage.addChild(timeline);
    let timesLeft = ["1", "", "2000", "", "4000", "", "6000", "", "8000"];
    let timesRight = ["2000", "", "4000", "", "6000", "", "8000", "", "10000"];
    var center = this.app.screen.width / 2;
    const centerLine = new PIXI.Graphics()
      .lineStyle(1)
      .moveTo(center, timeline.position.y)
      .lineTo(center, timeline.position.y + 15);
    centerLine.cacheAsBitmap = true;
    app.stage.addChild(centerLine);
    var offset = 48;
    //Draw the lines to the left from center
    timesLeft = timesLeft.map(timeLeft => {
      const line = new PIXI.Graphics()
        .lineStyle(1)
        .moveTo(center - offset, timeline.position.y)
        .lineTo(center - offset, timeline.position.y + 15);
      line.cacheAsBitmap = true;

      const text = new PIXI.Text(timeLeft == "" ? timeLeft : timeLeft + " BC", {
        fontFamily: "Arial",
        fontSize: 12,
        fill: 0x000000,
        align: "center"
      });
      text.anchor.set(0.5);
      text.position.y = timeline.position.y + 23;
      text.position.x = center - offset;
      text.cacheAsBitmap = true;

      offset += 48;

      return [text, line];
    });
    timesLeft.forEach(timeLeft => {
      timeLeft.forEach(e => {
        app.stage.addChild(e);
      });
    });
    offset = 48;
    //Draw the lines to the right from center
    timesRight = timesRight.map(timeRight => {
      const line = new PIXI.Graphics()
        .lineStyle(1)
        .moveTo(center + offset, timeline.position.y)
        .lineTo(center + offset, timeline.position.y + 15);
      line.cacheAsBitmap = true;

      const text = new PIXI.Text(
        timeRight == "" ? timeRight : timeRight + " AD",
        {
          fontFamily: "Arial",
          fontSize: 12,
          fill: 0x000000,
          align: "center"
        }
      );
      text.anchor.set(0.5);
      text.position.y = timeline.position.y + 23;
      text.position.x = center + offset;
      text.cacheAsBitmap = true;

      offset += 48;

      return [text, line];
    });
    timesRight.forEach(timeRight => {
      timeRight.forEach(e => {
        app.stage.addChild(e);
      });
    });
    //Draw the draggable control
    const control = new PIXI.Container();
    control.interactive = true;
    control.buttonMode = true;
    this.arrowText = new PIXI.Text("SN occurs", {
      fontFamily: "Arial",
      fontWeight: "bold",
      fontSize: 13,
      fill: 0x000000,
      align: "center"
    });
    this.arrowText.anchor.set(0.5);
    this.arrowText.position.y = -10;
    control.addChild(this.arrowText);
    const arrowhead = new PIXI.Graphics()
      .beginFill(0x000000)
      .drawPolygon([-7, 0, 7, 0, 0, 10]);
    control.addChild(arrowhead);
    // // const controlPos = this.dateToLocalPos(this.props.dateTime, app);
    control.position.set(app.screen.width / 2, timeline.position.y - 20);
    this.control = control;
    app.stage.addChild(control);
    // // Set up events
    control
      // events for drag start
      .on("mousedown", this.onDragStart)
      .on("touchstart", this.onDragStart)
      // events for drag end
      .on("mouseup", this.onDragEnd)
      .on("mouseupoutside", this.onDragEnd)
      .on("touchend", this.onDragEnd)
      .on("touchendoutside", this.onDragEnd)
      // events for drag move
      .on("mousemove", this.onMove)
      .on("touchmove", this.onMove);
  }
  /**
   * Given a super nova year, return the active x position of this
   */
  superNovaOccurYearToLocalPos(superNovaOccurYear) {
    const x = (superNovaOccurYear + 8000) / (18000 / 864) + 33;
    return x;
  }
  /**
   * Given an x-position on the timeline control, return the supernova year
   * that point represents.
   */
  localPosToSuperNovaOccurYear(x, app) {
    x = Math.min(Math.max(x, 33), app.view.width - 33);

    const newSuperNovaOccurYear = (18000 / 864) * (x - 33) - 8000;

    return newSuperNovaOccurYear;
  }

  onDragStart(e) {
    this.dragStartPos = e.data.getLocalPosition(this.app.stage);
    this.setState({ isDragging: true });
  }

  onDragEnd() {
    this.setState({ isDragging: false });
  }
  onMove(e) {
    if (this.state.isDragging) {
      const pos = e.data.getLocalPosition(this.app.stage);

      const newSuperNovaOccurYear = this.localPosToSuperNovaOccurYear(
        pos.x,
        this.app
      );
      this.props.onUpdateCurrentYear(newSuperNovaOccurYear);
    }
  }
}

TimelinePicker.propTypes = {
  superNovaOccurYear: PropTypes.number.isRequired,
  onSuperNovaOccurYear: PropTypes.func.isRequired,
  superNovaObservedYear: PropTypes.number.isRequired,
  superNovaCurrentYear: PropTypes.number.isRequired,
  onOccurObserveDistanceInPixelUpdate: PropTypes.func.isRequired,
  isStart: PropTypes.bool.isRequired,
  isPausing: PropTypes.bool.isRequired,
  onTimelineEnds: PropTypes.bool.isRequired,
  isReset: PropTypes.bool.isRequired,
  onResetUpdate: PropTypes.func.isRequired,
  isEnd: PropTypes.bool.isRequired,
  onUpdateCurrentYear: PropTypes.func.isRequired,
  onUpdateIsObserved: PropTypes.func.isRequired
};
