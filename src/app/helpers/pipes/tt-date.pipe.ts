import { Pipe, PipeTransform } from '@angular/core';

interface TimeNames {
  pack1: string[];
  pack2: string[];
  pack3: string[];
}

@Pipe({
  name: 'ttDate',
})
export class TtDatePipe implements PipeTransform {
  transform(date: string): string | null {
    if (!date) return null;

    const minInHour = 60;
    const hourInDay = 24;
    const timeInMs = {
      sec: 1000,
      min: 60_000,
      hour: 3_600_000,
      day: 86_400_000,
    };

    const timeNames = {
      pack1: ['минуту', 'час', 'день'],
      pack2: ['минуты', 'часа', 'дня'],
      pack3: ['минут', 'часов', 'дней'],
    };
    let offset = new Date().getTimezoneOffset();
    let passMs = Date.now() - Date.parse(date) + offset * timeInMs.min;

    const someNumber = (arr: number[], num: number) =>
      arr.some((el) => el === num);

    const correctTimeName = (passTime: number, timeNames: TimeNames) => {
      let lastNumber = Number(passTime.toString().at(-1));
      let preLastNumber = Number(passTime.toString().slice(-2));
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

    if (passMs < timeInMs.min) {
      return 'меньше минуты назад';
    } else if (Math.round(passMs / timeInMs.min) < minInHour) {
      passMs = Math.round(passMs / timeInMs.min);
      return `${passMs} ${correctTimeName(passMs, timeNames)[0]} назад`;
    } else if (Math.round(passMs / timeInMs.hour) < hourInDay) {
      passMs = Math.round(passMs / timeInMs.hour);
      return `${passMs} ${correctTimeName(passMs, timeNames)[1]} назад`;
    } else {
      passMs = Math.round(passMs / timeInMs.day);
      return `${passMs} ${correctTimeName(passMs, timeNames)[2]} назад`;
    }
  }
}
