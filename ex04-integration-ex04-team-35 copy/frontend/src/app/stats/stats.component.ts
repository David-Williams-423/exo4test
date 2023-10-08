import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { RegistrationService } from '../registration.service';
import { CheckInService } from '../checkin.service';
import { User } from '../user';
import { Checkin } from '../checkin.model';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  public users$!: Observable<User[]>;
  public checkedInUsers$!: Observable<Checkin[]>;

  constructor(
    private registrationService: RegistrationService,
    private checkInService: CheckInService,
  ) { }

  ngOnInit(): void {
    this.users$ = this.registrationService.getUsers();
    this.checkInService.getUserCheckin().subscribe(
      (checkedInUsers: Checkin[]) => {
        this.checkedInUsers$ = of(checkedInUsers);
        console.log("Received checked-in user data:", checkedInUsers);
      },
      (error) => {
        console.error('Error while fetching checked-in users:', error);
        // Handle the error, e.g., set a default value or show an error message.
        this.checkedInUsers$ = of([]); // Set a default value in case of an error.
      }
    );

    // this.checkInService.getCheckedInUsers().subscribe(
    //   (checkedInUsers: User[]) => {
    //     this.checkedInUsers$ = of(checkedInUsers);
    //   },
    //   (error) => {
    //     console.error('Error while fetching checked-in users:', error);
    //     // Handle the error, e.g., set a default value or show an error message.
    //     this.checkedInUsers$ = of([]); // Set a default value in case of an error.
    //   }
    // );
  }
}
