import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {environment} from "../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class FrontendService{

  constructor(private httpClient: HttpClient) { }
  getLatestNews(){
    return this.httpClient.get(environment.api_url +'/news/latest').pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      if(error.status === 406){
        console.log(error.error.message);
      }else{
        console.log(error.error.error);
      }
      return of(error.error);
    }));
  }
  getNewsBySlug(slug:string){
    return this.httpClient.get(`${environment.api_url}/news/slug/${slug}`).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      if(error.status === 406){
        console.log(error.error.message);
      }else{
        console.log(error.error.error);
      }
      return of(error.error);
    }));
  }
  getNewsByRelated(id:string){
    return this.httpClient.get(`${environment.api_url}/news/related/${id}`).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      if(error.status === 406){
        console.log(error.error.message);
      }else{
        console.log(error.error.error);
      }
      return of(error.error);
    }));
  }
  getNewsByCategory(id:string){
    return this.httpClient.get(`${environment.api_url}/news/category/${id}`).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      if(error.status === 406){
        console.log(error.error.message);
      }else{
        console.log(error.error.error);
      }
      return of(error.error);
    }));
  }
  getCategorySection(slug:string){
    return this.httpClient.get(`${environment.api_url}/news/category-section/${slug}`).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      if(error.status === 406){
        console.log(error.error.message);
      }else{
        console.log(error.error.error);
      }
      return of(error.error);
    }));
  }

  getLatestNewsGallery(){
    return this.httpClient.get(environment.api_url +'/news-gallery/latest').pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      if(error.status === 406){
        console.log(error.error.message);
      }else{
        console.log(error.error.error);
      }
      return of(error.error);
    }));
  }
  getLatestVideos(){
    return this.httpClient.get(environment.api_url +'/newsVideo/latest').pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      if(error.status === 406){
        console.log(error.error.message);
      }else{
        console.log(error.error.error);
      }
      return of(error.error);
    }));
  }
}
