import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {environment} from "../../environment/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthorService {

  constructor(private httpClient: HttpClient) { }
  getAuthor() {
    return this.httpClient.get<any>(environment.api_url+'/author').pipe(
      catchError((error: any): Observable<any> => {
        console.log(error)
        if (error.status === 404) {
          console.log(error.error.message || 'No employees found.');
        } else {
          console.log(error.error.message || 'An error occurred while fetching employees.');
        }
        return of([]);
      })
    );
  }
  getAuthorView(id:string){
    return this.httpClient.get(`${environment.api_url}/author/${id}`).pipe(catchError((error: any, caught: Observable<any>): Observable<any> => {
      if(error.status === 406){
        console.log(error.error.message);
      }else{
        console.log(error.error.error);
      }
      return of(error.error);
    }));
  }

}
