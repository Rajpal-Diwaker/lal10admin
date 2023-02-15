import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'datediff'
})
export class DatediffPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value && !args) { return null; }

    const startDate = new Date(args);
    const endDate = new Date(value);
    const seconds = (endDate.getTime() - startDate.getTime()) / 1000;

    const minute = seconds / 60;
    let txt = '';
    if (seconds < 60) {
        // just now
        txt = '0';
      } else if (minute > 60) {
        // hr
        const hr = Math.round(minute / 60);
        txt = hr + ' hr';
        if (hr > 24) {
          // days
          const day = Math.round(hr / 24);
          txt = day + ' day';
          if (day > 7) {
            const week = Math.round(day / 7);
            txt = week + ' week';
            if (week > 1) {
              txt = week + ' weeks';
            }
          }
        }

      } else {
        // min
        txt = Math.round(minute) + ' min';
      }

    return txt ;
  }

}
