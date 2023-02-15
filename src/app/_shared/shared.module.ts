import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NumberonlyDirective } from '../_directives/numberonly.directive';
import { FormsModule } from '@angular/forms';
import { StringLengthPipe } from '../_pipes/string-length.pipe';
import { SafeHtmlPipe } from '../_pipes/safe-html.pipe';
import { TwoDigitDecimaNumberDirective } from '../_directives/decimalNumber.directive';
import { onlyAlpabetDirective } from '../_directives/onlyAlphabet.directive';

@NgModule({
  declarations: [onlyAlpabetDirective,NumberonlyDirective,StringLengthPipe,SafeHtmlPipe,TwoDigitDecimaNumberDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    ReactiveFormsModule,
    NumberonlyDirective,
    StringLengthPipe,
    SafeHtmlPipe,
    TwoDigitDecimaNumberDirective,
    FormsModule,
    onlyAlpabetDirective
  ]
})
export class SharedModule { }
