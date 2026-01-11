import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-writer-output',
  imports: [MatCardModule],
  templateUrl: './writer-output.component.html',
  styleUrl: './writer-output.component.scss',
})
export class WriterOutputComponent {
  readonly outputText = input<string>('');
}
