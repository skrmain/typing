import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { sentences } from './sentences';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule],
  template: `
    <h1>Welcome to {{title}}!</h1>

    <div class="typing-practice">
      <p class="sentence">
        <span *ngFor="let char of currentSentence.split(''); let i = index"
              [class.correct]="userInput[i] === char"
              [class.incorrect]="userInput[i] && userInput[i] !== char"
              [class.current]="i === userInput.length">
          {{char}}
        </span>
      </p>
      <input [(ngModel)]="userInput" (input)="onInput()" (keydown)="onKeyDown($event)">
      <p>Speed: {{ typingSpeed }} WPM</p>
      <p>Accuracy: {{ accuracy }}%</p>

      <button (click)="generateSentence()">New Sentence</button>
    </div>

    <router-outlet />
  `,
  styles: [`
    :host {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      color: #333;
      text-align: center;
    }

    .typing-practice {
      background-color: #f5f5f5;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    p {
      margin-bottom: 10px;
    }

    textarea {
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: vertical;
    }

    select, button {
      padding: 8px 12px;
      margin-top: 10px;
      border: none;
      border-radius: 4px;
      background-color: #4CAF50;
      color: white;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    select:hover, button:hover {
      background-color: #45a049;
    }

    select {
      background-color: #fff;
      color: #333;
      border: 1px solid #ccc;
    }

    label {
      display: inline-block;
      margin-right: 15px;
    }

    input[type="checkbox"] {
      margin-right: 5px;
    }

    .sentence {
      font-size: 24px;
      text-align: center;
      letter-spacing: 2px;
      margin-bottom: 20px;
    }

    .correct {
      color: green;
    }

    .incorrect {
      color: red;
      text-decoration: underline;
    }

    .current {
      background-color: yellow;
    }

    input {
      width: 100%;
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 18px;
    }
  `],
})
export class AppComponent implements OnInit {
  title = 'Typing Practice';
  currentSentence = '';
  userInput = '';
  typingSpeed = 0;
  accuracy = 100;
  startTime: number | null = null;

  ngOnInit() {
    this.generateSentence();
  }

  generateSentence() {
    this.currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
    this.userInput = '';
    this.startTime = null;
    this.typingSpeed = 0;
    this.accuracy = 100;
  }

  onInput() {
    if (!this.startTime) {
      this.startTime = new Date().getTime();
    }

    const currentTime = new Date().getTime();
    const timeElapsed = (currentTime - this.startTime) / 60000; // in minutes

    const wordsTyped = this.userInput.trim().split(/\s+/).length;
    this.typingSpeed = Math.round(wordsTyped / timeElapsed);

    const correctChars = this.userInput.split('').filter((char, index) => char === this.currentSentence[index]).length;
    this.accuracy = Math.round((correctChars / this.userInput.length) * 100);
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Backspace' && this.userInput.length > 0) {
      this.userInput = this.userInput.slice(0, -1);
      event.preventDefault();
    }
  }
}
