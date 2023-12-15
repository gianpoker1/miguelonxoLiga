import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroments/enviroment.prod';
import { HttpClient } from '@angular/common/http';
import { UsuarioRol } from '../models/usuarioRol.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioRolService {

  private baseUrl = enviroment.usuarioRolUrl;

  constructor(private http: HttpClient) { }

  findAll(): Observable<UsuarioRol[]>{
    return this.http.get<UsuarioRol[]>(`${this.baseUrl}`);
  }

  findById(id: number): Observable<UsuarioRol>{
    return this.http.get<UsuarioRol>(`${this.baseUrl}/${id}`);
  }

  save(usuarioRol: UsuarioRol): Observable<UsuarioRol>{
    return this.http.post<UsuarioRol>(`${this.baseUrl}`, usuarioRol);
  }

  update(id: number, usuarioRol: UsuarioRol): Observable<UsuarioRol>{
    return this.http.put<UsuarioRol>(`${this.baseUrl}/${id}`, usuarioRol);
  }

  delete(id: number): Observable<void>{
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
