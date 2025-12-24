import { Component, input } from '@angular/core';
import { AiCapabilityStatus } from '../types/chrome-ai.types';
import { KeyValuePipe, TitleCasePipe } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-ai-status',
  imports: [
    MatChipsModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    KeyValuePipe,
    TitleCasePipe,
  ],
  templateUrl: './ai-status.component.html',
  styleUrl: './ai-status.component.scss',
})
export class AiStatusComponent {
  readonly capabilities = input.required<Record<string, AiCapabilityStatus>>();
  readonly supportSummary = input.required<'none' | 'partial' | 'full'>();
}
