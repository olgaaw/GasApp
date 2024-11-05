import { Component, OnInit } from '@angular/core';
import { ListaEeSsPrecio, ListaEeSsPrecioResponse } from '../../models/gas-list.interface';
import { GasService } from '../../services/gas.service';

@Component({
  selector: 'app-gas-list',
  templateUrl: './gas-list.component.html',
  styleUrl: './gas-list.component.css'
})
export class GasListComponent implements OnInit{
  gasList: ListaEeSsPrecio[] = [];

  constructor(private gasService: GasService) {}

  ngOnInit(): void {
      this.gasService.getEeSsList().subscribe(resp => {
        this.gasList = resp.ListaEESSPrecio;
      })

  }




}
