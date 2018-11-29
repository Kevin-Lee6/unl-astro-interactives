import React from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import { degToRad } from "./utils";

// three.js/react integration based on:
// https://stackoverflow.com/a/46412546/173630
export default class NorthStarView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.resources = {};

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.animate = this.animate.bind(this);
  }

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
    this.app = new PIXI.Application({
      width: 400,
      height: 430,
      backgroundColor: 0x000000,
      // The default is webgl - I'll switch to that if necessary
      // but for now canvas just displays my images better. I'm
      // guessing there's just some filters or settings I can add
      // to make it look good in webgl.
      forceCanvas: true,

      // as far as I know the ticker isn't necessary at the
      // moment.
      sharedTicker: true
    });

    this.el.appendChild(this.app.view);

    this.app.loader.add("star", "img/star.png");
    this.app.loader.add("starLine", "img/line.png");
    this.app.loader.add("bottomBg", "img/bottombg.svg");
    this.app.loader.add("background", "img/background.png");

    const me = this;
    this.app.loader.load((loader, resources) => {
      me.resources = resources;

      me.bgContainer = me.drawBackground(resources.background);
      me.starContainer = me.drawStar(resources.star, resources.starLine);
      me.bottomContainer = me.drawBottom(resources.bottomBg);
      me.textContainer = me.drawText();
      me.start();
    });
  }

  componentWillUnmount() {
    this.app.stop();
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
    const me = this;
    const star = this.starContainer.children.find(el => {
      return el.name === "starObj";
    });
    const starline = this.starContainer.children.find(el => {
      return el.name === "starLineObj";
    });
    const background = this.bgContainer.children.find(el => {
      return el.name === "background";
    });
    const bigDipperText = this.textContainer.children.find(el => {
      return el.name === "bigDipper";
    });
    const littleDipperText = this.textContainer.children.find(el => {
      return el.name === "littleDipper";
    });
    const northStarText = this.textContainer.children.find(el => {
      return el.name === "northStar";
    });
    const cassiopeiaText = this.textContainer.children.find(el => {
      return el.name === "cassiopeia";
    });
    var rotation =
      (102.5 -
        360 *
          ((this.props.solDaysSinceZero * 366) / 365 - 0.49583333333333335)) %
      360;
    rotation = degToRad(rotation);
    var tbn3 = (((this.props.solDaysSinceZero - 0.5) % 1) + 1) % 1;
    var twilightAngle = 0.12217304763960307;
    var latitude = 0.7155849933176751;
    var sunLongitude =
      (this.props.solDaysSinceZero / 365) * 2 * 3.141592653589793;
    var sunDeclination = Math.asin(
      0.39714789063478056 * Math.sin(sunLongitude)
    );
    var sinSunDec = Math.sin(sunDeclination);
    var sinLat = Math.sin(latitude);
    var cosSunDec = Math.cos(sunDeclination);
    var cosLat = Math.cos(latitude);
    var zTwilight = Math.sin(-twilightAngle);
    var sinProduct = sinSunDec * sinLat;
    var cosProduct = cosSunDec * cosLat;
    var cosAlphaAtTwilightLimit = (zTwilight - sinProduct) / cosProduct;
    var cosAlphaOnHorizon = -sinProduct / cosProduct;
    var neverAboveTwilightLimit = cosAlphaAtTwilightLimit >= 1;
    var neverBelowTwilightLimit = cosAlphaAtTwilightLimit <= -1;
    var neverAboveHorizon = cosAlphaOnHorizon >= 1;
    var neverBelowHorizon = cosAlphaOnHorizon <= -1;

    if (neverBelowHorizon) {
      trace("something that shouldn't happen has happened! (case 1)");
    } else if (neverAboveTwilightLimit) {
      trace("something that shouldn't happen has happened! (case 2)");
    } else {
      var twilightStartAlpha;
      var twilightEndAlpha;

      if (neverBelowTwilightLimit) {
        trace("something that shouldn't happen has happened! (cases 3 or 4)");
      } else {
        twilightStartAlpha = Math.acos(cosAlphaAtTwilightLimit);

        var nightEnds = 0.5 * (1 - twilightStartAlpha / 3.141592653589793);
        var nightStarts = 0.5 * (1 + twilightStartAlpha / 3.141592653589793);

        if (neverAboveHorizon) {
          trace("something that shouldn't happen has happened! (cases 3 or 5)");
        } else {
          twilightEndAlpha = Math.acos(cosAlphaOnHorizon);

          var dayStarts = 0.5 * (1 - twilightEndAlpha / 3.141592653589793);
          var dayEnds = 0.5 * (1 + twilightEndAlpha / 3.141592653589793);
          var twilightFraction = dayStarts - nightEnds;

          if (tbn3 > 0.5) {
            tbn3 = 1 - tbn3;
          }

          var tbn2 = (tbn3 - nightEnds) / twilightFraction;

          if (tbn2 < 0) {
            tbn2 = 0;
          } else if (tbn2 > 1) {
            tbn2 = 1;
          }
          var alpha = tbn2;

          background.alpha = alpha;
        }
      }
    }

    //Rotate the star container and the text container
    this.starContainer.rotation = rotation;
    this.textContainer.rotation = this.starContainer.rotation;
    //Unrotate the texts so they stay at the right angle while rotating their position with stars
    northStarText.rotation = -rotation;
    cassiopeiaText.rotation = -rotation;
    bigDipperText.rotation = -rotation;
    littleDipperText.rotation = -rotation;

    if (!this.props.isShowDetails) {
      this.textContainer.alpha = 0;
      starline.alpha = 0;
    } else {
      this.textContainer.alpha = 1;
      starline.alpha = 1;
    }

    this.frameId = requestAnimationFrame(this.animate);
  }

  drawStar(starResource, lineResource) {
    const starContainer = new PIXI.Container();
    starContainer.name = "star";

    const star = new PIXI.Sprite(starResource.texture);
    star.width = 400;
    star.height = 400;
    star.anchor.set(0.5);
    star.position.set(this.app.screen.width / 2, 200);
    star.name = "starObj";
    starContainer.addChild(star);

    const starLine = new PIXI.Sprite(lineResource.texture);
    starLine.width = 400;
    starLine.height = 400;
    starLine.anchor.set(0.5);
    starLine.position.set(this.app.screen.width / 2, 200);
    starLine.name = "starLineObj";
    starContainer.addChild(starLine);

    starContainer.x = 200;
    starContainer.y = 200;

    starContainer.pivot.x = starContainer.width / 2;
    starContainer.pivot.y = starContainer.height / 2;

    starContainer.scale.set(0.92);
    this.app.stage.addChild(starContainer);

    return starContainer;
  }

  drawBottom(bottomBgResource) {
    const bottomContainer = new PIXI.Container();

    const bottomBg = new PIXI.Sprite(bottomBgResource.texture);
    bottomBg.width = this.app.screen.width;
    bottomBg.height = 50;
    bottomContainer.addChild(bottomBg);

    const nText = new PIXI.Text("N", {
      fontFamily: "Arial",
      fontSize: 14,
      fill: 0xffffff,
      align: "center",
      fontWeight: "bold"
    });
    nText.position.set(bottomBg.width / 2 - 5, bottomBg.height / 2 - 5);
    bottomContainer.addChild(nText);

    bottomContainer.x = 0;
    bottomContainer.y = 380;

    this.app.stage.addChild(bottomContainer);
  }

  drawBackground(bgResource) {
    const bgContainer = new PIXI.Container();

    const background = new PIXI.Sprite(bgResource.texture);
    background.name = "background";
    background.width = this.app.screen.width;
    background.height = this.app.screen.width;
    bgContainer.addChild(background);

    this.app.stage.addChild(bgContainer);

    return bgContainer;
  }

  drawText() {
    const textContainer = new PIXI.Container();
    textContainer.name = "textContainer";

    const littleDipperText = new PIXI.Text("Little\nDipper", {
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0xffffff,
      align: "center"
    });
    littleDipperText.name = "littleDipper";
    littleDipperText.pivot.set(14, 18);
    littleDipperText.position.set(-60, -80);
    textContainer.addChild(littleDipperText);

    const bigDipperText = new PIXI.Text("Big\nDipper", {
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0xffffff,
      align: "center"
    });
    bigDipperText.name = "bigDipper";
    bigDipperText.pivot.set(14, 18);
    bigDipperText.position.set(-105, 100);
    textContainer.addChild(bigDipperText);

    const cassiopeiaText = new PIXI.Text("Cassopeia", {
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0xffffff,
      align: "center"
    });
    cassiopeiaText.pivot.set(7, 28);
    cassiopeiaText.name = "cassiopeia";
    cassiopeiaText.position.set(135, 65);
    textContainer.addChild(cassiopeiaText);

    const northStarText = new PIXI.Text("North\nStar", {
      fontFamily: "Arial",
      fontSize: 12,
      fill: 0xffffff,
      align: "center"
    });
    northStarText.name = "northStar";
    northStarText.pivot.set(14, 15);
    northStarText.position.set(18, 18);
    textContainer.addChild(northStarText);

    textContainer.x = 200;
    textContainer.y = 200;

    this.app.stage.addChild(textContainer);
    return textContainer;
  }
}

NorthStarView.propTypes = {
  solDaysSinceZero: PropTypes.number.isRequired,
  isShowDetails: PropTypes.bool.isRequired
};
