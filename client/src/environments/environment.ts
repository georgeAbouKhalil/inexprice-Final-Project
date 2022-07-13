// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // productsUrl: "http://localhost:3001/api/products/",
  registerUrl: "http://localhost:3001/api/auth/register/",
  loginUrl: "http://localhost:3001/api/auth/login",
  categories: 'http://localhost:3001/api/categories/',
  prodByCat : 'http://localhost:3001/api/products/by-types/',
  productUrl: 'http://localhost:3001/api/products/',
  cartUrl : 'http://localhost:3001/api/carts/',
  cartItemUrl : 'http://localhost:3001/api/cartItem/',
  creditCardUrl : 'http://localhost:3001/api/creditCard/',
  orderUrl: 'http://localhost:3001/api/orders/',
  wishListUrl: 'http://localhost:3001/api/wishList/',
  messageUrl: 'http://localhost:3001/api/message/',
  mailUrl: 'http://localhost:3001/api/mail/sendMail/',
  mailOrderUrl: 'http://localhost:3001/api/mail/sendMailOrder/',
  reviewUrl: 'http://localhost:3001/api/review/',
  

};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
