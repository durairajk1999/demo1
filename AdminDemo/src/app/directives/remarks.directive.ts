import { Directive, HostListener, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[remarks]'
})
export class RemarksDirective {
    regexStr = '^[a-zA-Z0-9., ]*$';
    // @Input() isAlphaNumeric: boolean;
  
    constructor(private el: ElementRef) { }
  
  
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) { 
  
    //  if ( this.el.nativeElement.selectionStart === 0 && event.key === ' ' ) {
    //    event.preventDefault();
    //  }
     if (this.el.nativeElement.selectionStart === 0 && event.key === '.') {
        event.preventDefault();
    }
    if (this.el.nativeElement.selectionStart === 0 && event.key === ',') {
        event.preventDefault();
    }
      if (!RegExp(this.regexStr).test(event.key)) {
        event.preventDefault();
      }
    }

    @HostListener('keyup', ['$event']) onKeyup(event: KeyboardEvent) {
        this.validateFields(event);
      }
  
    validateFields(event:any) {
        this.el.nativeElement.value = this.el.nativeElement.value.replace(/^\./g, '').replace(/^\,/g, '').replace(/[^A-Za-z0-9.,-/ ]/g, '');
        event.preventDefault();
    }

}