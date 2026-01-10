import { Component, inject, computed } from '@angular/core';
import { AiStatusComponent } from './shared/ui/ai-status.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AppStore } from './core/stores/app.store';
import { AI_CAPABILITIES } from './shared/constants/ai-capabilities.constants';

@Component({
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule,
    AiStatusComponent,
  ],
  providers: [AppStore],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly store = inject(AppStore);

  readonly tabs = computed(() => [
    {
      label: 'Summarizer',
      link: '/summarizer',
      icon: 'summarize',
      disabled:
        !this.store.capabilities()[AI_CAPABILITIES.SUMMARIZER].isSupported,
    },
    {
      label: 'Language Detector',
      link: '/language-detector',
      icon: 'language',
      disabled:
        !this.store.capabilities()[AI_CAPABILITIES.LANGUAGE_DETECTOR]
          .isSupported,
    },
    {
      label: 'Translator',
      link: '/translator',
      icon: 'translate',
      disabled:
        !this.store.capabilities()[AI_CAPABILITIES.TRANSLATOR].isSupported,
    },
  ]);
}
