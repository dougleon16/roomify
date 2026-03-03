import { Component, inject } from '@angular/core';
import { Box, LucideAngularModule } from 'lucide-angular';
import { ButtonComponent } from '../ui/button/button';
import { AuthContext } from '../../lib/auth-context';

@Component({
  selector: 'app-navbar',
  imports: [LucideAngularModule, ButtonComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  readonly BoxIcon = Box;

  private authContext = inject(AuthContext);

  isSignedIn = this.authContext.isSignedIn;
  username = this.authContext.userName;

  public async handleAuthClick() {
    if (this.isSignedIn()) {
      try {
        await this.authContext.signOut();
      } catch (error) {
        console.error('putter sign out error', error);
      }
      return;
    }
    try {
      await this.authContext.signIn();
    } catch (error) {
      console.error('putter sign in error', error);
    }
  }
}
