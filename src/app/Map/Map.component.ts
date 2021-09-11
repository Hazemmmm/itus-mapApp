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
        center: [46.61924841272188, 24.788532584113987],
        projection: 'EPSG:3857',
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
