import { Component, OnInit } from '@angular/core';
import { Subscription , interval } from 'rxjs';
import { CartModel } from '../models/cart.model';
import { CategoryModel } from '../models/category.model';
import { ProductModel } from '../models/product.model';
import { AuthService } from '../services/auth.service';
import { CartsService } from '../services/cart.service';
import { NotifyService } from '../services/notify.service';
import { ProductsService } from '../services/products.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public user: any;
  public error: string = '';

  public cart: any;
  public count: number = 0;
  public amount: number = 1;
  public productToAdd: ProductModel;
  cartProducts: any;
  cartP: any[];
  products: any;
  updateStockProduct: ProductModel;
  stock: any;
  getProduct: any;
  productStock: number;
  sum: number;
  quantityCart: number;
  disProducts:any[] = [];
  chepProducts:any[] = [];

  private subscription: Subscription;
  constructor(private notify: NotifyService,public myAuthService: AuthService, public cartsService: CartsService,public productsService: ProductsService) { }

  public dateNow = new Date('Mar 19 2022 23:07:00');
  public dDay = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  public timeDifference;
  public seconds;
  public minutes;
  public hours;
  public days;


  private getTimeDifference () {
    this.timeDifference = this.dDay.getTime() - new Date().getTime();
    this.allocateTimeUnits(this.timeDifference);
}

private allocateTimeUnits (timeDifference) {
    this.seconds = Math.floor((timeDifference) / (1000) % 60);
    this.minutes = Math.floor((timeDifference) / (1000 * 60) % 60);
    this.hours = Math.floor((timeDifference) / (1000 * 60 * 60) % 24);
    this.days = Math.floor((timeDifference) / (1000 * 60 * 60 * 24));
}
  

  ngOnInit(): void {
    this.getTimeDifference(); 
    
    
    this.subscription = interval(1000).subscribe(x => { 
        this.getTimeDifference(); 
        if( this.days < 0 && this.hours < 0 && this.minutes < 0 && this.seconds < 0){
        this.dateNow = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));
        this.dDay = new Date(this.dateNow.getTime() + (30 * 24 * 60 * 60 * 1000));

        this.getTimeDifference();  
      }
        });
        this.user = this.myAuthService.getUser();

if (this.user){
        this.getCart();
        // this.getCartItems();
}

//get the products
this.productsService.getProducts().subscribe(
  (productsList) => {
    this.productsService.products = productsList;
    //get product they have discount
    this.disProducts = this.productsService.products.filter((product) => product.discount > 0 );
    this.chepProducts = this.productsService.products.filter((product) => product.price < 20);
    console.log(this.chepProducts);
    
  },
  (serverErrorResponse) => {
    this.error = serverErrorResponse.error.error;
  }
  
);





}


private getCart() {

  this.cartsService.getCart(this.user?._id).subscribe(
    (cart) => {
        if (cart) {
          this.cartsService.cart = cart
        }
        else {
          const userCart = new CartModel();
          userCart.user_id = this.user._id;
          this.createNewCart(userCart);
          this.getCart();
        }

        localStorage.setItem("cart", JSON.stringify(this.cartsService.cart));
    },
    (serverErrorResponse) => {
      this.error = serverErrorResponse.error.error;
    }
  );
}



// public getCartItems(): void {
//   this.cartsService.getCartItems().subscribe(
//     (cartItems) => {       
//       this.cartsService.total = 0;
//       this.cartsService.cartItems = cartItems;
//       cartItems.map(
//         (product) => (this.cartsService.total += product.totalPrice)
//       );
//     },
//     (serverErrorResponse) => {
//       this.error = serverErrorResponse.error.error;
//     }
//   );
// }


public createNewCart(userCart): void {
  this.cartsService.createCart(userCart).subscribe(
    (cart) => (this.cartsService.cart = cart),
    (serverErrorResponse) => {
      this.error = serverErrorResponse.error.error;
    }
  );
}


