import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Feature } from '../interfaces/feature.interface';

@Injectable()
export class FormExperimentalMockService {
  getFeatures(): Observable<Feature[]> {
    return of([
      {
        code: 'lift',
        label: 'Подъем на этаж',
        value: true,
      },
      {
        code: 'strong-package',
        label: 'Усиленная упаковка',
        value: true,
      },
      {
        code: 'fast',
        label: 'Ускоренная доставка',
        value: false,
      },
    ]);
  }
}
