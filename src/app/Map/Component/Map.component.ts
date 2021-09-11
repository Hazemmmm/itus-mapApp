import { statesService } from './../services/states.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { View } from 'ol';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { OSM, TileImage, TileWMS } from 'ol/source';
import { defaults } from 'ol/control';
import { Extent, getCenter } from 'ol/extent';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';

@Component({
  selector: 'app-Map',
  templateUrl: './Map.component.html',
  styleUrls: ['./Map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  map: any;
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
    this.map = new Map({
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
  constructor(
    private states: statesService // private markerService: MarkerService, // private heatmapService: HeatmapService
  ) {}

  ngAfterViewInit(): void {

    this.initMap();
    this.states.getStatesData(this.map);


    // this.onZoomGetExtent();
    // this.markerService.createVectorLayer(this.map);
    // this.states.addHeatMapLayerToMap(this.map);
    // this.heatmapService.getIntersectionHeatMapData(this.map);
  }

  onZoomGetExtent() {
    this.map.on('click', () => {
      console.log(this.map.getView().calculateExtent(this.map.getSize()));
    });
  }

  ngOnInit() {}
}
