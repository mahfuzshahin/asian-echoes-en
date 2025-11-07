import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
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
  getLatestNewsFromEachCategory(){
    return this.httpClient.get(environment.api_url +'/news/latest-by-category').pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
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
  getCategorySectionPaginated(slug: string, page: number = 1, limit: number = 8): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.httpClient
      .get(`${environment.api_url}/news/category-section/paginated/${slug}`, { params })
      .pipe(
        catchError((error: any) => {
          if (error.status === 406) {
            console.log(error.error.message);
          } else {
            console.log(error.error.error);
          }
          return of(error.error);
        })
      );
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
  getPaginatedGalleries(limit:any, page:any){
    return this.httpClient.get(environment.api_url +'/news-gallery/paginated?limit='+limit+'&page='+page).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
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

  getPaginatedVideos(limit:any, page:any){
    return this.httpClient.get(environment.api_url +'/newsVideo/paginated?limit='+limit+'&page='+page).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      if(error.status === 406){
        console.log(error.error.message);
      }else{
        console.log(error.error.error);
      }
      return of(error.error);
    }));
  }

  extractYouTubeId(url: string): string {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : '';
  }

  getYouTubeEmbedUrl(youtubeUrl: string): string {
    const videoId = this.extractYouTubeId(youtubeUrl);
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  getYouTubeWatchUrl(youtubeUrl: string): string {
    const videoId = this.extractYouTubeId(youtubeUrl);
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
}
