import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent {
  stories = [
    {
      name: "Register",
      route: "/register"
    },
    {
      name: "Stats",
      route: "/stats"
    },
    {
      name: "Checkin",
      route: "/checkin"
    }
  ]
}