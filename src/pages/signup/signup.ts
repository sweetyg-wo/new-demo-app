import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupModel, APIResponce } from '../../common/model';
import { UserProvider } from '../../providers/user/user';
import { LoaderProvider } from '../../providers/loader/loader';
import { SigninPage } from '../signin/signin';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  protected user: SignupModel = {
    email :"",
    password: "",
    confirmpassword:""
  };

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     private userService:UserProvider,
     private loader:LoaderProvider
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignupPage');
  }

  protected createAccount(){
    console.log(this.user);
    this.userService.signUp(this.user).then((resp:APIResponce)=>{
      console.log(resp);
      this.loader.showAlert("Success","You are now regitser with us, Please login using your detail");
      this.navCtrl.setRoot(SigninPage);
    }).catch((error)=>{
      console.log(error);
      this.loader.showAlert(error.status,error.message);
    })
  }
}
