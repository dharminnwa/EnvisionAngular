import { Injectable } from '@angular/core';

@Injectable()
export class IntelligenceService {

    constructor() { }
    
    setEnitiesName(SortName) {
        if (SortName == "Fac Own") {
            return "Facility Owner";
        }
        else if (SortName == "Fac Opr") {
            return "Facility Operator"
        }
        else if (SortName == "Sys Own") {
            return "System Owner"
        }
        else if (SortName == "Sys Opr") {
            return "System Operator"
        }
        else if (SortName == "PL Own") {
            return "Pipeline Owner"
        }
        else if (SortName == "PL Opr") {
            return "Pipeline Operator"
        }
        else if (SortName == "Trans Own") {
            return "Transmission Owner"
        }
        else {
            return SortName;
        }

    }   
}
