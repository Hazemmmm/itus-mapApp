import { statesService } from './../services/states.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Feature, MapBrowserEvent, Overlay, View } from 'ol';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { OSM, TileImage, TileWMS } from 'ol/source';
import { defaults } from 'ol/control';
import { Extent, getCenter } from 'ol/extent';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import { PoiService } from '../services/poi.service';
import Layer from 'ol/layer/Layer';
import Point from 'ol/geom/Point';
import { Coordinate, toStringHDMS } from 'ol/coordinate';
import { toLonLat } from 'ol/proj';

@Component({
  selector: 'app-Map',
  templateUrl: './Map.component.html',
  styleUrls: ['./Map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  map: any;
  overlay: Overlay;
  content: HTMLElement;
  featureTitle: string;
  featureID: number;
  featureDesc: string;
  featureObjectID: number;
  featureType: string;

  australiaExtent: Extent = [
    -262.2318712410088, -42.414667622100076, -188.84319936600878,
    -9.060175434600076,
  ];
  test_soruce: VectorSource;
  test_layer: VectorLayer;
  osm: TileLayer = new TileLayer({
    source: new OSM(),
  });

  private initMap(): void {
    this.overlay = new Overlay({
      element: <HTMLDivElement>document.getElementById('popup'),
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
    });

    this.map = new Map({
      overlays: [this.overlay],
      controls: defaults({ attribution: false }),
      target: 'map',
      layers: [this.osm],
      view: new View({
        extent: this.australiaExtent,
        center: getCenter(this.australiaExtent),
        projection: 'EPSG:4326',
        zoom: 5,
        maxZoom: 15,
        minZoom: 5,
      }),
    });
  }
  constructor(private states: statesService, private poi: PoiService) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.states.getStatesData(this.map);
    this.poi.getPOIData(this.map);
    this.map.on('click', this.getFeaturePopUp);
  }

  onZoomGetExtent() {
    this.map.on('click', () => {
      console.log(this.map.getView().calculateExtent(this.map.getSize()));
    });
  }
  closePopUp() {
    var closer = <HTMLDivElement>document.getElementById('popup-closer');
    this.overlay.setPosition(undefined);
    closer.blur();
    return false;
  }
  getFeaturePopUp = (e: any) => {
    var container = <HTMLDivElement>document.getElementById('popup');
    var content = <HTMLDivElement>document.getElementById('popup-content');
    const closer = document.getElementById('popup-closer');

    let feature = this.map.forEachFeatureAtPixel(
      e.pixel,
      (feature: Feature) => {
        return feature;
      }
    );

    if (feature && feature.getGeometry().getType() === 'Point') {
      console.log(feature.getKeys());
      let point: Point = <Point>feature.getGeometry();
      let coords: Coordinate = point.getCoordinates();
      const coordinate = e.coordinate;
      this.featureTitle = feature.get('title');
      this.featureID = feature.get('FID');
      this.featureDesc = feature.get('desc');
      this.featureObjectID = feature.get('ObjectID');
      this.featureType = feature.get('types');

      this.overlay.setPosition(coordinate);
    } else {
      this.overlay.setPosition(undefined);
    }
  };

  ngOnInit() {}
}
