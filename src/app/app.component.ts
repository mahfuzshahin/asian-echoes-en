import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {Facebook, Instagram, Menu, Search, Twitter, Youtube} from "lucide-angular";
import {HeaderComponent} from "./header/header.component";
import {NavigationComponent} from "./navigation/navigation.component";
import {BreakingNewsComponent} from "./breaking-news/breaking-news.component";
import {FooterComponent} from "./footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, NavigationComponent, BreakingNewsComponent, FooterComponent],
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
