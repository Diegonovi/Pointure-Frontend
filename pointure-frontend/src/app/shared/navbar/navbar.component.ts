import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchQuery: string = '';

  constructor(private router: Router) {}

  onSearchSubmit(event: Event) {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search', this.searchQuery.trim()]).then(() => {
        window.location.reload();
      });
    }
  }
}
