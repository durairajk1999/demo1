import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { trigger, style, animate, transition, state } from '@angular/animations';

@Component({
    template: `
 <div class="snackbar-container" (animationend)="animationDone($event)">
            <!-- <mat-icon>thumb_up</mat-icon> -->
            <div class="wave" style="margin-left:-15px">👋</div>
            &nbsp;
            {{ content }}

          </div>
  `
})
export class CustomSnackbarComponent {
    @Input() content = '';
    @Output() afterClose = new EventEmitter();

    animationDone(event: AnimationEvent) {
        if (event.animationName === 'snackbarOut') {
            this.afterClose.emit(true);
        }
    }

    constructor(private host: ElementRef<HTMLElement>) {

        setTimeout(() => {
            this.close();
        }, 3000)
    }

    get container(): HTMLElement {
        return this.host.nativeElement.querySelector('.snackbar-container') as HTMLElement;
    }

    close() {
        this.container.style.animation = 'snackbarOut 0.3s';
    }

}