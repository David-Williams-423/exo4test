import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { RegistrationService } from '../registration.service';
import { CheckInService } from '../checkin.service';
import { User } from '../user';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.css']
})

export class CheckinComponent implements OnInit {
  checkin_fb = this.fb.group({
    pid: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
  });

  constructor(
    private registrationService: RegistrationService,
    private checkinService: CheckInService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.checkin_fb.valid) {
      const pid = this.checkin_fb.value.pid;
      console.log('PID:', pid);

      this.registrationService.getUsers().subscribe({
        next: (users: User[]) => {
          const user = users.find(u => u.pid === Number(pid));
          if (user) {
            this.checkinService.checkIn(user.pid.toString()).subscribe(
              () => {
                alert(`Checked in: ${user.first_name} ${user.last_name}`);
                this.checkin_fb.reset();
              },
              () => {
                alert('Check-in unsuccessful');
              }
            );
          } else {
            alert('PID could not be found. Check and try again');
          }
        },
        error: (error: any) => {
          alert(`Error: ${error.message || 'Unknown error'}`);
        }
      });
    } else {
      alert('Bad PID! Enter a 9-digit PID and try again');
    }
  }
}