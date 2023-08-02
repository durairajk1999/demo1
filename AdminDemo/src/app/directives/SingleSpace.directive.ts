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
    selector: '[singleSpace]',
})
export class SingleSpaceDirective {
    constructor(private el: ElementRef) {
    }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        if (this.el.nativeElement.selectionStart === 0 && event.keyCode === 32) {
            event.preventDefault();
        }
        var longspace = this.willCreateWhitespaceSequence(event);
        if (longspace) {
            event.preventDefault();
        }
    }


    isWhiteSpace(char: any) {
        return (/\s/).test(char);
    }
    willCreateWhitespaceSequence(evt: any) {
        var willCreateWSS = false;
        if (this.isWhiteSpace(evt.key)) {

            var elmInput = evt.currentTarget;
            var content = elmInput.value;

            var posStart = elmInput.selectionStart;
            var posEnd = elmInput.selectionEnd;

            willCreateWSS = (
                this.isWhiteSpace(content[posStart - 1] || '')
                || this.isWhiteSpace(content[posEnd] || '')
            );
        }
        return willCreateWSS;
    }

    @HostListener('keyup', ['$event']) onKeyup(event: KeyboardEvent) {
        this.validateFields(event);
      }

    validateFields(event:any) {
        // setTimeout(() => {

          this.el.nativeElement.value = this.el.nativeElement.value.replace(/^\s/g, '').replace(/\s+/g, ' ');
          event.preventDefault();
        // }, 100)
      }
}