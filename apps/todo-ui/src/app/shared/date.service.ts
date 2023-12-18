import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateService {
  /**
   * format the date object
   * by default, if the Date is today it returns the time only,
   * otherwise it returns the date only without the time
   * @param date the date object to be formatted
   * @param locale the locale string, such as en-US and ar-EG
   * @param options additional options for Intl.DateTimeFormat()
   * @returns the formatted string
   */
  // todo: return yesterday, 3 minutes ago, ...
  format(
    date: Date | string,
    locale = 'en-US',
    options?: { [key: string]: any },
  ) {
    date = typeof date === 'string' ? new Date(date) : date;

    let isToday = this.isToday(date);

    return new Intl.DateTimeFormat(locale, {
      dateStyle: isToday ? undefined : 'long',
      timeStyle: isToday ? 'short' : undefined,
      timeZone: 'Africa/Cairo',
      ...options,
    }).format(date);
  }

  isToday(date: Date | string) {
    date = typeof date === 'string' ? new Date(date) : date;
    return new Date().toDateString() === date.toDateString();
  }
}
