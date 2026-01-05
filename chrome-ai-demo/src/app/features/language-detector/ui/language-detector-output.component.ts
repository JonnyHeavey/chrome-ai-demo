import { Component, input } from '@angular/core';
import { PercentPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { LanguageDetectionResult } from '../types/language-detector.types';

@Component({
  selector: 'app-language-detector-output',
  imports: [PercentPipe, MatCardModule, MatProgressBarModule],
  templateUrl: './language-detector-output.component.html',
  styleUrls: ['./language-detector-output.component.scss'],
})
export class LanguageDetectorOutputComponent {
  readonly results = input<LanguageDetectionResult[]>([]);
}
