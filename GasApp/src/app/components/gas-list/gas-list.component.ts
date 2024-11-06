import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { GasService } from '../../services/gas.service';
import { Gasolinera } from '../../models/gas-item.dto';
import { CarburantesList } from '../../models/carburantes-list.interface';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ComunidadesAutonomas } from '../../models/comunidades-list.interface';

@Component({
  selector: 'app-gas-list',
  templateUrl: './gas-list.component.html',
  styleUrl: './gas-list.component.css'
})
export class GasListComponent implements OnInit{
  listaGasolineras: Gasolinera[] = [];
  listaCarburantes: CarburantesList[] = [];
  listaComunidades: ComunidadesAutonomas[] = [];

  constructor(private gasService: GasService) {}

  ngOnInit(): void {
      this.gasService.getEeSsList().subscribe(resp => {
        const respuestaEnString = JSON.stringify(resp);
        let parsedData;
        try {
          parsedData = JSON.parse(respuestaEnString);
          let arrayGasolineras = parsedData['ListaEESSPrecio'];
          this.listaGasolineras = this.cleanProperties(arrayGasolineras);
        } catch (error) {
          console.error('Error parsing JSON:', error);
        }
      });

      this.gasService.getCarburantesList().subscribe((resp) => {
        this.listaCarburantes = resp;
      });

      this.gasService.getCcAaList().subscribe((resp) => {
        this.listaComunidades = resp;
      });
      

    }

    private cleanProperties(arrayGasolineras: any) {
      let newArray: Gasolinera[] = [];
      arrayGasolineras.forEach((gasolineraChusquera: any) => {
        let gasolinera = new Gasolinera(
          gasolineraChusquera['IDEESS'],
          gasolineraChusquera['Rótulo'],
          gasolineraChusquera['Localidad'],
          gasolineraChusquera['Municipio'],
          gasolineraChusquera['Dirección'],
          gasolineraChusquera['Horario'],
          gasolineraChusquera['Precio Gasoleo A'],
          gasolineraChusquera['Precio Gasoleo B'],
          gasolineraChusquera['Precio Gasolina 95 E5'],
          gasolineraChusquera['Precio Gasolina 98 E5'],
          gasolineraChusquera['Precio Hidrogeno'],          
        );

        newArray.push(gasolinera);
      });
      return newArray;
    }

    private offcanvasService = inject(NgbOffcanvas);

    openEnd(content: TemplateRef<any>) {
      this.offcanvasService.open(content, { position: 'end' });
    }

    disabled = false;
    max = 5;
    min = 0;
    showTicks = false;
    step = 0.2;
    thumbLabel = true;
    value = 0;
  }

