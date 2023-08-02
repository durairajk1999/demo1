import { Component, OnInit,Inject, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA ,MatDialog} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxSpinnerService } from 'ngx-spinner';
import { empty } from 'rxjs';
import { PopUpComponent } from 'src/app/pop-up-component';


@Component({
  selector: 'app-pop-up-component',
  templateUrl: './pop-up-component.component.html',
  styleUrls: ['./pop-up-component.component.scss']
})
export class PopUpComponentComponent implements OnInit {
  commentRequired!: boolean
  commentLen!: boolean
  myForm!: FormGroup;
  hideRequiredMarker = true;

  commentFC = new FormControl('', [
    Validators.required, 
    Validators.minLength(3)
  ]);

  onBlur(): void {
this.commentFC.markAsUntouched()
}
  constructor(
    public dialogRef: MatDialogRef<PopUpComponent>,private cdref: ChangeDetectorRef,
    
    @Inject(MAT_DIALOG_DATA) public data: any , private spinnerService: NgxSpinnerService , private snackBar: MatSnackBar,) {
      // dialogRef.disableClose = true;



    }

    onCommentChange() {
      
    } 
  onNoClick(): void {
    this.dialogRef.close();
  }
  myMethod(val:any){ 
if(this.commentFC.valid){

  this.data.comment=val
  
  
  this.dialogRef.close(val);


  
}
else{
  
  
}
   
 
 
   
  }
  ngOnInit(): void {
  }
  ngAfterContentChecked() {
    
    this.cdref.detectChanges();
 }
  checkstuff(event: any) {
    if (event.target.value.substr(-1) === ' ' && event.code === 'Space') {
      
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
  
  
  isAlfa(evt: any) {

    evt = (evt || window.event);
    var charCode = (evt.which || evt.keyCode);
    var slash = "/";
    var hypen = "-";
    var openBracket = "(";
    var closeBracket = ")";
    var quote = "'";
    var queMark = "?" ;
    var specialCharacters: any

    var arrowLeft = 'ArrowLeft' ;
    var arrowRight = 'ArrowRight' ;
    var arrowUp = 'ArrowUp';
    var arrowDown = 'ArrowDown';
   
    

    

    if (evt.key == arrowUp||evt.key == arrowDown||evt.key == queMark||evt.key == quote ||evt.key==arrowRight||evt.key==arrowRight||evt.key == arrowLeft||slash == evt.key || hypen == evt.key || openBracket == evt.key || closeBracket == evt.key || evt.key == "." || evt.key == ",") {
      specialCharacters = false;
    }
    else {
      specialCharacters = true;
    }
    // number if
    var numberBoolean: any;
    if (evt.key == "0" || evt.key == "1" || evt.key == "2" || evt.key == "3" || evt.key == "4" || evt.key == "5" || evt.key == "6" || evt.key == "7" || evt.key == "8" || evt.key == "9") {
      numberBoolean = false;
    }
    else {
      numberBoolean = true;
    }
    return (((charCode > 32) && (charCode < 65 || charCode > 90) && (charCode < 97 || charCode > 122) && (specialCharacters) && (numberBoolean)) || this.willCreateWhitespaceSequence(evt)) ? false : true;
  }

  
  
  handleInput(event: any) {
    if (event.target.selectionEnd === 0 && event.code === 'Space') {
      event.preventDefault();
    }
  }
}
