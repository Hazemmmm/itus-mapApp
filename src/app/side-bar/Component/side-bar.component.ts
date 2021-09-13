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
  states: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];
  stateFromList: any[];

  constructor(
    private observer: BreakpointObserver,
    private state: statesService
  ) {}

  ngOnInit(): void {
    this.stateFromList = stateList;
    this.getStateList();
  }

  getStateList() {
    this.state.getStateList().subscribe((res: any) => {
      for (let state of res.features) {
        this.stateList = state.properties;
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
  onSelectDistrict(x: any) {
    console.log(x);
  }
}
