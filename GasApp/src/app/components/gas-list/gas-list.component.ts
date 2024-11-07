import { Component, inject, Input, OnInit, TemplateRef } from '@angular/core';
import { GasService } from '../../services/gas.service';
import { Gasolinera } from '../../models/gas-item.dto';
import { CarburantesList } from '../../models/carburantes-list.interface';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ComunidadesAutonomas } from '../../models/comunidades-list.interface';

@Component({
  selector: 'app-gas-list',
  templateUrl: './gas-list.component.html',
  styleUrls: ['./gas-list.component.css']
})
export class GasListComponent implements OnInit {
  listaGasolineras: Gasolinera[] = [];
  filteredGasolineras: Gasolinera[] = [];
  listaCarburantes: CarburantesList[] = [];
  listaComunidades: ComunidadesAutonomas[] = [];

  selectedCarburantes: string[] = []; 
  selectedComunidades: string[] = [];

  searchTerm: string = '';
  noResultsMessage: string | undefined;

  max = 5;
  min = 0;
  step = 0.2;
  thumbLabel = true;
  @Input() precioMinimo = 0;
  @Input() precioMaximo = 0;
  

  constructor(private gasService: GasService) {}

  ngOnInit(): void {
    this.gasService.getEeSsList().subscribe(resp => {
      const respuestaEnString = JSON.stringify(resp);
      let parsedData;
      try {
        parsedData = JSON.parse(respuestaEnString);
        let arrayGasolineras = parsedData['ListaEESSPrecio'];
        this.listaGasolineras = this.cleanProperties(arrayGasolineras);
        this.filteredGasolineras = this.listaGasolineras;
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

  private cleanProperties(arrayGasolineras: any): Gasolinera[] {
    let newArray: Gasolinera[] = [];
    arrayGasolineras.forEach((gasolineraChusquera: any) => {
      let gasolinera = new Gasolinera(
        gasolineraChusquera['IDEESS'],
        gasolineraChusquera['Rótulo'],
        gasolineraChusquera['Localidad'],
        gasolineraChusquera['Municipio'],
        gasolineraChusquera['Provincia'],
        gasolineraChusquera['Dirección'],
        gasolineraChusquera['Horario'],
        this.corregirPrecio(gasolineraChusquera['Precio Gasoleo A']),
        this.corregirPrecio(gasolineraChusquera['Precio Gasoleo B']),
        this.corregirPrecio(gasolineraChusquera['Precio Gasolina 95 E5']),
        this.corregirPrecio(gasolineraChusquera['Precio Gasolina 98 E5']),
        this.corregirPrecio(gasolineraChusquera['Precio Hidrogeno']),
        gasolineraChusquera['C.P.']
      );
      newArray.push(gasolinera);
    });
    return newArray;
  }

  corregirPrecio(precio: string): number {
    return parseFloat(precio.replace(',', '.')) || 0;
  }

  buscarGasolineras(): void {
    let filtered = this.listaGasolineras;

    if (this.searchTerm != '') {
      filtered = filtered.filter(gasolinera =>
        gasolinera.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        gasolinera.localidad.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        gasolinera.municipio.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        gasolinera.cp.toString().includes(this.searchTerm)
      );
    }

    this.filteredGasolineras = filtered;
    if (filtered.length == 0) {
      this.noResultsMessage = 'No se encontraron resultados para la búsqueda.';
    } else {
      this.noResultsMessage = '';
    }
  }

  aplicarFiltros(): void {
    let filtered = this.listaGasolineras;
    
    filtered = filtered.filter(gasolinera =>
      gasolinera.precioGasolina95E5 >= this.precioMinimo && gasolinera.precioGasolina95E5 <= this.precioMaximo
    );

    if (this.selectedCarburantes.length > 0) {
      filtered = filtered.filter(gasolinera => {
        return this.selectedCarburantes.some(carburante => {
          switch (carburante) {
            case 'Gasoleo A':
              return gasolinera.precioGasoleoA > 0;
            case 'Gasoleo B':
              return gasolinera.precioGasoleoB > 0;
            case 'Gasolina 95 E5':
              return gasolinera.precioGasolina95E5 > 0;
            case 'Gasolina 98 E5':
              return gasolinera.precioGasolina98E5 > 0;
            case 'Hidrógeno':
              return gasolinera.precioHidrogeno > 0;
            default:
              return false;
          }
        });
      });
    }

    if (this.selectedComunidades.length > 0) {
      filtered = filtered.filter(gasolinera => 
        this.selectedComunidades.includes(gasolinera.provincia)
      );
    }

    this.filteredGasolineras = filtered;
  }

  filtrarCarburantes():void {
    let filtered = this.listaGasolineras;

    if (this.selectedCarburantes.length > 0) {
      filtered = filtered.filter(gasolinera => {
        return this.selectedCarburantes.some(carburante => {
          switch (carburante) {
            case 'Gasoleo A':
              return gasolinera.precioGasoleoA > 0;
            case 'Gasoleo B':
              return gasolinera.precioGasoleoB > 0;
            case 'Gasolina 95 E5':
              return gasolinera.precioGasolina95E5 > 0;
            case 'Gasolina 98 E5':
              return gasolinera.precioGasolina98E5 > 0;
            case 'Hidrógeno':
              return gasolinera.precioHidrogeno > 0;
            default:
              return false;
          }
        });
      });
      this.filteredGasolineras = filtered;
    }
  }

  

  private offcanvasService = inject(NgbOffcanvas);

  openEnd(content: TemplateRef<any>) {
    this.offcanvasService.open(content, { position: 'end' });
  }
}
