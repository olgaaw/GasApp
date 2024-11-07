export class Gasolinera {
    constructor(
      public id: number,
      public nombre: string,
      public localidad: string,
      public municipio: string,  
      public provincia: string,   
      public direccion: string,
      public horario: string,
      public precioGasoleoA: number,
      public precioGasoleoB: number,
      public precioGasolina95E5: number,
      public precioGasolina98E5: number,
      public precioHidrogeno: number,
      public cp: number,
      public idComunidad: string,
      public latitud: string,
      public longitud: string,
      public tiposCombustible: string[] = [],
      public comunidades: string[] = []
    ) {}

  }