import { formatNumber } from "@angular/common";
import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "formatAmount"
  })
  export class FormatAmountPipe implements PipeTransform {
    transform(value: any) {
    //   const minutes: number = Math.floor(value / 60);
    //   return (
    //     ("00" + minutes).slice(-2) +
    //     ":" +
    //     ("00" + Math.floor(value - minutes * 60)).slice(-2)
    //   );
    var totalAmo = value

    var numAmo: number = +totalAmo;

    let formatAmo = formatNumber(numAmo, 'en-US',
      '1.2');

    var wholeAmo = formatAmo.replace(/,/g, "")

    var deciAmo = Number(wholeAmo)

    var convAmou = deciAmo.toLocaleString('en-IN', {
      minimumFractionDigits: 2, maximumFractionDigits: 2
    })

    return convAmou;
    }
  }