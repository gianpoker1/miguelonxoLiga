import { Injectable } from '@angular/core';
import { enviroment } from '../../enviroments/enviroment.prod';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private baseUrl = enviroment.registroUrl;

  constructor(private http: HttpClient) { }

  save(usuario: Usuario, tipo: string): Observable<Usuario>{
    const payload = {
      usuario: {...usuario},
      tipo: tipo
    };
    return this.http.post<Usuario>(this.baseUrl, payload);
  }
}
