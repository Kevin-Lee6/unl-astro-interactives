import React from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";

export default class MainView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      isThinkingExplosionPlay: false,
      isResetted: false,
      isSuperNovaExplodedPlay: 1
    };

    this.resources = {};

    // The nova's level.
    this.star = {
      x: 70,
      y: 150
    };

    this.initialRate = 1.58;

    this.onDragStart = this.onDragStart.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onMove = this.onMove.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
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
    const app = new PIXI.Application({
      width: 930,
      height: 300,
      backgroundColor: 0x000000,
      forceCanvas: true,
      sharedTicker: true
    });

    app.loader
      .add("star", "img/star.svg")
      .add("observer", "img/observer.png")
      .add("curlyBrace", "img/curlyBrace.png")
      .add("explosion", "img/explosion.svg")
      .add("circle", "img/circle.png")
      .add("thinkingCloud", "img/think.svg");

    const me = this;
    app.loader.load((loader, resources) => {
      me.resources = resources;

      me.starContainer = me.drawStar(resources.star);
      me.draw();
    });

    this.el.appendChild(app.view);

    this.app = app;
  }
  componentWillUnmount() {
    this.app.stop();
  }

  componentDidUpdate(prevProps) {
    if (this.props.distance !== prevProps.distance) {
      // Update the scene when this component has new prop
      // values that aren't reflected in the current scene.
      const dist = this.unitToPixel(this.props.distance);

      this.observer.position.x = dist - 20 / 2;
      this.thinkingCloud.position.x = this.observer.position.x + 10;
      this.curlyBrace.width = this.observer.position.x - this.star.x + 18.5;
      this.text.text = this.props.lightYear + " ly";
      this.text.position.x = dist / 2 + 45;
      this.explosionCircle.width = 40;
      this.explosionCircle.height = 40;
      this.explosionCircle.visible = false;
      this.thinkingCloudStar.position.x = this.thinkingCloud.position.x;
      this.thinkingCloudExplosion.position.x = this.thinkingCloud.position.x;
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
    this.props.onObserverDistanceInPixelUpdate(
      this.observer.position.x - this.star.x
    );
    if (!this.props.isStart) {
      this.thinkingCloudStar.visible = true;
      this.explosionCircle.visible = false;
      this.starContainer.visible = true;
      this.explosionCircle.width = 40;
      this.explosionCircle.height = 40;
      this.setState({
        isThinkingExplosionPlay: false,
        isSuperNovaExplodedPlay: 1
      });
      this.initialRate = 1.58;
      this.observer.interactive = true;
    }
    if (this.props.isStart) {
      this.observer.interactive = false;
      this.initialRate = this.initialRate + (this.props.distance / 200) * 0.005;
      this.explosionCircle.visible = true;
      this.size =
        ((this.props.superNovaCurrentYear - this.props.superNovaOccurYear) /
          (this.props.superNovaObservedYear - this.props.superNovaOccurYear)) *
          this.props.distanceStarObserverInPixel *
          2 +
        20;
      this.explosionCircle.width = this.size > 0 ? this.size : 0;
      this.explosionCircle.height = this.size > 0 ? this.size : 0;
      if (
        this.explosionCircle.width > 0 &&
        this.state.isSuperNovaExplodedPlay == 1
      ) {
        this.starContainer.visible = false;
        this.superNovaExplosion.visible = true;
        setTimeout(
          function() {
            this.superNovaExplosion.visible = false;
            this.setState({
              isSuperNovaExplodedPlay: 2
            });
          }.bind(this),
          1500
        );
      }
      if (this.explosionCircle.width <= 0) {
        this.starContainer.visible = true;
        this.setState({
          isSuperNovaExplodedPlay: 1
        });
      }
      if (this.props.isObserved && !this.state.isThinkingExplosionPlay) {
        this.thinkingCloudStar.visible = false;
        this.thinkingCloudExplosion.visible = true;
        this.setState({ isThinkingExplosionPlay: true });
      }
      if (
        this.explosionCircle.width <
          this.props.distanceStarObserverInPixel * 2 + 20 &&
        (this.props.isPausing || this.props.isEnd)
      ) {
        this.thinkingCloudStar.visible = true;
        this.props.onUpdateIsNotObserved();
        this.setState({ isThinkingExplosionPlay: false });
      }
      if (
        this.state.isThinkingExplosionPlay &&
        this.thinkingCloudExplosion.visible
      ) {
        setTimeout(
          function() {
            this.thinkingCloudExplosion.visible = false;
            this.props.onUpdateIsObservedAndExploded();
            this.setState({
              isThinkingExplosionPlay: true
            });
          }.bind(this),
          1200
        );
      }
    }
    this.frameId = requestAnimationFrame(this.animate);
  }

  draw() {
    this.observer = this.drawObserver(this.app, this.resources.observer);
    this.curlyBrace = this.drawCurlyBrace(this.app, this.resources.curlyBrace);
    this.text = this.drawLightYearText(this.app);
    this.explosionCircle = this.drawExplosionCircle(this.resources.circle);
    this.thinkingCloud = this.drawThinkingCloud(
      this.app,
      this.resources.thinkingCloud
    );
    this.thinkingCloudStar = this.drawThinkingCloudStar(
      this.app,
      this.resources.star
    );
    this.thinkingCloudExplosion = this.drawThinkingCloudExplosion(
      this.app,
      this.resources.explosion
    );
    this.superNovaExplosion = this.drawSuperNovaExplosion(
      this.app,
      this.resources.explosion
    );
  }

  drawExplosionCircle(circleResource) {
    const explosionCircle = new PIXI.Sprite(circleResource.texture);
    explosionCircle.width = 40;
    explosionCircle.height = 40;
    explosionCircle.anchor.set(0.5);
    explosionCircle.position.set(this.star.x, this.star.y);
    explosionCircle.visible = false;
    this.app.stage.addChild(explosionCircle);
    this.start();
    return explosionCircle;
  }

  drawStar(starResource) {
    const starContainer = new PIXI.Container();
    starContainer.name = "star";
    starContainer.buttonMode = true;
    starContainer.interactive = true;
    starContainer.position.set(this.star.x, this.star.y);

    const star = new PIXI.Sprite(starResource.texture);
    star.name = "starObj";
    star.width = 20;
    star.height = 20;
    star.anchor.set(0.5);
    starContainer.addChild(star);

    this.app.stage.addChild(starContainer);
    return starContainer;
  }

  drawObserver(app, resource) {
    const dist = this.unitToPixel(this.props.distance);
    const observer = new PIXI.Sprite(resource.texture);
    observer.interactive = true;
    observer.buttonMode = true;
    observer.position.set(dist - 10, this.app.view.height / 2 - 15);
    observer.scale.set(1);
    app.stage.addChild(observer);

    observer
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

    return observer;
  }

  drawThinkingCloud(app, resource) {
    const thinkingCloud = new PIXI.Sprite(resource.texture);
    thinkingCloud.position.set(this.observer.x + 10, this.observer.y - 55);
    thinkingCloud.anchor.set(0.5);
    thinkingCloud.scale.set(0.8);
    app.stage.addChild(thinkingCloud);
    return thinkingCloud;
  }

  drawThinkingCloudStar(app, resource) {
    const thinkingCloudStar = new PIXI.Sprite(resource.texture);
    thinkingCloudStar.position.set(
      this.thinkingCloud.x,
      this.thinkingCloud.y - 20
    );
    thinkingCloudStar.anchor.set(0.5);
    app.stage.addChild(thinkingCloudStar);
    return thinkingCloudStar;
  }

  drawThinkingCloudExplosion(app, resource) {
    const thinkingCloudExplosion = new PIXI.Sprite(resource.texture);
    thinkingCloudExplosion.position.set(
      this.thinkingCloud.x,
      this.thinkingCloud.y - 20
    );
    thinkingCloudExplosion.scale.set(1.3);
    thinkingCloudExplosion.anchor.set(0.5);
    thinkingCloudExplosion.visible = false;
    app.stage.addChild(thinkingCloudExplosion);
    return thinkingCloudExplosion;
  }

  drawSuperNovaExplosion(app, resource) {
    const superNovaExplosion = new PIXI.Sprite(resource.texture);
    superNovaExplosion.position.set(this.star.x, this.star.y);
    superNovaExplosion.scale.set(1.3);
    superNovaExplosion.anchor.set(0.5);
    superNovaExplosion.visible = false;
    app.stage.addChild(superNovaExplosion);
    return superNovaExplosion;
  }

  drawCurlyBrace(app, resource) {
    const dist = this.unitToPixel(this.props.distance);
    const curlyBrace = new PIXI.Sprite(resource.texture);
    curlyBrace.position.set(this.star.x, this.app.view.height / 2 + 75);
    curlyBrace.width = dist - this.star.x + 8.5;
    curlyBrace.height = 20;
    app.stage.addChild(curlyBrace);

    return curlyBrace;
  }

  drawLightYearText(app) {
    const dist = this.unitToPixel(this.props.distance);
    let text = new PIXI.Text(this.props.lightYear + " ly", {
      fontFamily: "Arial",
      fontSize: 15,
      fontWeight: "bold",
      fill: 0xffffff,
      align: "center"
    });
    text.anchor.set(0.5);
    text.position.set(dist / 2 + 50, this.app.view.height / 2 + 110);

    app.stage.addChild(text);
    return text;
  }
  /**
   * Conversion functions to and from the scene's generic "units"
   * and pixel dimensions.
   */
  unitToPixel(n) {
    return n * 11;
  }
  pixelToUnit(n) {
    return n / 11;
  }

  distanceToLightYear(distance) {
    return Math.round(((distance - 15) * 150) / 100) * 100 + 1000;
  }

  onDragStart() {
    this.setState({ isDragging: true });
  }
  onDragEnd() {
    this.setState({ isDragging: false });
  }
  onMove(e) {
    if (this.state.isDragging) {
      const pos = e.data.getLocalPosition(this.app.stage);
      let d = Math.max(Math.min(this.pixelToUnit(pos.x), 75), 15);
      // Round it to one decimal place
      d = Math.round(d * 10) / 10;
      this.props.onDistanceUpdate(d);
      this.props.onLightYearUpdate(this.distanceToLightYear(d));
    }
  }
}

MainView.propTypes = {
  distance: PropTypes.number.isRequired,
  lightYear: PropTypes.number.isRequired,
  onDistanceUpdate: PropTypes.func.isRequired,
  onLightYearUpdate: PropTypes.func.isRequired,
  onObserverDistanceInPixelUpdate: PropTypes.func.isRequired,
  superNovaCurrentYear: PropTypes.number.isRequired,
  superNovaObservedYear: PropTypes.number.isRequired,
  superNovaOccurYear: PropTypes.number.isRequired,
  isStart: PropTypes.bool.isRequired,
  isPausing: PropTypes.bool.isRequired,
  onTimelineEnds: PropTypes.func.isRequired,
  isReset: PropTypes.bool.isRequired,
  isEnd: PropTypes.bool.isRequired,
  onResetUpdate: PropTypes.func.isRequired,
  isObserved: PropTypes.bool.isRequired,
  onUpdateIsObservedAndExploded: PropTypes.func.isRequired,
  distanceStarObserverInPixel: PropTypes.number.isRequired,
  onUpdateIsNotObserved: PropTypes.func.isRequired
};
