import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClienteModel } from '../models/cliente.model';
import { Observable,throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  SRV: string = 'http://backend';

  constructor(private http: HttpClient) { }

  buscar (id: any) : Observable<ClienteModel>{
    return this.http.get<ClienteModel>(`${this.SRV}/cliente/${id}`)
    .pipe(retry(1), catchError(this.handleError));
  }

  filtrar(parametros : any, pag:number, lim: number) : Observable<ClienteModel[]> {
    let params = new HttpParams;
    for(const prop in parametros){
      if(prop){
        params = params.append(prop, parametros[prop])
      }
    }
    //this.http.get<ClienteModel>(this.SRV + '/cliente/' + pag + '/' + lim)
    return this.http.get<ClienteModel[]>(`${this.SRV}/cliente/${pag}/${lim}`,{params:params}) 
    
  }

  guardar(datos: any, id?: any): Observable<any>{
    if(id){//editar
      return this.http.put(`${this.SRV}/cliente/${id}`,datos) 
      .pipe(retry(1), catchError(this.handleError));
    }else{//crear
      return this.http.post(`${this.SRV}/cliente`,datos) 
      .pipe(retry(1), catchError(this.handleError));
    }
  }
//se trabajó en clases
  eliminar(id: any) : Observable<any>{
      return this.http.delete(`${this.SRV}/cliente/${id}`)
      .pipe(retry(1), catchError(this.handleError));
  }
  private handleError(error:any){
    return throwError(
      ()=>{
        return error.status;
      }
    )
  }
}