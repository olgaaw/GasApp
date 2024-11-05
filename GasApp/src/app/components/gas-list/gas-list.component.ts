import { Component, OnInit } from '@angular/core';
import { ListaEeSsPrecio, ListaEeSsPrecioResponse } from '../../models/gas-list.interface';
import { GasService } from '../../services/gas.service';
import { CustomEurPipe } from '../../pipes/custom-eur.pipe';

@Component({
  selector: 'app-gas-list',
  templateUrl: './gas-list.component.html',
  styleUrl: './gas-list.component.css'
})
export class GasListComponent implements OnInit{
  gasList: ListaEeSsPrecio[] = [];
  customEurValue: string | number = 0;


  constructor(private gasService: GasService,
              private customEur: CustomEurPipe
    ) {}

  ngOnInit(): void {
      this.gasService.getEeSsList().subscribe(resp => {
        this.gasList = resp.ListaEESSPrecio;
      })
      this.customEurValue = this.customEur.transform(this.customEurValue);


  }




}
