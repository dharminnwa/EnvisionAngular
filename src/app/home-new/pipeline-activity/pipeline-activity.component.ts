import { Component, OnInit } from '@angular/core';
import { MapServiceService } from '../../services/map-service.service';
import { HttpRequestService } from '../../services/all-http-request.service';
@Component({
  selector: 'app-pipeline-activity',
  templateUrl: './pipeline-activity.component.html',
  styleUrls: ['./pipeline-activity.component.scss']
})
export class PipelineActivityComponent implements OnInit {
  plActivities: any = [];
  constructor(private httpRequest: HttpRequestService, private MapServiceService: MapServiceService) { }

  ngOnInit() {
    this.plActivities = this.MapServiceService.pipeActivityData.getValue();
    if (!this.plActivities) {
      this.GetPipelineActivityLinks();
    }
  }

  GetPipelineActivityLinks() {
    this.httpRequest._NodeGetPipelineActivities().subscribe(data => {      
      if (data._Issuccess) {
        var jsonData = data.PipelineActivitiesData;
        this.plActivities = jsonData;
        this.MapServiceService.setPipeActivity(this.plActivities);
      }
    },
      error => {
        console.log(error);
      });
  }
}
