import { Component, input } from '@angular/core';
import { PromptMessage } from '../types/prompt.types';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-chat-message',
  imports: [MatCardModule],
  templateUrl: './chat-message.component.html',
  styleUrl: './chat-message.component.scss',
})
export class ChatMessageComponent {
  readonly message = input.required<PromptMessage>();
}
