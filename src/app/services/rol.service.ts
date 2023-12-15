import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroments/enviroment.prod';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rol } from '../models/rol.model';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private baseUrl = enviroment.rolUrl;

  constructor(private http: HttpClient) { }

  findAll(): Observable<Rol[]>{
    return this.http.get<Rol[]>(`${this.baseUrl}`);
  }

  findById(id: number): Observable<Rol>{
    return this.http.get<Rol>(`${this.baseUrl}/${id}`);
  }

  save(rol: Rol): Observable<Rol>{
    return this.http.post<Rol>(`${this.baseUrl}`, rol);
  }

  update(id: number, rol: Rol): Observable<Rol>{
    return this.http.put<Rol>(`${this.baseUrl}/${id}`, rol);
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
