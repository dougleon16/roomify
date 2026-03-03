import { Injectable } from '@angular/core';
import puter from '@heyputer/puter.js';

@Injectable({
  providedIn: 'root',
})
export class PutterActions {
  public async signIn() {
    await puter.auth.signIn();
  }

  public signOut() {
    puter.auth.signOut();
  }

  public async getCurrentUser() {
    try {
      return await puter.auth.getUser();
    } catch (error) {
      return null;
    }
  }
}
