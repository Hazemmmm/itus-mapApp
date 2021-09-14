import { InteractionDataService } from './../../Map/services/interaction-data.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { delay } from 'rxjs/operators';
import { BreakpointObserver } from '@angular/cdk/layout';
import { statesService } from 'src/app/Map/services/states.service';
import { StateFeature } from 'src/app/Map/models/stateFeature';

const stateList: any[] = [];
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.css'],
})
export class SideBarComponent implements OnInit {
  [x: string]: any;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  stateFromList: any[];
  state_id: any;
  constructor(
    private observer: BreakpointObserver,
    private state: statesService,
    private interactionDataService: InteractionDataService
  ) {}

  ngOnInit(): void {
    this.stateFromList = stateList;
    this.getStateList();
  }

  getStateList() {
    this.state.getStateList().subscribe((res: any) => {
      for (let state of res.features) {
        this.stateList = state.properties;
        this.state_id = this.stateList['STATE_CODE'];
        this.stateFromList.push(this.stateList);
      }
    });
  }

  onChange(event: any) {
    console.log(event.value);
  }

  ngAfterViewInit() {
    this.observer
      .observe(['(max-width: 800px)'])
      .pipe(delay(1))
      .subscribe((res) => {
        if (res.matches) {
          this.sidenav.mode = 'over';
          this.sidenav.close();
        } else {
          this.sidenav.mode = 'side';
          this.sidenav.open();
        }
      });
  }
  onSelectDistrict(value: any) {
    this.interactionDataService.sendListValue(value);
  }
}
