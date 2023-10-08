import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, throwError, map } from "rxjs";
import { catchError } from "rxjs/operators";
import { User } from "./user";
import { RegistrationService } from "./registration.service";
import { Checkin } from './checkin.model';
// import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class CheckInService {
  constructor(
    private http: HttpClient,
    private registrationService: RegistrationService,
    // private datePipe: DatePipe
  ) { }

  checkIn(pid: string): Observable<Checkin> {
    return this.http.post<Checkin>('/api/checkin', { pid });
  }

  getUserCheckin(): Observable<Checkin[]> {
    return this.http.get<Checkin[]>('/api/checkin').pipe(
      map(checkins =>
        checkins.map(checkin => ({
          ...checkin,
          created_at: new Date(checkin.created_at)
        }))
      ),
      catchError(error => {
        console.error(`Error occured while getting check-in data: ${error}`);
        throw error;
      })
    );
  }
}