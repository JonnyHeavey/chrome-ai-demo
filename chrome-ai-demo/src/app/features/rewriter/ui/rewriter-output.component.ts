import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-rewriter-output',
  imports: [MatCardModule],
  templateUrl: './rewriter-output.component.html',
  styleUrl: './rewriter-output.component.scss',
})
export class RewriterOutputComponent {
  readonly outputText = input<string>('');
}
