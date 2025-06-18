import { Injectable, signal } from '@angular/core';

import { map, Observable, of, tap } from 'rxjs';

import {
  Employee,
  Option,
  Service,
} from '../interfaces/home-task-form.interface';

enum ReceiverDepartments {
  Analytics = 'Analytics',
  Accounting = 'Accounting',
  Logistics = 'Logistics',
}

enum ReceiverServices {
  Computer = 'Computer',
  Printer = 'Printer',
  Email = 'Email',
  Apps = 'Apps',
}

enum ReceiverCompoundServices {
  NotEnable = 'NotEnable',
  NetworkDrive = 'NetworkDrive',
  Monitor = 'Monitor',
  Other = 'Other',
  PaperJam = 'PaperJam',
  MechanicalDamage = 'MechanicalDamage',
  TonerOut = 'TonerOut',
  NotOpen = 'NotOpen',
  NotSend = 'NotSend',
  NotReceive = 'NotReceive',
  MsWord = 'MsWord',
  MsExcel = 'MsExcel',
}

const Departments: Option[] = [
  {
    label: 'Аналитика',
    value: ReceiverDepartments.Analytics,
  },
  {
    label: 'Бухгалтерия',
    value: ReceiverDepartments.Accounting,
  },
  {
    label: 'Логистика',
    value: ReceiverDepartments.Logistics,
  },
];

const services: Service[] = [
  {
    type: {
      label: 'Персональный компьютер',
      value: ReceiverServices.Computer,
    },
    compounds: [
      {
        label: 'Не включается/Перезагружается',
        value: ReceiverCompoundServices.NotEnable,
      },
      {
        label: 'Недоступен сетевой диск',
        value: ReceiverCompoundServices.NetworkDrive,
      },
      {
        label: 'Монитор',
        value: ReceiverCompoundServices.Monitor,
      },
      {
        label: 'Прочее',
        value: ReceiverCompoundServices.Other,
      },
    ],
  },
  {
    type: {
      label: 'Принтер',
      value: ReceiverServices.Printer,
    },
    compounds: [
      {
        label: 'Не включается',
        value: ReceiverCompoundServices.NotEnable,
      },
      {
        label: 'Замятие бумаги',
        value: ReceiverCompoundServices.PaperJam,
      },
      {
        label: 'Механическое повреждение',
        value: ReceiverCompoundServices.MechanicalDamage,
      },
      {
        label: 'Закончился тонер',
        value: ReceiverCompoundServices.TonerOut,
      },
      {
        label: 'Прочее',
        value: ReceiverCompoundServices.Other,
      },
    ],
  },
  {
    type: {
      label: 'Электронная почта',
      value: ReceiverServices.Email,
    },
    compounds: [
      {
        label: 'Не открывается',
        value: ReceiverCompoundServices.NotOpen,
      },
      {
        label: 'Не отправляются письма',
        value: ReceiverCompoundServices.NotSend,
      },
      {
        label: 'Не приходят письма',
        value: ReceiverCompoundServices.NotReceive,
      },
      {
        label: 'Прочее',
        value: ReceiverCompoundServices.Other,
      },
    ],
  },
  {
    type: {
      label: 'Специальное ПО',
      value: ReceiverServices.Apps,
    },
    compounds: [
      {
        label: 'Не открывается MS Word',
        value: ReceiverCompoundServices.MsWord,
      },
      {
        label: 'Не открывается MS Excel',
        value: ReceiverCompoundServices.MsExcel,
      },
      {
        label: 'Прочее',
        value: ReceiverCompoundServices.Other,
      },
    ],
  },
];

@Injectable()
export class HomeTaskFormMockService {
  services = signal<Service[]>([]);
  serviceName = signal<string[]>([]);
  departments = signal<Option[]>([]);
  employees = signal<Employee[]>([]);
  compoundServices = signal<Option[][]>([[]]);

  getSectionServices() {
    return of(services).pipe(
      map((services) => {
        const voidService: Service = {
          type: {
            label: '--Выберете услугу--',
            value: null,
          },
          compounds: [
            {
              label: '--Выберете состав услуги--',
              value: null,
            },
          ],
        };
        const patchServices = services.map(({ type, compounds }) => {
          return {
            type,
            compounds: [...voidService.compounds, ...compounds],
          };
        });
        const allCompounds = patchServices.map(({ compounds }) => compounds);
        this.compoundServices.set(allCompounds);
        return [voidService, ...patchServices];
      }),
      tap((services) => this.services.set(services))
    );
  }

  getDepartments(): Observable<Option[]> {
    return of(Departments).pipe(
      map((departments) => {
        const patchDepartment = {
          label: '--Выберете отдел--',
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
