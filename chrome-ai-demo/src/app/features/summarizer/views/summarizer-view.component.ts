import { Component, inject, effect } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { SummarizerStore } from '../stores/summarizer.store';
import { SummarizerService } from '../services/summarizer.service';
import { SummarizerInputComponent } from '../ui/summarizer-input.component';
import { SummarizerOutputComponent } from '../ui/summarizer-output.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ModelStatusComponent } from '../../../shared/ui/model-status.component';

@Component({
  selector: 'app-summarizer-view',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    SummarizerInputComponent,
    SummarizerOutputComponent,
    ModelStatusComponent,
  ],
  providers: [SummarizerStore, SummarizerService],
  templateUrl: './summarizer-view.component.html',
  styleUrl: './summarizer-view.component.scss',
})
export class SummarizerViewComponent {
  protected readonly store = inject(SummarizerStore);

  constructor() {
    effect(() => {
      if (!this.store.isModelDownloaded() && !this.store.isDownloadingModel()) {
        this.store.downloadModel();
      }
    });
  }
}
