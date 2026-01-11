import { Component, inject, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FeatureLayoutComponent } from '../../../shared/ui/layout/feature-layout.component';
import { RewriterStore } from '../stores/rewriter.store';
import { RewriterService } from '../services/rewriter.service';
import { RewriterInputComponent } from '../ui/rewriter-input.component';
import { RewriterOutputComponent } from '../ui/rewriter-output.component';

@Component({
  selector: 'app-rewriter-view',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RewriterInputComponent,
    RewriterOutputComponent,
    FeatureLayoutComponent,
  ],
  providers: [RewriterStore, RewriterService],
  templateUrl: './rewriter-view.component.html',
  styleUrl: './rewriter-view.component.scss',
})
export class RewriterViewComponent {
  protected readonly store = inject(RewriterStore);

  constructor() {
    effect(() => {
      if (!this.store.isModelDownloaded() && !this.store.isDownloadingModel()) {
        this.store.downloadModel();
      }
    });
  }
}
