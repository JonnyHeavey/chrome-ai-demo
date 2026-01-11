import { Component, inject, effect } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FeatureLayoutComponent } from '../../../shared/ui/layout/feature-layout.component';
import { WriterStore } from '../stores/writer.store';
import { WriterService } from '../services/writer.service';
import { WriterInputComponent } from '../ui/writer-input.component';
import { WriterOutputComponent } from '../ui/writer-output.component';

@Component({
  selector: 'app-writer-view',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatExpansionModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    WriterInputComponent,
    WriterOutputComponent,
    FeatureLayoutComponent,
  ],
  providers: [WriterStore, WriterService],
  templateUrl: './writer-view.component.html',
  styleUrl: './writer-view.component.scss',
})
export class WriterViewComponent {
  protected readonly store = inject(WriterStore);

  constructor() {
    effect(() => {
      if (!this.store.isModelDownloaded() && !this.store.isDownloadingModel()) {
        this.store.downloadModel();
      }
    });
  }
}
