import React from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import { degToRad } from "./utils";

export default class StateOfMaterial extends React.Component {
  constructor(props) {
      super(props);
      this.resources = {};
      this.state = {
        temperature: this.props.temperature
      };

      this.start = this.start.bind(this);
      this.stop = this.stop.bind(this);
      this.update = this.update.bind(this);
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
      //Create canvas to display
      this.app = new PIXI.Application({
          width: 200,
          height: 300,
          backgroundColor: 0xffffff,
          forceCanvas: true,
          sharedTicker: true
      });

      this.el.appendChild(this.app.view);


      // Add all the images to loader
      this.app.loader
          .add("stateOfMaterial", "img/rightBar.png")


      const me = this;
      this.app.loader.load((loader, resources) => {
          me.resources = resources;
          me.gridContainer = me.drawGridContainer();
          me.stateMaterial = me.drawStateMaterial(
              resources.stateOfMaterial
          );

          me.start();
      });

      drawGraph(graphResource) {
          const objectContainer = new PIXI.Container();
          objectContainer.interactive = true;

          const stateOfMaterial = new PIXI.Sprite(graphResource.texture);
          stateOfMaterial.name = "stateOfMaterialObj";
          stateOfMaterial.x = this.app.screen.width / 15 - 100;
          stateOfMaterial.y = this.app.screen.height / 8;

          objectContainer.addChild(graph);

          this.app.stage.addChild(objectContainer);
          return objectContainer;

      }

  }
}
