import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { InteractionDataService } from '../Map/services/interaction-data.service';
import { PoiService } from '../Map/services/poi.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent implements OnInit {
  constructor(
    private poi: PoiService,
    private interActionDataService: InteractionDataService
  ) {}
  pois: any[] = [
    { id: 1, viewValue: 'Hostpitals' },
    { id: 2, viewValue: 'Markets' },
    { id: 3, viewValue: 'Restuarant' },
  ];

  ngOnInit(): void {}
  changeClient(event: any) {
    this.interActionDataService.sendFeatureId(event.value);
  }
}
