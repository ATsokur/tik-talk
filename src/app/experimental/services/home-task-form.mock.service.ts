import { Injectable, signal } from '@angular/core';

import { map, Observable, of, tap } from 'rxjs';

import {
  Department,
  Employee,
  Service,
} from '../interfaces/home-task-form.interface';

const Departments: Department[] = [
  {
    name: 'Аналитика',
    value: 'Analytics',
  },
  {
    name: 'Бухгалтерия',
    value: 'Accounting',
  },
  {
    name: 'Логистика',
    value: 'Logistics',
  },
];

const services: Service[] = [
  {
    serviceName: 'Персональный компьютер',
    compoundServices: [
      'Не включается/Перезагружается',
      'Недоступен сетевой диск',
      'Монитор',
      'Прочее',
    ],
  },
  {
    serviceName: 'Принтер',
    compoundServices: [
      'Не включается',
      'Замятие бумаги',
      'Механическое повреждение',
      'Закончился тонер',
      'Прочее',
    ],
  },
  {
    serviceName: 'Электронная почта',
    compoundServices: [
      'Не открывается',
      'Не отправляются письма',
      'Не приходят письма',
      'Прочее',
    ],
  },
  {
    serviceName: 'Специальное ПО',
    compoundServices: [
      'Не открывается MS Word',
      'Не открывается MS Excel',
      'Прочее',
    ],
  },
];

@Injectable()
export class HomeTaskFormMockService {
  services = signal<Service[]>([]);
  serviceName = signal<string[]>([]);
  departments = signal<Department[]>([]);
  employees = signal<Employee[]>([]);
  compoundServices = signal<string[]>([]);

  getSectionServices() {
    return of(services).pipe(
      map((services) => {
        const voidService = {
          serviceName: '--Выберете услугу--',
          compoundServices: ['--Выберете состав услуги--'],
        };
        this.compoundServices.set(voidService.compoundServices);
        const patchServices = services.map(
          ({ serviceName, compoundServices }) => {
            return {
              serviceName,
              compoundServices: [
                ...voidService.compoundServices,
                ...compoundServices,
              ],
            };
          }
        );

        return [voidService, ...patchServices];
      }),
      tap((services) => this.services.set(services))
    );
  }

  getDepartments(): Observable<Department[]> {
    return of(Departments).pipe(
      map((departments) => {
        const patchDepartment = {
          name: '--Выберете отдел--',
          value: null,
        };
        return [patchDepartment, ...departments];
      }),
      tap((departments) => this.departments.set(departments))
    );
  }

  getEmployees(): Observable<Employee[]> {
    return of([
      {
        secondName: 'Некрасова',
        firstName: 'Анна',
        lastName: 'Викторовна',
        email: 'AVNekrasova@ttcompany.ru',
      },
      {
        secondName: 'Бережной',
        firstName: 'Сергей',
        lastName: 'Анатольевич',
        email: 'SABerejnoy@ttcompany.ru',
      },
      {
        secondName: 'Семенов',
        firstName: 'Игорь',
        lastName: 'Петрович',
        email: 'IPSemenov@ttcompany.ru',
      },
      {
        secondName: 'Харитонов',
        firstName: 'Петр',
        lastName: 'Андреевич',
        email: 'PAHaritonov@ttcompany.ru',
      },
      {
        secondName: 'Лапин',
        firstName: 'Георгий',
        lastName: 'Викторович',
        email: 'GVLapin@ttcompany.ru',
      },
      {
        secondName: 'Полянская',
        firstName: 'Антонина',
        lastName: 'Олеговна',
        email: 'AOPolanskya@ttcompany.ru',
      },
      {
        secondName: 'Грач',
        firstName: 'Лиза',
        lastName: 'Ивановна',
        email: 'LIGrach@ttcompany.ru',
      },
      {
        secondName: 'Березовский',
        firstName: 'Петр',
        lastName: 'Дмитриевич',
        email: 'PDBerezovskyi@ttcompany.ru',
      },
      {
        secondName: 'Морозова',
        firstName: 'Надежда',
        lastName: 'Викторовна',
        email: 'NVMorozova@ttcompany.ru',
      },
      {
        secondName: 'Ковалева',
        firstName: 'Ирина',
        lastName: 'Владимировна',
        email: 'IVKovaleva@ttcompany.ru',
      },
      {
        secondName: 'Белова',
        firstName: 'Наталья',
        lastName: 'Андреевна',
        email: 'NABelova@ttcompany.ru',
      },
    ]).pipe(tap((employees) => this.employees.set(employees)));
  }
}
