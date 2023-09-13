import {Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService, AuthResponseData} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnDestroy{
    isLoggedin = true;
    isLoading = false;
    error: string = null;
    @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
    private closeSub: Subscription;

    constructor(private authService: AuthService,
                private router: Router,
                private componentFactoryResolver: ComponentFactoryResolver) {
    }
    onSwitchMode(){
      this.isLoggedin = !this.isLoggedin;
    }
    onSubmit(form: NgForm){
      if(!form.valid){
        return;
      }
      const email = form.value.email;
      const password = form.value.password;

      let authObservable: Observable<AuthResponseData>;
      this.isLoading = true;
      if(this.isLoggedin){
        authObservable = this.authService.login(email,password);
      }  else{
        authObservable = this.authService.signup(email,password);
      }

      authObservable.subscribe(
        resData => {
          console.log(resData);
          this.isLoading = false;
          this.router.navigate(['/recipes']);
        },
        errorMessage => {
          console.log(errorMessage);
          this.error = errorMessage;
          this.showErrorAlert(errorMessage);
          this.isLoading = false;
        }
      )
      form.reset();
    }

    onHandleError(){
      this.error = null;
      this.isLoading = false;
    }

    ngOnDestroy() {
      if (this.closeSub){
        this.closeSub.unsubscribe();
      }
    }

  private showErrorAlert(message: string){
      const alertCmpFacory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
      const hostViewContainerRef = this.alertHost.viewContainerRef;
      hostViewContainerRef.clear(); // 315!!!!

      const componentRef = hostViewContainerRef.createComponent(alertCmpFacory);

      componentRef.instance.message = message;
      this.closeSub = componentRef.instance.close.subscribe(() =>{
        this.closeSub.unsubscribe();
        hostViewContainerRef.clear();
      })
    }
}
