
import * as CryptoJS from 'crypto-js';
import { Cipher } from 'crypto';
import { Observable, fromEvent, observable } from 'rxjs';
import { map, filter, debounceTime } from 'rxjs/operators';
import { AES, enc } from 'crypto-js';
import { formatNumber } from '@angular/common';
import { OnInit } from '@angular/core';
import { ServicesService } from './services.service';
import { constrainedMemory } from 'process';



export class EncryptionAndDecryption {



  constructor() {

  }


  //   decryptfinal(data: any,who:any) {

  // let keyBytes: Uint8Array = new Uint8Array(16);
  //     const aesKey: string = "#%&ATv610cfP2apQ";
  //     const encoder: TextEncoder = new TextEncoder();
  //     var keyBytes1: Uint8Array = encoder.encode(aesKey);
  //     keyBytes.set(keyBytes1) //noted 
  //     var string = new TextDecoder().decode(keyBytes);
  //     const finKey = CryptoJS.enc.Utf8.parse(aesKey);
  //     const finiv = CryptoJS.enc.Utf8.parse(aesKey);
  //     var decrypted = CryptoJS.AES.decrypt(data, finKey, {
  //       keySize: 128 / 8,
  //       iv: finiv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     });
  //     var decrt = decrypted.toString(CryptoJS.enc.Utf8);
  //     return decrt.toString();
  //   }







  //   keyDecryptfinal(data: any) {




  //     let keyBytes: Uint8Array = new Uint8Array(16);
  //     const aesKey: string =data;
  //     const encoder: TextEncoder = new TextEncoder();
  //     var keyBytes1: Uint8Array = encoder.encode(aesKey);
  //     keyBytes.set(keyBytes1) //noted 
  //     var string = new TextDecoder().decode(keyBytes);
  //     const finKey = CryptoJS.enc.Utf8.parse(aesKey);
  //     const finiv = CryptoJS.enc.Utf8.parse(aesKey);
  //     var decrypted = CryptoJS.AES.decrypt(data, finKey, {
  //       keySize: 128 / 8,
  //       iv: finiv,
  //       mode: CryptoJS.mode.CBC,
  //       padding: CryptoJS.pad.Pkcs7
  //     });
  //     var decrt = decrypted.toString(CryptoJS.enc.Utf8);
  //     return decrt.toString();
  //   }


  ////////////////////////////////// 

  encryptfinal(data: any, encryptKey: string) {

    
    let keyBytes: Uint8Array = new Uint8Array(16);
    const aesKey: string = encryptKey;
    const encoder: TextEncoder = new TextEncoder();
    var keyBytes1: Uint8Array = encoder.encode(aesKey);
    keyBytes.set(keyBytes1) //noted 
    var string = new TextDecoder().decode(keyBytes);
    const finKey = CryptoJS.enc.Utf8.parse(string);
    const finiv = CryptoJS.enc.Utf8.parse(string);
    var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), finKey, {
      keySize: 128 / 8,
      iv: finiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();

  }

  decryptfinal(data: any, decryptKey: string) {
    let keyBytes: Uint8Array = new Uint8Array(16);
    const aesKey: string = decryptKey;
    const encoder: TextEncoder = new TextEncoder();
    var keyBytes1: Uint8Array = encoder.encode(aesKey);
    keyBytes.set(keyBytes1) //noted 
    var string = new TextDecoder().decode(keyBytes);
    const finKey = CryptoJS.enc.Utf8.parse(string);
    const finiv = CryptoJS.enc.Utf8.parse(string);
    var decrypted = CryptoJS.AES.decrypt(data, finKey, {
      keySize: 128 / 8,
      iv: finiv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    var decrt = decrypted.toString(CryptoJS.enc.Utf8);
    return decrt.toString();
  }
}

