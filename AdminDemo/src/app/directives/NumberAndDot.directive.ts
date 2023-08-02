import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[numberAndDot]'
})
export class NumberAndDotDirective {

    regexStr = '^[0-9.]+$';
    @Input() isAlphaNumeric!: boolean;

    constructor(private el: ElementRef) { }

    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {

        if (this.el.nativeElement.selectionStart === 0 && event.key === '.') {
            event.preventDefault();
        }
        if (event.keyCode === 8 || event.keyCode === 37 || event.keyCode === 39 || event.keyCode === 46) {
            return;
        }
        else if (!RegExp(this.regexStr).test(event.key)) {
            event.preventDefault();
        }

        var longspace = this.SequenceOfPeriod(event);
        if (longspace) {
            event.preventDefault();
        }
    }


    isPeriod(char: any) {
        return (/\./).test(char);
    }
    SequenceOfPeriod(evt: any) {
        var willCreateWSS = false;
        if (this.isPeriod(evt.key)) {

            var elmInput = evt.currentTarget;
            var content = elmInput.value;

            var posStart = elmInput.selectionStart;
            var posEnd = elmInput.selectionEnd;

            willCreateWSS = (
                this.isPeriod(content[posStart - 1] || '')
                || this.isPeriod(content[posEnd] || '')
            );
        }
        return willCreateWSS;
    }
    @HostListener('keyup', ['$event']) onKeyup(event: KeyboardEvent) {
        this.validateFields(event);
      }
    validateFields(event: any) {

        this.el.nativeElement.value = this.el.nativeElement.value.replace(/^\./g, '').replace(/[^0-9.]/g, '').replace(/\.+/g, '.');
        event.preventDefault();


    }

}