import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import GeoJSON from 'ol/format/GeoJSON';
import Polygon from 'ol/geom/Polygon';

import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import VectorLayer from 'ol/layer/Vector';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  vectorSource: string = '/assets/data/vector.geojson';

  vectorSource1: VectorSource = new VectorSource();
  vectorLayer1: VectorLayer = new VectorLayer();

  constructor(private http: HttpClient) {}

  createVectorLayer(map: any): void {
    this.http.get(this.vectorSource).subscribe((res: any) => {
      for (const c of res.features) {
        var features: any = new Feature({
          geometry: new Polygon(c.geometry.coordinates),
        });
        this.vectorSource1.addFeatures(features);
        this.vectorLayer1.setSource(this.vectorSource1);
      }

    });
  }

  addHeatMapLayerToMap(map: any): void {

    map.addLayer(this.vectorLayer1);
  }
}
