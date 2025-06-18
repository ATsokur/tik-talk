import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';
import { timeNames } from '@tt/shared';
import { TimeNames } from '../data';

@Pipe({
  name: 'ttDate',
})
export class TtDatePipe implements PipeTransform {
  transform(
    date: string | null,
    intervalDay?: boolean,
    hours?: boolean,
    minutes?: boolean
  ): string | null {
    if (!date) return null;

    const timeInMin = {
      hour: 60,
    };
    const dateToday = DateTime.local();
    const dateFromISO = DateTime.fromISO(date);
    const dateWithTimeZone = DateTime.fromISO(date, { zone: 'utc' }).setZone(
      dateToday.zone
    );

    if (hours && minutes) {
      if (dateFromISO.minute < 10) {
        return `${dateWithTimeZone.hour}:0${dateWithTimeZone.minute}`;
      }
      return `${dateWithTimeZone.hour}:${dateWithTimeZone.minute}`;
    }

    const hourInDay = 24;
    const timeInMs = {
      sec: 1000,
      min: 60_000,
      hour: 3_600_000,
      day: 86_400_000,
    };

    const passMs = DateTime.local().toMillis() - dateWithTimeZone.toMillis();

    const someNumber = (arr: number[], num: number) =>
      arr.some((el) => el === num);

    const correctTimeName = (passTime: number, timeNames: TimeNames) => {
      const lastNumber = Number(passTime.toString().at(-1));
      const preLastNumber = Number(passTime.toString().slice(-2));
      const numbers = {
        forPack2: [2, 3, 4],
        forPack3: [12, 13, 14],
      };

      if (lastNumber === 1 && preLastNumber !== 11) {
        return timeNames.pack1;
      } else if (
        someNumber(numbers.forPack2, lastNumber) &&
        !someNumber(numbers.forPack3, preLastNumber)
      ) {
        return timeNames.pack2;
      } else {
        return timeNames.pack3;
      }
    };

    if (intervalDay) {
      const monthsPack = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
      ];
      const whenItWas = ['Сегодня', 'Вечера'];
      const dayOfMonth = dateFromISO.day;
      const dayOfWeek = dateWithTimeZone.day;
      const currentDayOfWeek = dateToday.day;
      const monthForPack = dateWithTimeZone.month - 1;

      if (passMs <= timeInMs.day && currentDayOfWeek === dayOfWeek) {
        return whenItWas[0];
      } else if (
        passMs <= timeInMs.day &&
        (currentDayOfWeek - dayOfWeek <= 1 ||
          Math.abs(currentDayOfWeek - dayOfWeek) === 6)
      ) {
        return whenItWas[1];
      } else {
        return `${dayOfMonth} ${monthsPack[monthForPack]}`;
      }
    }

    const passMin = Math.round(passMs / timeInMs.min);
    const passHour = Math.round(passMs / timeInMs.hour);
    const passDay = Math.round(passMs / timeInMs.day);

    if (passMs < timeInMs.min) {
      return 'меньше минуты назад';
    } else if (passMin < timeInMin.hour) {
      return `${passMin} ${correctTimeName(passMin, timeNames)[1]} назад`;
    } else if (passHour < hourInDay) {
      return `${passHour} ${correctTimeName(passHour, timeNames)[2]} назад`;
    } else {
      return `${passDay} ${correctTimeName(passDay, timeNames)[3]} назад`;
    }
  }
}
