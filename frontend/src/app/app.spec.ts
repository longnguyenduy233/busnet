import { ANIMATION_MODULE_TYPE, inject, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { describe, expect, it } from 'vitest';
import { appEnvironmentProviders } from './app.config';
import { App } from './app';
import { authReducer } from './store/auth/auth.reducer';

describe('App', () => {
  it('boot config does not register deprecated provideAnimations (ANIMATION_MODULE_TYPE stays unset)', () => {
    // BrowserAnimationsModule / provideAnimations() would set this token to 'BrowserAnimations'.
    // Mirror production DI with zoneless CD so we avoid importing Zone.js (would affect other bundled specs).
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), ...appEnvironmentProviders]
    });
    const animationModuleType = TestBed.runInInjectionContext(() =>
      inject(ANIMATION_MODULE_TYPE, { optional: true })
    );
    // Optional inject may yield null; both mean no BrowserAnimations / provideAnimations registration.
    expect(animationModuleType == null).toBe(true);
  });

  it('creates the root component', async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideStore({ auth: authReducer })
      ]
    });
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a router-outlet', async () => {
    TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        provideStore({ auth: authReducer })
      ]
    });
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).not.toBeNull();
  });
});
