import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { PoiService } from './poi.service';

@Injectable({
  providedIn: 'root',
})
export class InteractionDataService {
  private _featureIdSource = new Subject<number>();
  private _districtValue = new Subject<any>();

  featureIdSource$ = this._featureIdSource.asObservable();

  districtValue$ = this._districtValue.asObservable();

  constructor(private poiService: PoiService) {}

  sendFeatureId(value: number): void {
    this._featureIdSource.next(value);
  }
  sendListValue(value: any): void {
    this._districtValue.next(value);
  }
}
