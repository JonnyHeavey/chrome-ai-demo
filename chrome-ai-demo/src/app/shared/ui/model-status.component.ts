import { Component, input, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-model-status',
  imports: [
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './model-status.component.html',
  styleUrl: './model-status.component.scss',
})
export class ModelStatusComponent {
  readonly isReady = input(false);
  readonly isDownloading = input(false);
  readonly progress = input(0);
  readonly downloadError = input<string | null>(null);
  readonly retry = output<void>();
}
