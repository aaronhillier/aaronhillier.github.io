/*
Program: main.js
Programmer: Aaron Hillier
Latest Edit: April 13, 2023
Purpose: To provide functionality for PROG 5075 assignment 4 web page
*/

"use strict";

// import necessary modules for scene, widgets, layers, etc.
require(["esri/config",
    "esri/Map",
    "esri/layers/FeatureLayer",
    "esri/symbols/WebStyleSymbol",
    "esri/views/SceneView",
    "esri/widgets/BasemapToggle",
    "esri/widgets/ElevationProfile",
    "esri/widgets/Expand",
    "esri/widgets/Home",
    "esri/widgets/Legend",
    "esri/widgets/LineOfSight",
], function (esriConfig, Map, FeatureLayer, WebStyleSymbol, SceneView, BasemapToggle, ElevationProfile, Expand, Home, Legend, LineOfSight) {

    // user API key for ArcGIS Developer account
    esriConfig.apiKey = "AAPK305240b8b50f4f6a84194577e469c851Nki6HvKBbaISksmWvgUPx8_4S0vggmImaD0GkUF9vsw2ZqU2cIMYuaSRzo36AZXY";    

    // declare map with imagery basemap and elevation
    const map = new Map({
        basemap: "arcgis-imagery",
        ground: "world-elevation"
    });

    // declare scene view with map + appropriate center/camera positions
    const view = new SceneView({
        map: map,
        center: [-57.78, 48.83],
        zoom: 6,
        container: "sceneDiv",
        camera: {
            position: [-57.778, 48.834, 725],
            tilt: 80,
            heading: 180
        }
    });

    // NL Protected Areas Layer //

    // create popup template for protected area polygons
    const protectedAreasPopup = {
        title: "Protected Areas",
        content: [{
            type: "fields",
            fieldInfos: [{
                fieldName: "FID",
                label: "Feature ID"
            }, {
                fieldName: "NAME_E",
                label: "Area Name"
            }, {
                fieldName: "TYPE_E",
                label: "Type"
            }, {
                fieldName: "COMMENTS",
                label: "Description"
            }]
        }]
    };

    // create custom renderer for protected area polygons
    const protectedAreasRenderer = {
        type: "simple",
        symbol: {
            type: "simple-fill",
            color: [0, 215, 179, 0.6]
        }
    };

    // add protected area hosted feature layer with custom popup/renderer
    let protectedAreas = new FeatureLayer({
        url: "https://services7.arcgis.com/kM3uHgTzmmLr5Pe8/arcgis/rest/services/protectedareasnl/FeatureServer/0",
        title: "Protected Areas",
        popupTemplate: protectedAreasPopup,
        renderer: protectedAreasRenderer
    });
    map.add(protectedAreas);

    // Proposed Turbine Locations Layer //

    // create 3D web style symbol for turbine locations
    const turbines = new WebStyleSymbol({
        name: "Wind_Turbine",
        styleName: "EsriInfrastructureStyle"
    });

    // create renderer to visualize wind turbine locations
    const turbinesRenderer = {
        type: "simple",
        symbol: turbines
    };

    // add turbine location hosted feature layer with custom renderer
    let turbineLocations = new FeatureLayer({
        url: "https://services7.arcgis.com/kM3uHgTzmmLr5Pe8/arcgis/rest/services/turbinelocations/FeatureServer/0",
        renderer: turbinesRenderer,
        elevationInfo: "on-the-ground",
        title: "Proposed Turbine Locations"
    });
    map.add(turbineLocations);

    // Widgets //

    // add home widget to scene view
    let homeWidget = new Home({
        view: view
    });
    view.ui.add(homeWidget, "top-left");

    // add basemap toggle widget to view w/ topographic map as second choice
    let basemapWidget = new BasemapToggle({
        view: view,
        nextBasemap: "arcgis-topographic"
    });
    view.ui.add(basemapWidget, "top-right");

    // add line of sight analysis widget to view
    let sightWidget = new LineOfSight({
        view: view,
    });

    // allow line of sight to be expanded/collapsed
    const sightExpand = new Expand({
        view: view,
        content: sightWidget,
        expandTooltip: "Line of Sight"
    });
    view.ui.add(sightExpand, "bottom-right");

    // add elevation profile widget to view
    let elevationWidget = new ElevationProfile({
        view: view,
    });
    
    // allow elevation profile widget to be expanded/collapsed
    const elevationExpand = new Expand({
        view: view,
        content: elevationWidget,
        expandTooltip: "Elevation Profile"
    });
    view.ui.add(elevationExpand, "bottom-right");

    // add legend widget to view
    let legendWidget = new Legend({
        view: view
    });
    view.ui.add(legendWidget, "bottom-left");

});