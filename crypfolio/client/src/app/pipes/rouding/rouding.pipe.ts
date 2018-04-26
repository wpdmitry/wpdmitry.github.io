import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rouding'
})
export class RoudingPipe implements PipeTransform {

  transform(number: number, args?: any): string {
    if (Math.abs(number) >= 1) {
      return number.toFixed(2);
    }

    if (Math.abs(number) < 1) {
      const str = String(number);
      let pointMatch = str.match(/[1-9]/);

      if (!pointMatch) {
        return String(number);
      }

      let pointIndex = pointMatch.index;

      pointIndex = pointIndex < 0 ? pointIndex - 1 : pointIndex;

      return parseFloat(str).toFixed(pointIndex);
    }
  }
}
