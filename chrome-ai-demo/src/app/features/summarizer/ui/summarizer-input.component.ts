import { Component, input, output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-summarizer-input',
  imports: [MatInputModule, MatFormFieldModule],
  templateUrl: './summarizer-input.component.html',
  styleUrl: './summarizer-input.component.scss',
})
export class SummarizerInputComponent {
  readonly inputText = input<string>('');
  readonly inputTextChanged = output<string>();

  onInputChange(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.inputTextChanged.emit(textarea.value);
  }
}
