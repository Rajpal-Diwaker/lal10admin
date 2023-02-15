import { FormGroup } from '@angular/forms';

export function DateDiff(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.DateDiff) {
            return;
        }

        const date1: any = new Date(control.value.singleDate.jsDate).getTime();
        const date2: any = new Date(matchingControl.value.singleDate.jsDate).getTime();
        
        if (date2 >= date1) {
            matchingControl.setErrors(null); 
        } else {
            matchingControl.setErrors({ DateDiff: true });  
        }
    }
}