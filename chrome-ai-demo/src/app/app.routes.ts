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
  {
    path: 'language-detector',
    loadComponent: () =>
      import(
        './features/language-detector/views/language-detector-view.component'
      ).then((m) => m.LanguageDetectorViewComponent),
  },
  {
    path: 'translator',
    loadComponent: () =>
      import('./features/translator/views/translator-view.component').then(
        (m) => m.TranslatorViewComponent
      ),
  },
  {
    path: 'prompt',
    loadComponent: () =>
      import('./features/prompt/views/prompt-view.component').then(
        (m) => m.PromptViewComponent
      ),
  },
];
