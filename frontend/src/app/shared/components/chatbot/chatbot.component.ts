import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LucideAngularModule, MessageCircle, X, Send } from 'lucide-angular';

interface ChatMessage {
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    LucideAngularModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.scss']
})
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  readonly MessageCircleIcon = MessageCircle;
  readonly XIcon = X;
  readonly SendIcon = Send;

  isOpen = false;
  currentMessage = '';
  isTyping = false;
  
  messages: ChatMessage[] = [
    { text: 'Hi there! I am the UNLOST Assistant. How can I help you find or report an item today?', sender: 'bot', timestamp: new Date() }
  ];

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.scrollToBottom();
    }
  }

  sendMessage() {
    if (!this.currentMessage.trim()) return;

    this.messages.push({
      text: this.currentMessage,
      sender: 'user',
      timestamp: new Date()
    });

    const userQuery = this.currentMessage;
    this.currentMessage = '';
    this.isTyping = true;
    this.scrollToBottom();

    // Simulate bot response
    setTimeout(() => {
      this.isTyping = false;
      this.messages.push({
        text: this.generateBotResponse(userQuery),
        sender: 'bot',
        timestamp: new Date()
      });
      this.scrollToBottom();
    }, 1000);
  }

  generateBotResponse(query: string): string {
    const q = query.toLowerCase();
    if (q.includes('lost') || q.includes('report')) {
      return 'To report a lost item, please click on the "Report Lost" button in the navigation bar. You will need to provide details like the item category, description, and where you think you lost it.';
    } else if (q.includes('found') || q.includes('claim')) {
      return 'If you found an item, you can report it via the "Report Found" page. If you are looking for an item you lost, check the "Browse Items" page and you can submit a claim if you spot it!';
    } else {
      return 'I am here to help you navigate UNLOST. You can ask me how to report items, browse the lost & found inventory, or claim your belongings.';
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
}
