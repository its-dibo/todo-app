import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Board {
  text: string;
  status: 'ok' | 'error' | 'warn';
}
/**
 * displays a board message
 * the message text can be HTML
 */
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @Input() message?: Board;
}
