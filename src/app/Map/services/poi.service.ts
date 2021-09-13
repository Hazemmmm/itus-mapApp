import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import { Icon, Style } from 'ol/style';
import { FeatureType } from '../models/featureType';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoiService {
  url: string = 'assets/data/poi.geojson';
  poi_source: VectorSource;
  poi_layer: VectorLayer;
  map: Map;
  // featureProps: FeatureType;
  public featureProps: Observable<FeatureType>;

  poi_style: Style = new Style({
    image: new Icon({
      anchor: [0.5, 0.96],
      crossOrigin: 'anonymous',
      src: 'https://openlayers.org/en/v4.6.5/examples/data/icon.png',
      // src: './assets/images/hospital.png',
      imgSize: [40, 40],
    }),
  });

  constructor(private http: HttpClient) {}

  getPOIData(map: Map): void {
    this.http.get(this.url).subscribe((res: any) => {
      this.poi_source = new VectorSource({
        format: new GeoJSON({
          geometryName: 'Point',
          extractGeometryName: true,
        }),
        url: this.url,
      });
      this.poi_layer = new VectorLayer({
        source: this.poi_source,
        style: this.setPOIStyle,
        zIndex: 3,
      });

      map.addLayer(this.poi_layer);
    });
  }

  setPOIStyle = (feature: any) => {
    return this.poi_style;
  };

  getPOITypes(): Observable<FeatureType> {
    this.http.get(this.url).subscribe((res: any) => {
      for (let feature of res.features) {
        this.featureProps = feature.properties;
      }
    });

    return this.featureProps;
  }
}
