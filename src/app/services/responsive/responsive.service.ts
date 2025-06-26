import { Injectable, computed, signal, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ResponsiveService {
  private breakpointObserver = inject(BreakpointObserver);

  // Signal for isMobile
  readonly isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset]).pipe(
      // Map result to true/false
      // `result.matches` is true when screen matches mobile
      map((result) => result.matches)
    ),
    { initialValue: false }
  );
}
