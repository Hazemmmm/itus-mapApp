import  VectorSource  from 'ol/source/Vector';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import VectorLayer from 'ol/layer/Vector';

@Injectable({
  providedIn: 'root',
})
export class HeatmapService {
  url: string = '/assets/data/vector.geojson';
  vectorSource1: VectorSource = new VectorSource();
  vectorLayer1: VectorLayer = new VectorLayer();

  constructor(private http: HttpClient) {}

  getIntersectionHeatMapData(map: any): void {
    this.http.get(this.url).subscribe((res: any) => {
      console.log(res);
    });
  }

  sliderHandlerHeatMap() {

  }
}
