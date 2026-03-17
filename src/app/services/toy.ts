import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Toy, AgeGroup, ToyType } from '../models/toy.model';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class ToyService {
  private baseUrl = 'https://toy.pequla.com/api';

  constructor(private http: HttpClient) {}

  getAllToys(): Observable<Toy[]> {
    return this.http.get<Toy[]>(`${this.baseUrl}/toy`);
  }

  getToyById(id: number): Observable<Toy> {
    return this.http.get<Toy>(`${this.baseUrl}/toy/${id}`);
  }

  getToyByPermalink(permalink: string): Observable<Toy> {
    return this.http.get<Toy>(`${this.baseUrl}/toy/permalink/${permalink}`);
  }

  getAgeGroups(): Observable<AgeGroup[]> {
    return this.http.get<AgeGroup[]>(`${this.baseUrl}/age-group`);
  }

  getToyTypes(): Observable<ToyType[]> {
    return this.http.get<ToyType[]>(`${this.baseUrl}/type`);
  }
}
