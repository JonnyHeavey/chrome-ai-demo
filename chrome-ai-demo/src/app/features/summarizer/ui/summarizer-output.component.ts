import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-summarizer-output',
  imports: [MatCardModule],
  templateUrl: './summarizer-output.component.html',
  styleUrl: './summarizer-output.component.scss',
})
export class SummarizerOutputComponent {
  readonly outputText = input<string>('');
}
