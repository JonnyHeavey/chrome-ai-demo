import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-language-detector-input',
  imports: [FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './language-detector-input.component.html',
  styleUrls: ['./language-detector-input.component.scss'],
})
export class LanguageDetectorInputComponent {
  readonly disabled = input(false);
  readonly inputText = input('');
  readonly inputTextChanged = output<string>();
}
