import { Injectable, signal } from '@angular/core';

import { map, Observable, of, tap } from 'rxjs';

import { Employee, Option, Assistance } from './home-task-form.interface';

enum ReceiverDepartments {
  Analytics = 'Analytics',
  Accounting = 'Accounting',
  Logistics = 'Logistics'
}

enum ReceiverAssistance {
  Computer = 'Computer',
  Printer = 'Printer',
  Email = 'Email',
  Apps = 'Apps'
}

enum ReceiverCompoundAssistance {
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
  MsExcel = 'MsExcel'
}

const Departments: Option[] = [
  {
    label: 'Аналитика',
    value: ReceiverDepartments.Analytics
  },
  {
    label: 'Бухгалтерия',
    value: ReceiverDepartments.Accounting
  },
  {
    label: 'Логистика',
    value: ReceiverDepartments.Logistics
  }
];

const assistances: Assistance[] = [
  {
    type: {
      label: 'Персональный компьютер',
      value: ReceiverAssistance.Computer
    },
    compounds: [
      {
        label: 'Не включается/Перезагружается',
        value: ReceiverCompoundAssistance.NotEnable
      },
      {
        label: 'Недоступен сетевой диск',
        value: ReceiverCompoundAssistance.NetworkDrive
      },
      {
        label: 'Монитор',
        value: ReceiverCompoundAssistance.Monitor
      },
      {
        label: 'Прочее',
        value: ReceiverCompoundAssistance.Other
      }
    ]
  },
  {
    type: {
      label: 'Принтер',
      value: ReceiverAssistance.Printer
    },
    compounds: [
      {
        label: 'Не включается',
        value: ReceiverCompoundAssistance.NotEnable
      },
      {
        label: 'Замятие бумаги',
        value: ReceiverCompoundAssistance.PaperJam
      },
      {
        label: 'Механическое повреждение',
        value: ReceiverCompoundAssistance.MechanicalDamage
      },
      {
        label: 'Закончился тонер',
        value: ReceiverCompoundAssistance.TonerOut
      },
      {
        label: 'Прочее',
        value: ReceiverCompoundAssistance.Other
      }
    ]
  },
  {
    type: {
      label: 'Электронная почта',
      value: ReceiverAssistance.Email
    },
    compounds: [
      {
        label: 'Не открывается',
        value: ReceiverCompoundAssistance.NotOpen
      },
      {
        label: 'Не отправляются письма',
        value: ReceiverCompoundAssistance.NotSend
      },
      {
        label: 'Не приходят письма',
        value: ReceiverCompoundAssistance.NotReceive
      },
      {
        label: 'Прочее',
        value: ReceiverCompoundAssistance.Other
      }
    ]
  },
  {
    type: {
      label: 'Специальное ПО',
      value: ReceiverAssistance.Apps
    },
    compounds: [
      {
        label: 'Не открывается MS Word',
        value: ReceiverCompoundAssistance.MsWord
      },
      {
        label: 'Не открывается MS Excel',
        value: ReceiverCompoundAssistance.MsExcel
      },
      {
        label: 'Прочее',
        value: ReceiverCompoundAssistance.Other
      }
    ]
  }
];

@Injectable()
export class HomeTaskFormMockService {
  assistances = signal<Assistance[]>([]);
  assistanceName = signal<string[]>([]);
  departments = signal<Option[]>([]);
  employees = signal<Employee[]>([]);
  compoundAssistances = signal<Option[][]>([[]]);

  getSectionServices() {
    return of(assistances).pipe(
      map((assistances) => {
        const voidAssistance: Assistance = {
          type: {
            label: '--Выберете услугу--',
            value: null
          },
          compounds: [
            {
              label: '--Выберете состав услуги--',
              value: null
            }
          ]
        };
        const patchAssistances = assistances.map(({ type, compounds }) => {
          return {
            type,
            compounds: [...voidAssistance.compounds, ...compounds]
          };
        });
        const allCompounds = patchAssistances.map(({ compounds }) => compounds);
        this.compoundAssistances.set(allCompounds);
        return [voidAssistance, ...patchAssistances];
      }),
      tap((assistances) => this.assistances.set(assistances))
    );
  }

  getDepartments(): Observable<Option[]> {
    return of(Departments).pipe(
      map((departments) => {
        const patchDepartment = {
          label: '--Выберете отдел--',
          value: null
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
        email: 'AVNekrasova@ttcompany.ru'
      },
      {
        secondName: 'Бережной',
        firstName: 'Сергей',
        lastName: 'Анатольевич',
        email: 'SABerejnoy@ttcompany.ru'
      },
      {
        secondName: 'Семенов',
        firstName: 'Игорь',
        lastName: 'Петрович',
        email: 'IPSemenov@ttcompany.ru'
      },
      {
        secondName: 'Харитонов',
        firstName: 'Петр',
        lastName: 'Андреевич',
        email: 'PAHaritonov@ttcompany.ru'
      },
      {
        secondName: 'Лапин',
        firstName: 'Георгий',
        lastName: 'Викторович',
        email: 'GVLapin@ttcompany.ru'
      },
      {
        secondName: 'Полянская',
        firstName: 'Антонина',
        lastName: 'Олеговна',
        email: 'AOPolanskya@ttcompany.ru'
      },
      {
        secondName: 'Грач',
        firstName: 'Лиза',
        lastName: 'Ивановна',
        email: 'LIGrach@ttcompany.ru'
      },
      {
        secondName: 'Березовский',
        firstName: 'Петр',
        lastName: 'Дмитриевич',
        email: 'PDBerezovskyi@ttcompany.ru'
      },
      {
        secondName: 'Морозова',
        firstName: 'Надежда',
        lastName: 'Викторовна',
        email: 'NVMorozova@ttcompany.ru'
      },
      {
        secondName: 'Ковалева',
        firstName: 'Ирина',
        lastName: 'Владимировна',
        email: 'IVKovaleva@ttcompany.ru'
      },
      {
        secondName: 'Белова',
        firstName: 'Наталья',
        lastName: 'Андреевна',
        email: 'NABelova@ttcompany.ru'
      }
    ]).pipe(tap((employees) => this.employees.set(employees)));
  }
}
