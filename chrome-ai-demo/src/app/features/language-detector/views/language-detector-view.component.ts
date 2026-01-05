import { Component, inject } from '@angular/core';
import { LanguageDetectorStore } from '../stores/language-detector.store';
import { LanguageDetectorInputComponent } from '../ui/language-detector-input.component';
import { LanguageDetectorOutputComponent } from '../ui/language-detector-output.component';
import { FeatureLayoutComponent } from '../../../shared/ui/layout/feature-layout.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-language-detector-view',
  imports: [
    LanguageDetectorInputComponent,
    LanguageDetectorOutputComponent,
    FeatureLayoutComponent,
    MatButtonModule,
  ],
  providers: [LanguageDetectorStore],
  templateUrl: './language-detector-view.component.html',
})
export class LanguageDetectorViewComponent {
  readonly store = inject(LanguageDetectorStore);
}
