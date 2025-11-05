import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Facebook, Instagram, Menu, Search, Twitter, Youtube} from "lucide-angular";
import {HeaderComponent} from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'asian-echoes-en';
  icons = {
    Menu,
    Search,
    Facebook,
    Twitter,
    Youtube,
    Instagram
  };
}
