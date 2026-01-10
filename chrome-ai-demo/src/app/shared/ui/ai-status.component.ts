import { Component, input, computed } from '@angular/core';
import { AiCapabilityStatus } from '../types/chrome-ai.types';
import { TitleCasePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { AI_CAPABILITIES } from '../../shared/constants/ai-capabilities.constants';

@Component({
  selector: 'app-ai-status',
  imports: [
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    TitleCasePipe,
  ],
  templateUrl: './ai-status.component.html',
  styleUrl: './ai-status.component.scss',
})
export class AiStatusComponent {
  readonly capabilities = input.required<Record<string, AiCapabilityStatus>>();
  readonly supportSummary = input.required<'none' | 'partial' | 'full'>();

  readonly orderedCapabilities = computed(() => {
    const caps = this.capabilities();
    const order = [
      AI_CAPABILITIES.SUMMARIZER,
      AI_CAPABILITIES.LANGUAGE_DETECTOR,
      AI_CAPABILITIES.TRANSLATOR,
    ];

    return order
      .map((key) => ({ key, value: caps[key] }))
      .filter((item) => item.value !== undefined);
  });
}
