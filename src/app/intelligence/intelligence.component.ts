import { Component, OnInit, AfterViewInit, Injector } from '@angular/core';
import { RootLayout } from '../@pages/layouts/root/root.component';
import { PipelineActivityProjectsComponent } from './pipeline-activity-projects/pipeline-activity-projects.component'
declare var jquery: any;
declare var $: any;
declare var google: any;
@Component({
  selector: 'app-intelligence',
  templateUrl: './intelligence.component.html',
  styleUrls: ['./intelligence.component.scss'],
  providers: [PipelineActivityProjectsComponent]
})
export class IntelligenceComponent extends RootLayout implements OnInit {
 // PipelineActivityComponent: PipelineActivityProjectsComponent
  ngOnInit() {    
    setTimeout(() => {
      $(".page-container").css('padding-left', '0px');
     // this.PipelineActivityComponent = this.Injector.get(PipelineActivityProjectsComponent);
    }, 100);

  }
  // public _IsTabActive = {
  //   Company: true,
  //   PipelineActivity: false
  // }
  // Tabclick(TabActive) {  
  //   switch (TabActive) {
  //     case "PipelineActivity":
  //     case this._IsTabActive.PipelineActivity == false:  
  //       this.PipelineActivityComponent.GetAllPipelineActivityFilterOptions();
  //       this._IsTabActive.PipelineActivity = true;
  //       break;
  //   }

  // }
}
