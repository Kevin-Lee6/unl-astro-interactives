import React from "react";
import PropTypes from "prop-types";
import * as PIXI from "pixi.js";
import { degToRad } from "./utils";

export default class MainView extends React.Component {
    constructor(props) {
        super(props);
        this.resources = {};

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
            width: 800,
            height: 500,
            backgroundColor: 0xffffff,
            forceCanvas: true,
            sharedTicker: true
        });

        this.el.appendChild(this.app.view);


        // Add all the images to loader
        this.app.loader
            .add("graph", "img/graph.png")
            .add("planets", "img/planets.png");


        const me = this;
        this.app.loader.load((loader, resources) => {
            me.resources = resources;
            me.gridContainer = me.drawGridContainer();
            me.graph = me.drawGrath(
                resources.graph
            );
            me.planets = me.drawPlanets(
                resources.planets
            );
        });
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.update);
        }
    }

    drawGridContainer() {
        const graphContainer = new PIXI.Container();

        this.app.stage.addChild(graphContainer);
        return graphContainer;
    }

    drawGrath(graphResource) {
        const objectContainer = new PIXI.Container();
        objectContainer.interactive = true;

        const graph = new PIXI.Sprite(graphResource.texture);
        graph.name = "graphObj";
        graph.x = this.app.screen.width / 15 - 100;
        graph.y = this.app.screen.height / 8;

        objectContainer.addChild(graph);

        this.app.stage.addChild(objectContainer);
        return objectContainer;

    }

    drawPlanets(planetResources){
        const planetContainer = new PIXI.Container();
        planetContainer.interective = true;

        const planets = new PIXI.Sprite(planetResources.texture);
        planets.name = "planetsObj";
        planets.width = 320;
        planets.height = 300;
        planets.x = this.app.screen.width / 4 - 100;
        planets.y = this.app.screen.height / 5;

        planetContainer.addChild(planets);


        this.app.stage.addChild(planetContainer);
        return planetContainer;
    }

    start() {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.update);
        }
    }

    stop() {
        cancelAnimationFrame(this.frameId);
    }

    update() {
        
    }

}
