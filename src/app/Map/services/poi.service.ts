import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import GeoJSON from 'ol/format/GeoJSON';
import { Icon, Style } from 'ol/style';
import { FeatureType } from '../models/featureType';
import { Observable } from 'rxjs';
import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';

@Injectable({
  providedIn: 'root',
})
export class PoiService {
  url: string = 'assets/data/poi.geojson';
  poi_source: VectorSource;
  poi_layer: VectorLayer;
  map: Map;
  features: any;
  featureList: any;
  featureFromList: any;
  // hiddenSource: VectorSource;
  // hiddenLayer: VectorLayer;
  hospitalFeatures: [];
  martketFeatures: [];
  restaurantFeatures: [];

  public featureProps: Observable<FeatureType>;

  poi_style: Style = new Style({
    image: new Icon({
      color: 'orange',
      anchor: [0.5, 0.5],
      crossOrigin: 'anonymous',
      src: 'assets/hospital.png',
      imgSize: [30, 30],
    }),
  });
  hiddenSource = new VectorSource();
  hiddenLayer = new VectorLayer({
    source: this.hiddenSource,
    visible: true,
    zIndex: 10,
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

      // map.addLayer(this.poi_layer);
    });
  }

  setPOIStyle = (feature: any) => {
    return this.poi_style;
  };

  handleFilterPoiLayer(): void {}

  getPOITypes(): Observable<any> {
    this.http.get(this.url).subscribe((res: any) => {
      for (let feature of res.features) {
        this.featureProps = feature.properties;
      }
    });

    return this.featureProps;
  }

  getPoiData(): Observable<any> {
    return this.http.get(this.url);
  }

  getPoiFeaturesById(id: number): void {
    this.poi_source.getFeatures().filter((features) => {
      if (features.get('typesID') == id) {
        this.featureList = features;
        this.poi_layer.setVisible(false);

        this.hiddenSource.addFeatures(this.featureList);
      } else {
        this.poi_layer.setVisible(true);
      }
    });
  }
}
