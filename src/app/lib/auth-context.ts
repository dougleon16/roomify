import { Injectable, signal, computed, inject } from '@angular/core';
import { PutterActions } from './putter.actions';
import { AuthState } from '../types/type';

const DEFAULT_AUTH_STATE: AuthState = {
  isSignedIn: false,
  userName: null,
  userId: null,
};

@Injectable({
  providedIn: 'root',
})
export class AuthContext {
  private authState = signal<AuthState>(DEFAULT_AUTH_STATE);

  private putterActions = inject(PutterActions);

  isSignedIn = computed(() => this.authState().isSignedIn);
  userName = computed(() => this.authState().userName);
  userId = computed(() => this.authState().userId);

  async refreshAuth(): Promise<boolean> {
    try {
      const user = await this.putterActions.getCurrentUser();

      this.authState.set({
        isSignedIn: !!user,
        userName: user?.username || null,
        userId: user?.uuid || null,
      });
      return !!user;
    } catch (error) {
      console.error('Error refreshing auth:', error);
      this.authState.set(DEFAULT_AUTH_STATE);
      return false;
    }
  }

  async signIn(): Promise<boolean> {
    try {
      await this.putterActions.signIn();
      return await this.refreshAuth();
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    }
  }

  async signOut(): Promise<boolean> {
    try {
      this.putterActions.signOut();
      this.authState.set(DEFAULT_AUTH_STATE);
      return true;
    } catch (error) {
      console.error('Sign out error:', error);
      return false;
    }
  }
}
