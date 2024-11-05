import { Injectable } from '@angular/core';
import { ListaEeSsPrecioResponse } from '../models/gas-list.interface';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GasService {

  constructor(private http: HttpClient) { }

  getEeSsList() {
    return this.http.get('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/');
  }
}
