import { Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ModelStatusComponent } from '../model-status.component';

@Component({
  selector: 'app-feature-layout',
  imports: [MatCardModule, ModelStatusComponent],
  templateUrl: './feature-layout.component.html',
  styles: [
    `
      mat-card-header {
        margin-bottom: 2rem;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
      }

      app-model-status {
        max-width: 400px;
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }

      mat-card-title {
        margin-bottom: 1rem;
      }
    `,
  ],
})
export class FeatureLayoutComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();

  readonly isReady = input(false);
  readonly isDownloading = input(false);
  readonly progress = input(0);
  readonly downloadError = input<string | null>(null);

  readonly retry = output<void>();
}
