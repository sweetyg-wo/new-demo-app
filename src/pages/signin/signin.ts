import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignupPage } from '../signup/signup';

import { SigninModel, APIResponce } from '../../common/model';
import { LoaderProvider } from '../../providers/loader/loader';
import { UserProvider } from '../../providers/user/user';
import { ListPage } from '../list/list';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

  protected user:SigninModel = {
    email :"",
    password: ""
  };

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private loader:LoaderProvider,
    private userService:UserProvider
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SigninPage');
  }

  protected signMeIn(){
    this.userService.login(this.user).then((resp:APIResponce)=>{
      console.warn(resp);
        localStorage.setItem('token',resp.data);
        this.navCtrl.setRoot(ListPage);
    }).catch((error)=>{
      console.log(error);
      this.loader.showAlert(error.status,error.message);
    });
  }

  protected registerMe(){
    this.navCtrl.push(SignupPage);
  }

}
