// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
export const environment = {
  production: false,
  knowlarity: 'https://kpi.knowlarity.com/Basic/v1/account/call/makecall',

  // base_url: 'https://lal10.com/ap',      // live
  // image_url: 'https://lal10.com/ap/',    // live

  base_url: 'http://15.207.157.139:5578',    /* development */
  image_url: 'ttp://15.207.157.139:5578/',     /* development */

  /* firebase cred start here */
  firebase: {
    apiKey: 'AIzaSyCxqWTYChwEk6My7r8c5PI2q4jpvlfe3us',
    authDomain: 'lal10-3c896.firebaseapp.com',
    databaseURL: 'https://lal10-3c896.firebaseio.com',
    projectId: 'lal10-3c896',
    storageBucket: 'lal10-3c896.appspot.com',
    messagingSenderId: '33195837394',
    appId: '1:33195837394:web:e1e96873a147b0775cea0b',
    measurementId: 'G-JL8ZPKHSF1'

  }



};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
