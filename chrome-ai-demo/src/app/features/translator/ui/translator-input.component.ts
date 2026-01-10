import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-translator-input',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule],
  templateUrl: './translator-input.component.html',
  styleUrl: './translator-input.component.scss',
})
export class TranslatorInputComponent {
  readonly sourceLanguage = input.required<string>();
  readonly targetLanguage = input.required<string>();
  readonly inputText = input.required<string>();
  readonly disabled = input<boolean>(false);

  readonly sourceLanguageChange = output<string>();
  readonly targetLanguageChange = output<string>();
  readonly inputTextChanged = output<string>();

  readonly languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'ja', name: 'Japanese' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
  ];
}
