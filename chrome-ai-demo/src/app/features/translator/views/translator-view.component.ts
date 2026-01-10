import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { TranslatorStore } from '../stores/translator.store';
import { TranslatorService } from '../services/translator.service';
import { TranslatorInputComponent } from '../ui/translator-input.component';
import { TranslatorOutputComponent } from '../ui/translator-output.component';
import { FeatureLayoutComponent } from '../../../shared/ui/layout/feature-layout.component';

@Component({
  selector: 'app-translator-view',
  imports: [
    TranslatorInputComponent,
    TranslatorOutputComponent,
    FeatureLayoutComponent,
    MatButtonModule,
  ],
  providers: [TranslatorStore, TranslatorService],
  templateUrl: './translator-view.component.html',
  styleUrl: './translator-view.component.scss',
})
export class TranslatorViewComponent {
  protected readonly store = inject(TranslatorStore);
}
