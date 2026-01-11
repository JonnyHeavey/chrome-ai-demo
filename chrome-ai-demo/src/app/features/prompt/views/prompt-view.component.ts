import {
  Component,
  inject,
  effect,
  viewChild,
  ElementRef,
} from '@angular/core';
import { PromptStore } from '../stores/prompt.store';
import { PromptService } from '../services/prompt.service';
import { ChatInputComponent } from '../ui/chat-input.component';
import { ChatMessageComponent } from '../ui/chat-message.component';
import { FeatureLayoutComponent } from '../../../shared/ui/layout/feature-layout.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-prompt-view',
  imports: [
    ChatInputComponent,
    ChatMessageComponent,
    FeatureLayoutComponent,
    MatButtonModule,
  ],
  providers: [PromptStore, PromptService],
  templateUrl: './prompt-view.component.html',
  styleUrl: './prompt-view.component.scss',
})
export class PromptViewComponent {
  protected readonly store = inject(PromptStore);

  readonly messagesContainer =
    viewChild.required<ElementRef<HTMLElement>>('messagesContainer');

  constructor() {
    effect(() => {
      const messages = this.store.messages();
      if (messages.length) {
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });
  }

  scrollToBottom(): void {
    const messagesEl = this.messagesContainer().nativeElement;
    if (messagesEl) {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }
  }
}
