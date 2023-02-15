import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringLength'
})
export class StringLengthPipe implements PipeTransform {

  transform(value: any): any {
    return  value.split(',').length;
  }

}
