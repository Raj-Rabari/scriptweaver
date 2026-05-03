import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Wait for the initialization (app-startup refresh) to finish before deciding
  return toObservable(auth.initialized).pipe(
    filter((done) => done),
    take(1),
    map(() => {
      if (auth.isAuthenticated()) return true;
      return router.createUrlTree(['/login']);
    }),
  );
};
