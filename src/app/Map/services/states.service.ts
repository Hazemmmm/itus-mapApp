import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Map from 'ol/Map';
import Polygon from 'ol/geom/Polygon';
import { Feature } from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import { StateFeature } from '../models/stateFeature';
import { Style, Text, Fill } from 'ol/style';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class statesService {
  url: string = 'assets/data/states.geojson';
  states_source: VectorSource;
  states_layer: VectorLayer;
  map: Map;
  // stateList: any[]=[];

  private _stateListSource = new BehaviorSubject([]);
  stateList$ = this._stateListSource.asObservable();

  state_style: Style = new Style({
    text: new Text({
      font: 'bold 12px "Open Sans", "Arial Unicode MS", "sans-serif"',
      placement: 'point',
      textBaseline: 'top',
      textAlign: 'center',
      padding: [50, 50, 50, 50],
      fill: new Fill({
        color: 'black',
      }),
    }),
  });

  constructor(private http: HttpClient) {}

  getStatesData(map: Map): void {
    this.http.get(this.url).subscribe((res: any) => {
      // for (let feature of res.features) {
      //   let state_polygon = new Polygon([feature.geometry.coordinates]);
      //   let state: any = new Feature({
      //     geometry: state_polygon,
      //     id: feature.id,
      //     stateCode: feature.properties.STATE_CODE,
      //     sateName: feature.properties.STATE_NAME,
      //   });

      //   this.states_source.addFeatures(state);
      //   this.states_layer.setSource(this.states_source);
      // }
      this.states_source = new VectorSource({
        format: new GeoJSON(),
        url: this.url,
      });
      this.states_layer = new VectorLayer({
        source: this.states_source,
        zIndex: 1,
        // style: this.setStateStyle,
      });

      map.addLayer(this.states_layer);
    });
  }

  setStateStyle = (feature: any) => {
    this.state_style.getText().setText(feature.get('"STATE_NAME"'));
    return this.state_style;
  };

  getStateList() {
    return this.http.get(this.url).pipe(catchError(this.handleError));
  }

  private handleError(err: any) {
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
