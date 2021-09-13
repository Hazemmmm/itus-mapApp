import { Injectable } from '@angular/core';
import { PoiService } from './poi.service';

@Injectable({
  providedIn: 'root',
})
export class InteractionDataService {
  constructor(private poiService: PoiService) {}

  getPoiTypes() {
    this.poiService.getPOITypes().subscribe((data) => {
      console.log(data);
    });
  }
}
