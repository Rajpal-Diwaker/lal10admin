import { FormGroup } from '@angular/forms';

export function UrlChecker(controlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        
        // tslint:disable-next-line: triple-equals
        if ( control.value.indexOf('.com') == -1 && control.value.indexOf('www.') == -1) {
            control.setErrors({ urlChecker: true });
        } else {
            control.setErrors(null);
        }
    }
}