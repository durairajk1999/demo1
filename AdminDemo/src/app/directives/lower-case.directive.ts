import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { DefaultValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appLowerCase]'
})
export class LowerCaseDirective  extends DefaultValueAccessor{

  @HostListener('input', ['$event']) input($event: InputEvent) {
    const target = $event.target as HTMLInputElement;
    const start = target.selectionStart;

    target.value = target.value.toLowerCase();
    target.setSelectionRange(start, start);

    this.onChange(target.value);
}

constructor(renderer: Renderer2, elementRef: ElementRef) {
    super(renderer, elementRef, false);
}
}