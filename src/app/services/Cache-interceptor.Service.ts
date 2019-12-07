import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from './auth.service';
import { catchError, tap } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import { HttpCacheservice } from './Cache-Service';
import { Httprequestmodel } from '../models/Httprequestmodel';
@Injectable()
export class CacheInterceptorService implements HttpInterceptor {
    constructor(
        public AuthServices: AuthenticationService,
        private cacheservice: HttpCacheservice
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        console.log("This is Cache Interceptor");
        var gethttpreq = null;
        if (this.cacheservice.cacherequest.length > 0)
            gethttpreq = this.cacheservice.cacherequest.find(x => x.respparam == JSON.stringify(req.body) && x.URL == req.urlWithParams) || null;
        // if (cachedresponse != null && cachedresponse.respparam === JSON.stringify(req)) {
        //     console.log("Response From cache");
        //     return Observable.of(cachedresponse.event);
        // }
        if (gethttpreq) {
            if (gethttpreq.URL.indexOf('Tool/GetAllBookMarksByUser') == -1 && gethttpreq.URL.indexOf('MyMap/GetMyMapById')==-1 ) {
                console.log("Response From cache");
                gethttpreq.event.body = JSON.parse(gethttpreq.HttpResponseData);
                return Observable.of(gethttpreq.event);
            }
        }
        // return next.handle(req).do(event => {
        //     if (event instanceof HttpResponse) {
        //         this.cacheservice[req.urlWithParams] = event;
        //         console.log("Response from server");
        //     }
        // });
        return next.handle(req).pipe(
            tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    if (req.urlWithParams.indexOf('DrawTools/GetDrawToolItems')==-1) {                     
                   
                    if (event.body.Authorization_success == false) {
                        this.AuthServices.resirecttoLogin_ReloadthePage();
                    }
                    //this.cacheservice[req.urlWithParams] = event;
                    var storehttprequest = new Httprequestmodel()
                    storehttprequest.event = event;
                    storehttprequest.respparam = JSON.stringify(req.body);
                    storehttprequest.URL = req.urlWithParams;
                    storehttprequest.HttpResponseData = JSON.stringify(event.body);
                    this.cacheservice.cacherequest.push(storehttprequest);
                }
                    // if (!this.cacheservice["Httpreqstored"]) {
                    //     //JSON.parse(JSON.stringify(event.body));

                    // }
                    // else { this.cacheservice["Httpreqstored"].push({ event: event, respparam: JSON.stringify(req) }) }

                    // this.cacheservice[req.urlWithParams] = { event: event, respparam: JSON.stringify(req) };
                    console.log("Response from server");
                    // else {
                    //     console.log(event.status);
                    // }
                }
            }, error => {
                // http response status code
                console.log("----response----");
                console.log("status code:");
                console.log(error.status);
                console.log(error.message);
                console.log("--- end of response---");
                //this.AuthServices.resirecttoLogin_ReloadthePage();
            })
        )
    }
}