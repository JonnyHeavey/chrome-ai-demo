import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  { path: '', redirectTo: 'summarizer', pathMatch: 'full' },
  {
    path: 'summarizer',
    loadComponent: () =>
      import('./features/summarizer/views/summarizer-view.component').then(
        (m) => m.SummarizerViewComponent
      ),
  },
];
