import {
  Component,
  inject,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { GasService } from '../../services/gas.service';
import { Gasolinera } from '../../models/gas-item.dto';
import { CarburantesList } from '../../models/carburantes-list.interface';
import { ComunidadesAutonomas } from '../../models/comunidades-list.interface';
import { MatDialog } from '@angular/material/dialog';
import { ProvinciasList } from '../../models/provincias-list.interface';
import { CodigoPostal } from '../../models/codigo-postal.interface';

@Component({
  selector: 'app-gas-list',
  templateUrl: './gas-list.component.html',
  styleUrls: ['./gas-list.component.css'],
})
export class GasListComponent implements OnInit {
  listaGasolineras: Gasolinera[] = [];
  filteredGasolineras: Gasolinera[] = [];
  listaCarburantes: CarburantesList[] = [];
  listaComunidades: ComunidadesAutonomas[] = [];
  filteredCodes: CodigoPostal[] = [];
  originalCodes: CodigoPostal[] = [];

  selectedCarburantes: string | undefined;
  selectedComunidades: string | undefined;
  selectedProvincia: string | undefined;

  provincias: ProvinciasList[] = [];

  searchTerm: string = '';
  noResultsMessage: string | undefined;

  max = 5;
  min = 0;
  step = 0.2;
  thumbLabel = true;
  @Input() precioMinimo = 0;
  @Input() precioMaximo = 0;

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

    this.gasService.getCodigosPostales().subscribe((codes) => {
      this.filteredCodes = codes;
      this.originalCodes = codes;
    });
  }

  private cleanProperties(arrayGasolineras: any): Gasolinera[] {
    let newArray: Gasolinera[] = [];
    arrayGasolineras.forEach((gasolineraChusquera: any) => {
      let tiposCombustible: string[] = [];

      tiposCombustible.push('Gasoleo A');
      tiposCombustible.push('Gasoleo B');
      tiposCombustible.push('Gasolina 95 E5');
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
        tiposCombustible
      );
      newArray.push(gasolinera);
    });
    return newArray;
  }

  corregirPrecio(precio: string): number {
    return parseFloat(precio.replace(',', '.')) || 0;
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

  aplicarFiltros(): void {
    this.filteredGasolineras = this.filtrarGasolineras();
  }

  buscarGasolineras(): void {
    let filtered = this.listaGasolineras;

    if (this.searchTerm != '') {
      filtered = filtered.filter(
        (gasolinera) =>
          gasolinera.nombre
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          gasolinera.localidad
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          gasolinera.municipio
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
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

  buscarCodigosPostales(): void {
    if (this.searchTerm) {
      const formattedSearchTerm = this.searchTerm.padStart(5, '0');

      this.filteredCodes = this.originalCodes.filter((code) =>
        code.codigo_postal
          .toString()
          .padStart(5, '0')
          .includes(formattedSearchTerm)
      );
    } else {
      this.filteredCodes = this.originalCodes;
    }
  }

  seleccionarCodigoPostal(code: CodigoPostal): void {
    this.searchTerm = code.codigo_postal.toString().padStart(5, '0');

    this.filteredGasolineras = this.listaGasolineras.filter((gasolinera) => {
      const cpGasolinera = gasolinera.cp.toString().padStart(5, '0');

      return cpGasolinera === this.searchTerm;
    });

    if (this.filteredGasolineras.length === 0) {
      this.noResultsMessage = 'No existen gasolineras con ese código postal.';
    } else {
      this.noResultsMessage = '';
    }
  }

  resetBuscarCodigosPostales(): void {
    this.searchTerm = '';

    this.filteredGasolineras = this.listaGasolineras;

    this.filteredCodes = this.originalCodes;

    this.noResultsMessage = '';
  }
  
  cargarProvincias(): void {
    if (this.selectedComunidades) {
      this.gasService
        .getProvinciasPorComunidad(this.selectedComunidades)
        .subscribe((resp) => {
          this.provincias = resp;
        });
    } else {
      this.provincias = [];
    }
  }

  filtrarGasolineras(): Gasolinera[] {
    const comunidad = this.selectedComunidades || '';
    const provincia = this.selectedProvincia || '';
    const carburante = this.selectedCarburantes || '';

    return this.listaGasolineras.filter((gasolinera) => {
      let cumpleComunidad = true;
      let cumpleProvincia = true;
      let cumpleCarburante = true;

      if (comunidad) {
        cumpleComunidad = gasolinera.idComunidad === comunidad;
      }

      if (provincia) {
        cumpleProvincia = cumpleProvincia && gasolinera.provincia === provincia;
      }

      if (carburante) {
        cumpleCarburante =
          gasolinera.tiposCombustible.includes(carburante) &&
          this.obtenerPrecioCarburante(gasolinera, carburante) > 0;
      }

      return cumpleComunidad && cumpleProvincia && cumpleCarburante;
    });
  }

  filtrarPrecio(): void {
    let filtered = this.filteredGasolineras;

    filtered = filtered.filter(
      (gasolinera) =>
        gasolinera.precioGasolina95E5 >= this.precioMinimo &&
        gasolinera.precioGasolina95E5 <= this.precioMaximo
    );

    this.filteredGasolineras = filtered;
  }

}