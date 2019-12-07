import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpResponse, HttpHandler, HttpEvent, } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AuthenticationService } from './auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(
        public AuthServices: AuthenticationService,
    ) { }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if (request.url.includes('/User/LogInUser')) {
            return next.handle(request);
        }
        const token: string = this.AuthServices.GetAuthTokan();
        //set the content type, accept type and token in API. This only handle the API request.
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: token
                }
            });
        }
        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }
        return next.handle(request);
        // return next.handle(request).pipe(
        //     tap(event => {
        //         if (event instanceof HttpResponse) {
        //             if (event.body.Authorization_success == false) {
        //                 this.AuthServices.resirecttoLogin_ReloadthePage();
        //             }
        //             // else {
        //             //     console.log(event.status);
        //             // }
        //         }
        //     }, error => {
        //         // http response status code
        //         console.log("----response----");
        //         console.log("status code:");
        //         console.log(error.status);
        //         console.log(error.message);
        //         console.log("--- end of response---");
        //         //this.AuthServices.resirecttoLogin_ReloadthePage();
        //     })
        // )
    }

}