import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-writer-input',
  imports: [MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './writer-input.component.html',
  styleUrl: './writer-input.component.scss',
})
export class WriterInputComponent {
  readonly input = input.required<string>();
  readonly disabled = input<boolean>(false);
  readonly inputChange = output<string>();
}
