import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import * as _ from 'lodash';
@Injectable()
export class GlobalSearchServiceService {
    private allCompanyProfile = new BehaviorSubject<any>(null);
    allCompanyProfileData = this.allCompanyProfile;

    constructor() {}
    
    setCompanyProfileData(_allCompany: any) {
        this.allCompanyProfile.next(_allCompany);
    }
}