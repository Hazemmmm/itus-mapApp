import { Component, OnInit, AfterViewInit } from '@angular/core';
import { View } from 'ol';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import { OSM, TileImage, TileWMS } from 'ol/source';
import { MarkerService } from '../marker.service';
import { HeatmapService } from '../heatmap.service';

@Component({
  selector: 'app-Map',
  templateUrl: './Map.component.html',
  styleUrls: ['./Map.component.css'],
})
export class MapComponent implements OnInit, AfterViewInit {
  map: any;

  osm: TileLayer = new TileLayer({
    source: new OSM(),
  });

  private initMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [this.osm],
      view: new View({
        center: [-21.56232137547406, 132.80792296548023],
        projection: 'EPSG:4326',
        zoom: 3,
      }),
    });
  }
  constructor(
    private markerService: MarkerService,
    private heatmapService: HeatmapService
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
    this.markerService.createVectorLayer(this.map);
    this.markerService.addHeatMapLayerToMap(this.map);
    this.heatmapService.getIntersectionHeatMapData(this.map);
    this.setOpacity;

    // console.log(this.map.getLayers());
  }

  setOpacity(value: any) {
    console.log({ value });
    // debugger;
    this.osm.setOpacity(value);
  }

  ngOnInit() {}
}
