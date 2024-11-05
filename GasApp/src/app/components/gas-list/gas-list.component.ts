import { Component, OnInit } from '@angular/core';
import { GasService } from '../../services/gas.service';
import { Gasolinera } from '../../models/gas-item.dto';

@Component({
  selector: 'app-gas-list',
  templateUrl: './gas-list.component.html',
  styleUrl: './gas-list.component.css'
})
export class GasListComponent implements OnInit{
  listaGasolineras: Gasolinera[] = [];



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
  }

