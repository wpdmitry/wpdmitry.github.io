import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sign'
})
export class SignPipe implements PipeTransform {

  transform(value: string, args?: any): string {
    const number = parseFloat(value);

    if (number < 0) {
      return '-' + Math.abs(number);
    } else {
      return '+' + Math.abs(number);
    }
  }

}