ngOnDestroy() {
  this.subscription.unsubscribe();
  }


  public async addToCart(product) {
    console.log({ product });

    // Get PRODUCTS FROM CART
    this.cartProducts = await this.cartsService.getCartItems(this.cart._id);
    console.log('cartproduct ', this.cartProducts);

    this.cartP = this.cartProducts.filter((a: any) => {
      return a.product_id === product._id;
    });
    console.log(this.cartP);

    this.getProduct = await this.productsService.getOneProduct(product._id);
    console.log(this.getProduct);

    if (this.amount < 0) {
      this.amount = 1;
      this.notify.error("Positive Quantity only allowed");
      return;
    };

    // this.stock = this.productsService.products.find((item) => item._id === product._id);
    // console.log(this.stock);

    // console.log('11111 ', this.getProduct.inStock);
    // console.log('22222222 ', this.cartP[0]?.quantity);

    if (!this.cartP[0]?.quantity || this.cartP[0]?.quantity === undefined) {
      this.quantityCart = 0
    } else {
      this.quantityCart = this.cartP[0]?.quantity
    };
    this.sum = this.getProduct.inStock + this.quantityCart;
    if (this.amount > this.sum) {
      this.amount = 1;
      this.notify.error("max quantity to order is " + this.sum);
      return;
    }

    //If product already in cart
    let ifInCart = false;
    // // Get PRODUCTS FROM CART
    // this.cartProducts = await this.cartsService.getCartItems(this.cart._id);
    // console.log('cartprodct ', this.cartProducts);

    // this.cartP = this.cartProducts.filter((a: any) => {
    //   return a.product_id === product._id;
    // });
    // console.log(this.cartP);

    if (this.cartP.length > 0) {
      ifInCart = true;
    }

    if (!ifInCart) {
      let productToAdd = {
        quantity: this.amount,
        totalPrice: this.amount * product.price,
        product_id: product._id,
        cart_id: this.cart._id,
        price: product.price,
        discount: product.discount,
        img: product.img,
        name: product.name,
      };
      console.log({ productToAdd });

      this.cartsService.addToCart(productToAdd);
      this.updateStockProduct = this.productsService.products.find((product) => product._id === productToAdd.product_id);
      this.notify.success("This product has been added to your shopping cart");
      // this.updateStockProduct.inStock = this.updateStockProduct.inStock - productToAdd.quantity;
      this.updateStockProduct.inStock = this.getProduct.inStock - productToAdd.quantity;

      const indexToDelete = this.productsService.products.findIndex(t => t._id === productToAdd.product_id);
      this.productsService.products[indexToDelete].inStock = this.updateStockProduct.inStock;
      console.log(this.productsService.products[indexToDelete].inStock);
      
      this.productStock = this.productsService.products[indexToDelete].inStock;
      console.log(this.productStock);
      

    } else if (ifInCart) {

      let productToUpdate = {
        _id: this.cartP[0]._id,
        quantity: this.amount,
        totalPrice: this.amount * product.price,
        product_id: product._id,
        cart_id: this.cart._id,
        price: product.price,
        discount: product.discount,
        img: product.img,
        name: product.name,
      };
      console.log({ productToUpdate });

      console.log( this.cartP[0]);
      console.log(this.getProduct);
      console.log(this.updateStockProduct);
      
      this.updateStockProduct = this.productsService.products.find((product) => product._id === productToUpdate.product_id);

      this.updateStockProduct.inStock = this.getProduct.inStock + this.cartP[0].quantity;
      console.log('--111--    ', this.updateStockProduct.inStock);

      if (productToUpdate.quantity != this.cartP[0].amount) {
        this.cartsService.updateOnCart(productToUpdate).subscribe(
          (newProductInCart) => {
            this.notify.success("This product has been updated in your shopping cart");
            // this.updateStockProduct = this.productsService.products.find((product) => product._id === productToUpdate.product_id);
            // this.updateStockProduct = this.productsService.products.find((product) => product._id === productToUpdate.product_id);
            console.log(this.updateStockProduct);
            console.log(this.getProduct.inStock);
            console.log(productToUpdate.quantity);
console.log('--------', this.getProduct.inStock);


            // this.updateStockProduct.inStock = this.getProduct.inStock + this.amount;
            // this.updateStockProduct.inStock = this.getProduct.inStock + productToUpdate.quantity;
            // this.updateStockProduct.inStock = this.getProduct.inStock + this.cartP[0].quantity;
            
            // this.updateStockProduct.inStock = this.getProduct.inStock - productToUpdate.quantity;
            this.updateStockProduct.inStock = this.updateStockProduct.inStock - productToUpdate.quantity;
            console.log('--222--    ', this.updateStockProduct.inStock);

            // this.updateStockProduct.inStock = this.updateStockProduct.inStock + productToUpdate.quantity;
            // this.updateStockProduct.inStock = this.updateStockProduct.inStock - productToUpdate.quantity;

            console.log('********  ', this.updateStockProduct.inStock);

            const indexToDelete = this.productsService.products.findIndex(t => t._id === productToUpdate.product_id);           
            this.productsService.products[indexToDelete].inStock = this.updateStockProduct.inStock;
            this.productStock = this.productsService.products[indexToDelete].inStock;
          },
          (serverErrorResponse) => {
            this.error = serverErrorResponse.error.error;
          }
        );
      }
    }
  }

}