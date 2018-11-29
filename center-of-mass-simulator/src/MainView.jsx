import React from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import { degToRad } from "./utils";

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalMass: 0,
      objectY: 0,
      objectOnePosition: 0,
      objectTwoPosition: 0,
      objectOneRadius:
        (this.props.objectTwoMass /
          (this.props.objectTwoMass + this.props.objectOneMass)) *
        this.props.separation,
      objectTwoRadius:
        (this.props.objectOneMass /
          (this.props.objectTwoMass + this.props.objectOneMass)) *
        this.props.separation,
      separation: this.props.separation
    };

    this.resources = {};

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.update = this.update.bind(this);
  }
  // react/PIXI integration from:
  // https://www.protectator.ch/post/pixijs-v4-in-a-react-component
  render() {
    return (
      <div
        ref={thisDiv => {
          this.el = thisDiv;
        }}
      />
    );
  }
  componentDidMount() {
    //Create canvas to display
    this.app = new PIXI.Application({
      width: 600,
      height: 400,
      backgroundColor: 0xfffff1,
      forceCanvas: true,
      sharedTicker: true
    });

    this.el.appendChild(this.app.view);

    //Add all the images to loader
    this.app.loader
      .add("center", "img/center.svg")
      .add("circle", "img/circle.svg")
      .add("massOneText", "img/m1.svg")
      .add("massTwoText", "img/m2.svg")
      .add("radiusOneText", "img/r1.svg")
      .add("radiusTwoText", "img/r2.svg");

    const me = this;

    this.app.loader.load((loader, resources) => {
      me.resources = resources;
      me.gridContainer = me.drawGridContainer();
      me.grid = me.drawGrid(this.gridContainer, this.props.separation);
      me.objectContainerOne = me.drawObject(
        resources.circle,
        resources.massOneText,
        "One"
      );
      me.objectContainerTwo = me.drawObject(
        resources.circle,
        resources.massTwoText,
        "Two"
      );
      me.centerContainer = me.drawCenter(resources.center);
      me.lineContainerOne = me.drawArrows(
        me.centerContainer.children.find(el => {
          return el.name === "centerObj";
        }),
        me.objectContainerOne.children.find(el => {
          return el.name === "circleObj";
        }),
        "0x0066ff",
        resources.radiusOneText
      );
      me.lineContainerTwo = me.drawArrows(
        me.centerContainer.children.find(el => {
          return el.name === "centerObj";
        }),
        me.objectContainerTwo.children.find(el => {
          return el.name === "circleObj";
        }),
        "0xff0000",
        resources.radiusTwoText
      );
      me.start();
    });
  }

  componentWillUnmount() {
    this.app.stop();
  }

  start() {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.update);
    }
  }

  stop() {
    cancelAnimationFrame(this.frameId);
  }

  //Update all the elements in the canvas
  update() {
    const center = this.centerContainer.children.find(el => {
      return el.name === "centerObj";
    });
    const objectOne = this.objectContainerOne.children.find(el => {
      return el.name === "circleObj";
    });
    const objectOneText = this.objectContainerOne.children.find(el => {
      return el.name === "textObj";
    });
    const objectTwo = this.objectContainerTwo.children.find(el => {
      return el.name === "circleObj";
    });
    const objectTwoText = this.objectContainerTwo.children.find(el => {
      return el.name === "textObj";
    });
    const lineOne = this.lineContainerOne.children.find(el => {
      return el.name === "lineObj";
    });
    const lineTwo = this.lineContainerTwo.children.find(el => {
      return el.name === "lineObj";
    });
    const radiusContainerOne = this.lineContainerOne.children.find(el => {
      return el.name === "radiusContainer";
    });
    const radiusContainerTwo = this.lineContainerTwo.children.find(el => {
      return el.name === "radiusContainer";
    });
    const radiusValueOne = radiusContainerOne.children.find(el => {
      return el.name === "radiusValue";
    });
    const radiusValueTwo = radiusContainerTwo.children.find(el => {
      return el.name === "radiusValue";
    });
    objectOne.scale.x = 1 + this.props.objectOneMass * 0.125;
    objectOne.scale.y = 1 + this.props.objectOneMass * 0.125;
    objectTwo.scale.x = 1 + this.props.objectTwoMass * 0.125;
    objectTwo.scale.y = 1 + this.props.objectTwoMass * 0.125;
    this.setState({
      totalMass: this.props.objectOneMass + this.props.objectTwoMass
    });
    if (this.props.isCmFixed) {
      center.x = 300;
      objectOne.x =
        center.x - (this.props.objectTwoMass / this.state.totalMass) * 200;
      objectTwo.x =
        (this.props.objectOneMass / this.state.totalMass) * 200 + center.x;
    } else {
      objectOne.x = 200;
      objectTwo.x = 400;
      center.x =
        objectOne.x + (this.props.objectTwoMass / this.state.totalMass) * 200;
    }
    objectOneText.x = objectOne.x + 4;
    objectTwoText.x = objectTwo.x + 4;
    if (
      this.state.objectOnePosition != objectOne.x ||
      this.state.objecTwoPosition != objectTwo.x
    ) {
      this.setState({
        objectOnePosition: objectOne.x,
        objectTwoPosition: objectTwo.x,
        objectOneRadius:
          Math.round(
            (this.props.objectTwoMass /
              (this.props.objectTwoMass + this.props.objectOneMass)) *
              this.props.separation *
              100
          ) / 100,
        objectTwoRadius:
          Math.round(
            (this.props.objectOneMass /
              (this.props.objectTwoMass + this.props.objectOneMass)) *
              this.props.separation *
              100
          ) / 100
      });
      lineOne.clear();
      lineTwo.clear();
      lineOne.lineWidth = 0.8;
      lineTwo.lineWidth = 0.8;
      lineOne.moveTo(center.x, this.state.objectY);
      lineOne.lineTo(objectOne.x, this.state.objectY);
      lineTwo.moveTo(center.x, this.state.objectY);
      lineTwo.lineTo(objectTwo.x, this.state.objectY);
      radiusContainerOne.x = (objectOne.x + center.x) / 2 - 20;
      radiusValueOne.text = this.state.objectOneRadius;
      radiusContainerTwo.x = (objectTwo.x + center.x) / 2 - 20;
      radiusValueTwo.text = this.state.objectTwoRadius;
    }
    if (this.state.separation != this.props.separation) {
      this.gridContainer.removeChildren();
      this.setState({
        separation: this.props.separation
      });
      this.drawGrid(this.gridContainer, this.state.separation);
    }

    this.frameId = requestAnimationFrame(this.update);
  }

  drawObject(circleResource, textResource, objectIndex) {
    const objectContainer = new PIXI.Container();
    objectContainer.name = "object" + objectIndex;
    objectContainer.interactive = true;

    const circle = new PIXI.Sprite(circleResource.texture);
    circle.name = "circleObj";
    circle.width = 30;
    circle.height = 30;
    circle.anchor.set(0.5);
    if (objectIndex == "One") {
      circle.x = this.app.screen.width / 2 - 100;
      this.setState({
        objectOnePosition: circle.x
      });
    } else {
      circle.x = this.app.screen.width / 2 + 100;
      this.setState({
        objectTwoPosition: circle.x
      });
    }
    circle.y = this.app.screen.height / 2;
    objectContainer.addChild(circle);

    const text = new PIXI.Sprite(textResource.texture);
    text.name = "textObj";
    text.anchor.set(0.5);
    text.x = circle.x + 4;
    text.y = circle.y;
    objectContainer.addChild(text);

    this.app.stage.addChild(objectContainer);
    return objectContainer;
  }

  drawGridContainer() {
    const graphContainer = new PIXI.Container();

    this.app.stage.addChild(graphContainer);
    return graphContainer;
  }

  drawGrid(container, separation) {
    separation = 200 / separation;
    let grid = new PIXI.Graphics();
    container.addChild(grid);
    grid.position.set(0, 0);
    var i = 0;

    for (
      i = this.app.screen.width / 2;
      i < this.app.screen.width;
      i = i + separation
    ) {
      grid
        .lineStyle(0.2, 0x000000)
        .moveTo(i, 0)
        .lineTo(i, this.app.screen.height);
    }

    for (i = this.app.screen.width / 2; i > 0; i = i - separation) {
      grid
        .lineStyle(0.2, 0x000000)
        .moveTo(i, 0)
        .lineTo(i, this.app.screen.height);
    }

    for (
      i = this.app.screen.height / 2;
      i < this.app.screen.height;
      i = i + separation
    ) {
      grid
        .lineStyle(0.2, 0x000000)
        .moveTo(0, i)
        .lineTo(this.app.screen.width, i);
    }

    for (i = this.app.screen.height / 2; i > 0; i = i - separation) {
      grid
        .lineStyle(0.2, 0x000000)
        .moveTo(0, i)
        .lineTo(this.app.screen.width, i);
    }
  }

  drawCenter(centerResource) {
    const centerContainer = new PIXI.Container();
    const center = new PIXI.Sprite(centerResource.texture);
    center.name = "centerObj";
    center.width = 10;
    center.height = 10;
    center.anchor.set(0.5);
    center.x = this.app.screen.width / 2;
    center.y = this.app.screen.height / 2;
    centerContainer.addChild(center);
    this.app.stage.addChild(centerContainer);

    return centerContainer;
  }

  drawArrows(center, object, color, radiusText) {
    const lineContainer = new PIXI.Container();
    let line = new PIXI.Graphics();
    line.lineColor = color;
    line.lineWidth = 0.8;
    line.name = "lineObj";
    this.setState({
      objectY: object.y + object.height * 1.333
    });
    line.moveTo(object.x, this.state.objectY);
    line.lineTo(center.x, this.state.objectY);
    // Draw the arrowhead
    // let arrowhead = new PIXI.Graphics()
    //   .beginFill(0xffff80)
    //   .drawPolygon([110, i * 50 + 26, 110, i * 50 + 34, 123, i * 50 + 30]);
    lineContainer.addChild(line);

    const radiusContainer = new PIXI.Container();
    radiusContainer.name = "radiusContainer";
    const radius = new PIXI.Sprite(radiusText.texture);
    radius.name = "rtextObj";
    radius.y = this.state.objectY + 10;
    radiusContainer.addChild(radius);

    const radiusValue = new PIXI.Text("text", {
      fontFamily: "Arial",
      fontSize: 28,
      fontWeight: "regular",
      fill: color,
      align: "center"
    });
    radiusValue.name = "radiusValue";
    radiusValue.position.x = radius.x + 30;
    radiusValue.position.y = radius.y - 2;
    radiusContainer.addChild(radiusValue);
    radiusContainer.x = (object.x + center.x) / 2 - 20;

    lineContainer.addChild(radiusContainer);

    this.app.stage.addChild(lineContainer);
    // this.app.stage.addChild(arrowhead);
    return lineContainer;
  }
}

MainView.propTypes = {
  objectOneMass: PropTypes.number.isRequired,
  objectTwoMass: PropTypes.number.isRequired,
  separation: PropTypes.number.isRequired,
  isCmFixed: PropTypes.bool.isRequired
};
