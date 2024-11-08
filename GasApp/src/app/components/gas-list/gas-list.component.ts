import { Component, inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { GasService } from '../../services/gas.service';
import { Gasolinera } from '../../models/gas-item.dto';
import { CarburantesList } from '../../models/carburantes-list.interface';
import { ComunidadesAutonomas } from '../../models/comunidades-list.interface';
import { MatDialog } from '@angular/material/dialog';
import { CodeList } from '../../models/cp-list.interface';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Provincias } from '../../models/provincias-list.interface';

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
  listaProvincias: Provincias[] = [];
  listaCode: CodeList[] = [];

  selectedCarburante: string | undefined; 
  selectedComunidad: string | undefined;
  selectedProvincia: string | undefined;

  searchTerm: string = '';
  noResultsMessage: string | undefined;

  max = 5;
  min = 0;
  step = 0.2;
  thumbLabel = true;
  @Input() precioMinimo = 0;
  @Input() precioMaximo = 0;
 
  myControl = new FormControl('');
  options: Observable<string[]> | undefined;
  

  constructor(private gasService: GasService, public dialog: MatDialog) {}

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

    this.gasService.getCodeList().subscribe(respuesta => {
      this.listaCode = respuesta;
    });

    
  }

  private cleanProperties(arrayGasolineras: any): Gasolinera[] {
    let newArray: Gasolinera[] = [];
    arrayGasolineras.forEach((gasolineraChusquera: any) => {
      let tiposCombustible: string[] = [];

        tiposCombustible.push('Gasoleo A');
        tiposCombustible.push('Gasoleo B');
        tiposCombustible.push('Gasolina 95 E5')
        tiposCombustible.push('Gasolina 98 E5');
        tiposCombustible.push('Hidrogeno');
      
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
        gasolineraChusquera['C.P.'],
        gasolineraChusquera['IDCCAA'],
        gasolineraChusquera['Latitud'],
        gasolineraChusquera['Longitud (WGS84)'],
        tiposCombustible,
      );
      newArray.push(gasolinera);
    });
    return newArray;
  }

  obtenerPrecioCarburante(gasolinera: Gasolinera, carburante: string): number {
    switch (carburante) {
      case 'Gasoleo A':
        return gasolinera.precioGasoleoA;
      case 'Gasoleo B':
        return gasolinera.precioGasoleoB;
      case 'Gasolina 95 E5':
        return gasolinera.precioGasolina95E5;
      case 'Gasolina 98 E5':
        return gasolinera.precioGasolina98E5;
      case 'Hidrogeno':
        return gasolinera.precioHidrogeno;
      default:
        return 0;
    }
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
    this.filteredGasolineras = this.filtrarGasolineras();
  
  }
  
  filtrarGasolineras(): Gasolinera[] {
    const comunidad = this.selectedComunidad || '';
    const carburante = this.selectedCarburante || '';
  
    return this.listaGasolineras.filter(gasolinera => {
      let esDeLaComunidad = true;
      if (comunidad) {
        esDeLaComunidad = gasolinera.idComunidad == comunidad;
    
      }
  
      let tieneCarburante = true;
      if (carburante) {
        tieneCarburante = gasolinera.tiposCombustible.includes(carburante) && this.obtenerPrecioCarburante(gasolinera, carburante) > 0;
      }
  
      return esDeLaComunidad && tieneCarburante;
    });
  }
  
  filtrarPrecio(): void {
    let filtered = this.filteredGasolineras;
  
    filtered = filtered.filter(gasolinera =>
      gasolinera.precioGasolina95E5 >= this.precioMinimo && gasolinera.precioGasolina95E5 <= this.precioMaximo
    );
  
    this.filteredGasolineras = filtered;
  
  }

  filtrarCarburantes(): void {
    const carburante = this.selectedCarburante || '';
    console.log('Carburante seleccionado:', carburante);
  
    if (carburante) {
      this.filteredGasolineras = this.filteredGasolineras.filter(gasolinera => {
        const precioCarburante = this.obtenerPrecioCarburante(gasolinera, carburante);
        return gasolinera.tiposCombustible.includes(carburante) && precioCarburante > 0;
      });
    } else {
      this.filteredGasolineras = this.listaGasolineras;
    }
    
  }
  
  filtrarComunidad(): void {
    const comunidad = this.selectedComunidad || '';
    console.log('Comunidad seleccionada:', comunidad);
  
    if (comunidad) {
      this.filteredGasolineras = this.listaGasolineras.filter(gasolinera =>
        gasolinera.idComunidad == comunidad
      );
      this.filtrarProvincias;
    } else {
      this.filteredGasolineras = this.listaGasolineras;
    }

    
  }

  buscarProvincias(IDCCAA: string) {
    this.gasService.getProvinciasList(IDCCAA).subscribe((respuesta) => {
      this.listaProvincias = respuesta;
    });
  }

  filtrarProvincias(idProvincias: string) {
    this.gasService.getEstacionesUnaProvincia(idProvincias).subscribe((response) => {
      const respuesString = JSON.stringify(response);
      let parser;
      parser = JSON.parse(respuesString);
      let listaEeSs = parser['ListaEESSPrecio'];
      this.listaGasolineras = this.cleanProperties(listaEeSs);
      this.filteredGasolineras = this.listaGasolineras;
    })
  }
  

  @ViewChild('dialogContent') dialogContent!: TemplateRef<any>;

  openFilterDialog(): void {
    this.dialog.open(this.dialogContent);
  }


}
