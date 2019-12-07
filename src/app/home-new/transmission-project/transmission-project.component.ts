import { Component, OnInit } from '@angular/core';
import { MapServiceService } from '../../services/map-service.service';
import { HttpRequestService } from '../../services/all-http-request.service';

@Component({
  selector: 'app-transmission-project',
  templateUrl: './transmission-project.component.html',
  styleUrls: ['./transmission-project.component.scss']
})
export class TransmissionProjectComponent implements OnInit {
  LayerLoader: boolean = false;
  transProjects: any = [];
  constructor(
    private httpService: HttpRequestService, private MapServiceService: MapServiceService) { }

  ngOnInit() {
    this.transProjects = this.MapServiceService.transProjectData.getValue();
    if (!this.transProjects) {
      this.GetTransProjectLinks();
    }
  }

  GetTransProjectLinks() {
    this.LayerLoader = true;
    this.httpService._NodeGetTransProjects().subscribe(data => {      
      if (data._Issuccess) {
        var jsonData = data.TransProjectsData;
        this.transProjects = jsonData;
        this.MapServiceService.setTransProject(this.transProjects);
      }      
      this.LayerLoader = false;
    },
      error => {
        console.log(error);
        this.LayerLoader = false;
      });
  }
}
