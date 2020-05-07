import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController } from 'ionic-angular';

/*
  Generated class for the LoaderProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoaderProvider {

  private loaderBox: any;

  constructor(
    private loader:LoadingController,
    private alertCtrl:AlertController
  ) {
    this.loaderBox = this.loader.create({
      content: "Please wait..."
    });
  }

  public show(){
    // this.loaderBox.present();
  }

  public close(){
    // this.loaderBox.dismiss();
  }

  public showAlert(title:string,message:string){
    const alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
