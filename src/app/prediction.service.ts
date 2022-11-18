import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { BehaviorSubject, Observable, of, throwError } from 'rxjs';

import { catchError, map, tap } from 'rxjs/operators';
import { PredictionResponse } from './model/model';

@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  constructor(private http: HttpClient) { }

  getDataforUID(uid: string): Observable<{uid:string, id:string, name:string}> {
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.get<{uid:string, id:string, name:string}>(environment.apiAddress + 'getUser/'+uid, config);
  }

  createNewUser(uid:string, name:string){
    const config = { headers: new HttpHeaders().set('Content-Type', 'application/json') };
    return this.http.post<{uid:string, id:string}>(environment.apiAddress + 'user', JSON.stringify({ uid, name }), config);
  }

  sendImageData(uid: string, file: Blob | File, isOldUser=false) {
    let formData = new FormData();
    formData.append('image', file);
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return this.http.post(environment.apiAddress + 'image/upload/'+uid +'/'+isOldUser, formData, { headers });
  }
  
  sendNewImageData(uid: string, file: Blob | File) {
    let formData = new FormData();
    formData.append('image', file);
    let headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    return this.http.post(environment.apiAddress + 'image/upload-reference/'+uid, formData, { headers });
  }
}