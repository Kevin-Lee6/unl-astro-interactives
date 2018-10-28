import React from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import { degToRad } from "./utils";

export default class MaterialState extends React.Component {
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
          height: 500,
          backgroundColor: 0xffffff,
          forceCanvas: true,
          sharedTicker: true
      });

      this.el.appendChild(this.app.view);


      // Add all the images to loader
      // this.app.loader
      //     .add("stateOfMaterial", "img/rightBar.png")


      const me = this;
      this.app.loader.load((loader, resources) => {
          me.resources = resources;
          me.gridContainer = me.drawGridContainer();
          me.greenRectangleContainer = me.drawGreenRectangle();
          me.blueRectangleContainer = me.drawBlueRectangle();
          me.whiteRectangleContainer = me.drawWhiteRectangle();
          me.redLineContainer = me.drawRedLine();

          me.start();
      });

      //this.blueRectangle.y = -30;



    }

    drawGridContainer() {
        const graphContainer = new PIXI.Container();

        this.app.stage.addChild(graphContainer);
        return graphContainer;
    }

    drawWhiteRectangle() {
        const objectContainer = new PIXI.Container();
        objectContainer.interactive = true;

        // let rectangle = new PIXI.Graphics();
        // rectangle.beginFill(0xf2f2f2);
        // rectangle.lineStyle(5, 0xf2f2f2);  //(thickness, color)
        // rectangle.drawRect(10, 0, 300, 500);
        // objectContainer.addChild(rectangle);

        const argon = new PIXI.Text("Argon - Neon (65 K)", {
          fontFamily: "Arial",
          fontSize: 13,
          fill: 0x000000,
          fontWeight: "bold",
          align: "center"
        });
        argon.x= 40;
        argon.y = 475;

        objectContainer.addChild(argon);

        const methane = new PIXI.Text("Methone (120 K)", {
          fontFamily: "Arial",
          fontSize: 13,
          fill: 0x000000,
          fontWeight: "bold",
          align: "center"
        });
        methane.x= 40;
        methane.y = 455;

        objectContainer.addChild(methane);

        const ammonia = new PIXI.Text("Ammonia (150 K)", {
          fontFamily: "Arial",
          fontSize: 13,
          fill: 0x000000,
          fontWeight: "bold",
          align: "center"
        });
        ammonia.x= 40;
        ammonia.y = 435;

        objectContainer.addChild(ammonia);

        const water = new PIXI.Text("Water (175 K)", {
          fontFamily: "Arial",
          fontSize: 13,
          fill: 0x000000,
          fontWeight: "bold",
          align: "center"
        });
        water.x= 40;
        water.y = 415;

        objectContainer.addChild(water);

        const troilite = new PIXI.Text("Troilite (FeS) (680 K)", {
          fontFamily: "Arial",
          fontSize: 13,
          fill: 0x000000,
          fontWeight: "bold",
          align: "center"
        });
        troilite.x= 40;
        troilite.y = 300;

        objectContainer.addChild(troilite);

        const feldspars = new PIXI.Text("Feldspars (1000 K)", {
          fontFamily: "Arial",
          fontSize: 13,
          fill: 0x000000,
          fontWeight: "bold",
          align: "center"
        });
        feldspars.x= 40;
        feldspars.y = 200;

        objectContainer.addChild(feldspars);

        const silicates = new PIXI.Text("Silicates (1200 K)", {
          fontFamily: "Arial",
          fontSize: 13,
          fill: 0x000000,
          fontWeight: "bold",
          align: "center"
        });
        silicates.x= 40;
        silicates.y = 140;

        objectContainer.addChild(silicates);

        const metalic = new PIXI.Text("Metallic Fe/Ni (1300 K)", {
          fontFamily: "Arial",
          fontSize: 13,
          fill: 0x000000,
          fontWeight: "bold",
          align: "center"
        });
        metalic.x= 40;
        metalic.y = 110;

        objectContainer.addChild(metalic);

        const metalOxides = new PIXI.Text("Metal Oxides (1500 K)", {
          fontFamily: "Arial",
          fontSize: 13,
          fill: 0x000000,
          fontWeight: "bold",
          align: "center"
        });
        metalOxides.x= 40;
        metalOxides.y = 20;

        objectContainer.addChild(metalOxides);

        this.app.stage.addChild(objectContainer);
        return objectContainer;

    }


    drawGreenRectangle() {
      const objectContainer = new PIXI.Container();
        objectContainer.interactive = true;

        let rectangle = new PIXI.Graphics();
        rectangle.beginFill(0xccffb3);
        rectangle.lineStyle(3, 0xeeffe6);  //(thickness, color)
        rectangle.drawRect(10, 0, 300, 500);
        objectContainer.addChild(rectangle);

        this.app.stage.addChild(objectContainer);
        return objectContainer;

      }

      drawBlueRectangle() {
          const objectContainer = new PIXI.Container();
          objectContainer.interactive = true;

          let rectangle = new PIXI.Graphics();
          rectangle.beginFill(0xcce6ff);
          rectangle.lineStyle(3, 0xe6f2ff);  //(thickness, color)
          rectangle.drawRect(10, 0, 300, 500);
          objectContainer.addChild(rectangle);

          this.app.stage.addChild(objectContainer);
          return objectContainer;

        }

        drawRedLine(){
          const objectContainer = new PIXI.Container();
          objectContainer.interactive = true;

          let line = new PIXI.Graphics();
          line.lineStyle(3,0xff3300,1);
          line.position.x = 60;//300;
          line.position.y = 0;//500;
          line.pivot.set(0,140);
          line.rotation = 1.56;
          line.moveTo(0,0);
          line.lineTo(0, 190);
          objectContainer.addChild(line);

          this.app.stage.addChild(objectContainer);
          return objectContainer;
        }

      start() {
          if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.update);
        }
      }

      stop() {
        cancelAnimationFrame(this.frameId);
      }

      update(){
        const redLine = this.redLineContainer;
        const blueRectangle = this.blueRectangleContainer;
        const initialTemperature = 600;
        //blueRectangle.y = 10;
        // redLine.y = 330;
        // 10 < blueRectangle.y < 495

        if( initialTemperature != this.props.temperature) {
          const dif= this.props.temperature - initialTemperature

          if (dif > 0){
            blueRectangle.y  = 330 - (dif * (320/920));
            redLine.y  = 330 - (dif * (320/920));
          }

          if ( dif < 0){
            blueRectangle.y  = 330 - ( dif * (165/565));
            redLine.y  = 330 - ( dif * (165/565));
          }
        }else {
           blueRectangle.y = 330;
           redLine.y = 330;
        }

        this.setState({
          temperature: this.props.temperature
        });

        this.frameId = requestAnimationFrame(this.update);
     }
}
