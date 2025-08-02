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

  getSuggestionCities(query: string) {
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
          const addresses = suggestions.suggestions.map(
            ({ data: { city, street, house } }) => {
              city = city ? city : '';
              street = street ? street : '';
              house = house ? house : '';

              if (city || street || house) {
                return `${city}\n${street}\n${house}`;
              }

              return null;
            }
          );

          const uniqueAddresses = Array.from(new Set(addresses));
          return uniqueAddresses;
        })
      );
  }
}
