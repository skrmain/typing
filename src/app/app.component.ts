import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { sentences } from './sentences';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, ReactiveFormsModule, CommonModule],
    template: `
        <div class="typing-practice">
            <p class="sentence" (click)="inputElement.focus()">
                <span
                    *ngFor="let char of currentSentence.split(''); let i = index"
                    [class.correct]="userInput.value?.[i] === char"
                    [class.incorrect]="userInput.value?.[i] && userInput.value?.[i] !== char"
                    [class.current]="i === userInput.value?.length && document.activeElement === inputElement"
                >
                    {{ char }}
                </span>
            </p>
            <input
                #inputElement
                [formControl]="userInput"
                (input)="onInput()"
                (keydown)="onKeyDown($event)"
                [attr.maxlength]="currentSentence.length"
                autofocus
            />
            <p>Speed: {{ typingSpeed }} WPM</p>
            <p>Accuracy: {{ accuracy }}%</p>

            <button (click)="generateSentence()">New Sentence</button>
        </div>
        <router-outlet />
    `,
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    currentSentence = '';
    document = document;
    userInput = new FormControl('');
    typingSpeed = 0;
    accuracy = 100;
    startTime: number | null = null;

    ngOnInit() {
        this.generateSentence();
    }

    generateSentence() {
        this.currentSentence = sentences[Math.floor(Math.random() * sentences.length)];
        this.userInput.setValue('', { emitEvent: false });
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

        const userInputValue = this.userInput.value || '';
        const wordsTyped = userInputValue.trim().split(/\s+/).length;
        this.typingSpeed = Math.round(wordsTyped / timeElapsed);

        const correctChars = userInputValue
            .split('')
            .filter((char, index) => char === this.currentSentence[index]).length;
        this.accuracy = userInputValue.length > 0 ? Math.round((correctChars / userInputValue.length) * 100) : 100;
    }

    onKeyDown(event: KeyboardEvent) {
        if (event.key === 'Backspace' && this.userInput.value && this.userInput.value.length > 0) {
            const currentValue = this.userInput.value;
            this.userInput.setValue(currentValue.slice(0, -1), { emitEvent: false });
            this.onInput(); // Manually trigger input handling
            event.preventDefault();
        }
    }
}
