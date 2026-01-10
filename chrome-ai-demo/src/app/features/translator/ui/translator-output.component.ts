import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-translator-output',
  imports: [MatCardModule],
  templateUrl: './translator-output.component.html',
  styleUrl: './translator-output.component.scss',
})
export class TranslatorOutputComponent {
  readonly translatedText = input.required<string>();
}
