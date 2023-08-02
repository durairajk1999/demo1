// import {
//     Directive,
//     ElementRef,
//     HostListener,
//     Renderer2,
//     forwardRef
// } from '@angular/core';



// @Directive({
//     selector: '[noSpace]',
// })
// export class NoSpaceDirective {
//     constructor(private renderer: Renderer2, elementRef: ElementRef) {
//     }
//     @HostListener('input', ['$event']) input(event: KeyboardEvent) {
//         let value = (<HTMLInputElement>event.target).value.replace(/ /g, ' ');
//         this.renderer.setProperty(<HTMLInputElement>event.target, 'value', value);
//     }

// }

import {
    Directive,
    ElementRef,
    HostListener,
} from '@angular/core';

@Directive({
    selector: '[noSpace]',
})
export class NoSpaceDirective {
    constructor(private el: ElementRef) {
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    }

    @HostListener('keyup', ['$event']) onKeyup(event: KeyboardEvent) {
        this.validateFields(event);
      }

    validateFields(event:any) {
        // setTimeout(() => {

          this.el.nativeElement.value = this.el.nativeElement.value.replace(/\s/g, '');
          event.preventDefault();
        // }, 100)
      }
}