import { Component, input, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import {
  RewriterTone,
  RewriterFormat,
  RewriterLength,
} from '../types/rewriter.types';

@Component({
  selector: 'app-rewriter-input',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    FormsModule,
  ],
  templateUrl: './rewriter-input.component.html',
  styleUrl: './rewriter-input.component.scss',
})
export class RewriterInputComponent {
  readonly inputText = input.required<string>();
  readonly context = input<string>('');
  readonly tone = input.required<RewriterTone>();
  readonly format = input.required<RewriterFormat>();
  readonly length = input.required<RewriterLength>();
  readonly disabled = input<boolean>(false);

  readonly inputTextChange = output<string>();
  readonly contextChange = output<string>();
  readonly toneChange = output<RewriterTone>();
  readonly formatChange = output<RewriterFormat>();
  readonly lengthChange = output<RewriterLength>();
}
