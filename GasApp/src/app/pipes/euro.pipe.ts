import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'euro'
})
export class EuroPipe implements PipeTransform {
  transform(value: number): string {
    if(value){
    return `${value}€`;
    }else{
      return '---';
    }
  }
}