import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarburantesListResponse } from '../models/carburantes-list.interface';
import { ComunidadesAutonomasResponse } from '../models/comunidades-list.interface';
import { ProvinciasListResponse } from '../models/provincias-list.interface';

@Injectable({
  providedIn: 'root'
})
export class GasService {

  constructor(private http: HttpClient) { }

  getEeSsList() {
    return this.http.get('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/');
  }

  getCarburantesList(): Observable<CarburantesListResponse>{
    return this.http.get<CarburantesListResponse>('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProductosPetroliferos/')
  }

  getCcAaList(): Observable<ComunidadesAutonomasResponse> {
    return this.http.get<ComunidadesAutonomasResponse>('https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ComunidadesAutonomas/')
  }

  getProvinciasPorComunidad(idComunidad: string): Observable<ProvinciasListResponse> {
    return this.http.get<ProvinciasListResponse>(`https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/Listados/ProvinciasPorComunidad/${idComunidad}`);
  }
}
