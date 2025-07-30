import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DADATA_TOKEN } from '../token';
import { Suggestion } from '../interfaces/suggestion.inteface';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DadataService {
  #http = inject(HttpClient);
  #apiUrl =
    'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address';

  getSuggestion(query: string) {
    return this.#http
      .post<{ suggestions: Suggestion[] }>(
        `${this.#apiUrl}`,
        { query },
        {
          headers: {
            Authorization: 'Token ' + `${DADATA_TOKEN}`
          }
        }
      )
      .pipe(
        map((suggestions) => {
          return Array.from(
            new Set(
              suggestions.suggestions.map(({ data: { city } }) => {
                return city;
              })
            )
          );
        })
      );
  }
}
