import React from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import { forceNumber, hourAngleToTime, minuteAngleToTime } from "./utils";

export default class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDraggingMinute: false,
      isDraggingHour: false,
      dateTime: new Date(new Date().getFullYear(), 2, 20, 1, 12),
      count: 0
    };

    this.onMinuteDragStart = this.onMinuteDragStart.bind(this);
    this.onMinuteDragEnd = this.onMinuteDragEnd.bind(this);
    this.onMinuteMove = this.onMinuteMove.bind(this);
    this.onHourDragStart = this.onHourDragStart.bind(this);
    this.onHourDragEnd = this.onHourDragEnd.bind(this);
    this.onHourMove = this.onHourMove.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);

    this.loader = new PIXI.loaders.Loader();
    this.loader.add("clock", "img/clock.png");

    this.center = new PIXI.Point(100, 100);

    // For keeping track of clockwise/counter-clockwise motion on
    // the clock hands.
    this.minuteLastPos = { x: 0, y: 0 };
    this.hourLastPos = { x: 0, y: 0 };
    this.lastTime = null;
  }
  render() {
    return (
      <React.Fragment>
        <div
          ref={el => {
            this.timePicker = el;
          }}
        />
      </React.Fragment>
    );
  }
  componentDidMount() {
    const me = this;

    const timePickerApp = new PIXI.Application({
      backgroundColor: 0xffffff,
      width: 200,
      height: 200,
      sharedLoader: true,
      sharedTicker: true,
      forceCanvas: true
    });
    this.timePickerApp = timePickerApp;
    this.timePicker.appendChild(timePickerApp.view);

    this.loader.load((loader, resources) => {
      me.resources = resources;

      me.drawClockScene(timePickerApp, resources.clock);
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.dateTime !== this.props.dateTime) {
      // Update the clock.
      const minutes = this.props.dateTime.getMinutes();
      const seconds = this.props.dateTime.getSeconds();
      this.minuteHand.rotation =
        (minutes / 60) * (Math.PI * 2) -
        Math.PI +
        (seconds / 60 / 60) * (Math.PI * 2);

      const hours = this.props.dateTime.getHours();
      this.hourHand.rotation =
        ((hours + minutes / 60) / 24) * (Math.PI * 2) - Math.PI;
    }
  }

  componentWillReceiveProps(nextProps) {
    //This is the way I could find to update the clock when the time input changes
    //Taken from https://stackoverflow.com/questions/26556436/react-after-render-code
    //Otherwise the clock is not updating when props in the parent component change
    setTimeout(() => {
      const minutes = this.props.dateTime.getMinutes();
      const seconds = this.props.dateTime.getSeconds();
      this.minuteHand.rotation =
        (minutes / 60) * (Math.PI * 2) -
        Math.PI +
        (seconds / 60 / 60) * (Math.PI * 2);

      const hours = this.props.dateTime.getHours();
      this.hourHand.rotation =
        ((hours + minutes / 60) / 24) * (Math.PI * 2) - Math.PI;
    }, 0);
  }

  componentWillUnmount() {
    this.timePickerApp.stop();
  }
  /**
   * Draw a centered sprite on the given pixi application.
   */
  drawBackground(app, resource) {
    const sprite = new PIXI.Sprite(resource.texture);
    sprite.position.x = (app.view.width - sprite.width) / 2;
    sprite.position.y = (app.view.height - sprite.height) / 2;
    // cacheAsBitmap is for sprites that don't move.
    sprite.cacheAsBitmap = true;
    app.stage.addChild(sprite);
    return sprite;
  }
  drawClockScene(app, resource) {
    const bg = this.drawBackground(app, resource);
    // Scale down the clock to fit the container.
    bg.width = app.view.width;
    bg.height = app.view.height;
    bg.position.x = 0;
    bg.position.y = 0;

    const center = new PIXI.Point(app.view.width / 2, app.view.height / 2);

    // Draw a thin border around the clock
    const border = new PIXI.Graphics()
      .lineStyle(1, 0x000000)
      .drawCircle(center.x, center.y, 96.5);
    app.stage.addChild(border);

    // Draw the hour hand
    //
    // Unlike Sprites, Graphics objects have no anchor attribute,
    // so must be centered and rotated with "pivot". I've only
    // gotten this to pivot around the center point by putting
    // the object in a Container.
    // I'm not completely sure if this is necessary but it works.
    //
    // * http://www.html5gamedevs.com/topic/37296-scaling-rectangle-from-center-and-transform-origin/
    // * https://github.com/pixijs/pixi.js/issues/3269#issuecomment-413224102
    //
    const hourContainer = new PIXI.Container();
    hourContainer.interactive = true;
    hourContainer.buttonMode = true;
    const hourHand = new PIXI.Graphics()
      .beginFill(0x000000)
      .drawRoundedRect(0, 0, 8, bg.height / 4.5, 5);
    hourContainer.addChild(hourHand);
    hourContainer.position.set(this.center.x, this.center.y);
    hourContainer.pivot = new PIXI.Point(4, 5);
    hourContainer.rotation = 1.1 * Math.PI;
    app.stage.addChild(hourContainer);
    this.hourHand = hourContainer;

    // Draw the minute hand
    const minuteContainer = new PIXI.Container();
    minuteContainer.interactive = true;
    minuteContainer.buttonMode = true;
    const minuteHand = new PIXI.Graphics()
      .beginFill(0x666666)
      .drawRoundedRect(0, 0, 4, bg.height / 2.3, 4);
    minuteContainer.addChild(minuteHand);
    minuteContainer.position.set(this.center.x, this.center.y);
    minuteContainer.pivot = new PIXI.Point(2, 5);
    minuteContainer.rotation = 1.4 * Math.PI;
    app.stage.addChild(minuteContainer);
    this.minuteHand = minuteContainer;

    // Draw brown circle at the center
    const cog = new PIXI.Graphics()
      .beginFill(0x80522d)
      .drawCircle(this.center.x, this.center.y, 3);
    app.stage.addChild(cog);

    // Set up events
    minuteContainer
      // events for drag start
      .on("mousedown", this.onMinuteDragStart)
      .on("touchstart", this.onMinuteDragStart)
      // events for drag end
      .on("mouseup", this.onMinuteDragEnd)
      .on("mouseupoutside", this.onMinuteDragEnd)
      .on("touchend", this.onMinuteDragEnd)
      .on("touchendoutside", this.onMinuteDragEnd)
      // events for drag move
      .on("mousemove", this.onMinuteMove)
      .on("touchmove", this.onMinuteMove);

    hourContainer
      // events for drag start
      .on("mousedown", this.onHourDragStart)
      .on("touchstart", this.onHourDragStart)
      // events for drag end
      .on("mouseup", this.onHourDragEnd)
      .on("mouseupoutside", this.onHourDragEnd)
      .on("touchend", this.onHourDragEnd)
      .on("touchendoutside", this.onHourDragEnd)
      // events for drag move
      .on("mousemove", this.onHourMove)
      .on("touchmove", this.onHourMove);
  }

  /**
   * Return true if point C is counter-clockwise of point B, given a
   * circle's center at point A.
   *
   * From: https://gamedev.stackexchange.com/a/22139/120714
   */
  isCounterClockwise(a, b, c) {
    return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0;
  }

  onTimeUpdate(e) {
    // Parse the time input's time and make the update on the
    // global dateTime value.
    const time = e.target.value.split(":");
    const hours = forceNumber(time[0]);
    const minutes = forceNumber(time[1]);
    const d = new Date(this.props.dateTime);
    d.setHours(hours);
    d.setMinutes(minutes);
    return this.props.onDateTimeUpdate(d);
  }
  onMinuteDragStart(e) {
    this.dragStartPos = e.data.getLocalPosition(this.timePickerApp.stage);
    this.dragStartTime = this.props.dateTime;
    this.setState({ isDraggingMinute: true });
  }
  onMinuteDragEnd() {
    this.setState({ isDraggingMinute: false });
  }
  onMinuteMove(e) {
    if (this.state.isDraggingMinute) {
      const pos = e.data.getLocalPosition(this.timePickerApp.stage);

      const vAngle =
        Math.atan2(pos.y - this.center.y, pos.x - this.center.x) -
        Math.atan2(
          this.dragStartPos.y - this.center.y,
          this.dragStartPos.x - this.center.x
        );

      const minute = minuteAngleToTime(vAngle);

      let newTime = new Date(this.dragStartTime.getTime() + minute * 60 * 1000);

      const isCounterClockwise = this.isCounterClockwise(
        this.center,
        pos,
        this.minuteLastPos
      );

      // Make the minute hand able to decrement and increment
      // the current hour by dragging it in complete
      // circles. This took a while to figure out.
      if (isCounterClockwise && this.lastTime < newTime) {
        // Decrement an hour
        newTime = new Date(newTime.getTime() - 3600 * 1000);
        this.dragStartTime = new Date(
          this.dragStartTime.getTime() - 3600 * 1000
        );
      } else if (!isCounterClockwise && this.lastTime > newTime) {
        // Increment an hour
        newTime = new Date(newTime.getTime() + 3600 * 1000);
        this.dragStartTime = new Date(
          this.dragStartTime.getTime() + 3600 * 1000
        );
      }

      this.minuteLastPos = pos;
      this.lastTime = newTime;
      this.props.onDateTimeUpdate(newTime);
    }
  }

  onHourDragStart(e) {
    this.dragStartPos = e.data.getLocalPosition(this.timePickerApp.stage);
    this.dragStartTime = this.props.dateTime;
    this.setState({ isDraggingHour: true });
  }
  onHourDragEnd() {
    this.setState({ isDraggingHour: false });
  }
  onHourMove(e) {
    if (this.state.isDraggingHour) {
      const pos = e.data.getLocalPosition(this.timePickerApp.stage);

      const vAngle =
        Math.atan2(pos.y - this.center.y, pos.x - this.center.x) -
        Math.atan2(
          this.dragStartPos.y - this.center.y,
          this.dragStartPos.x - this.center.x
        );

      const hour = hourAngleToTime(vAngle);

      let newTime = new Date(this.dragStartTime.getTime() + hour * 3600 * 1000);

      const isCounterClockwise = this.isCounterClockwise(
        this.center,
        pos,
        this.hourLastPos
      );

      // Make the hour hand able to decrement and increment
      // the current day by dragging it in complete
      // circles. This took a while to figure out.
      if (isCounterClockwise && this.lastTime < newTime) {
        // Decrement a day
        newTime = new Date(newTime.getTime() - 3600 * 24 * 1000);
        this.dragStartTime = new Date(
          this.dragStartTime.getTime() - 3600 * 24 * 1000
        );
      } else if (!isCounterClockwise && this.lastTime > newTime) {
        // Increment a day
        newTime = new Date(newTime.getTime() + 3600 * 24 * 1000);
        this.dragStartTime = new Date(
          this.dragStartTime.getTime() + 3600 * 24 * 1000
        );
      }

      this.hourLastPos = pos;
      this.lastTime = newTime;

      this.props.onDateTimeUpdate(newTime);
    }
  }
}

Clock.propTypes = {
  dateTime: PropTypes.object.isRequired,
  onDateTimeUpdate: PropTypes.func.isRequired
};
