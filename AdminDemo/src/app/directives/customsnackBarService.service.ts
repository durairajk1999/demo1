import { Injectable, ComponentFactoryResolver, Injector, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CustomSnackbarComponent } from './customSnackBar.component'; 
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CustomSnackbarService {

  constructor(private resolver: ComponentFactoryResolver,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document,private snackBar: MatSnackBar
  ) { }

  open(content: string) {

    
    const factory = this.resolver.resolveComponentFactory(CustomSnackbarComponent);
    const componentRef = factory.create(this.injector);

    componentRef.instance.content = content;
    componentRef.hostView.detectChanges();
    
    const { nativeElement } = componentRef.location;

    this.document.body.appendChild(nativeElement);

    componentRef.instance.afterClose.subscribe(() => {
      componentRef.destroy();
      this.document.body.removeChild(nativeElement);
    });
  }

}