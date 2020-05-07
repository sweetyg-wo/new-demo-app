import { Component } from '@angular/core';

import { ContactModel } from '../../common/model';
import { NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ContactformComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'contactform',
  templateUrl: 'contactform.html'
})
export class ContactformComponent {

  protected dialogTitle: string = "Add Contact";

  protected contact:ContactModel = {
    name:"",
    email:"",
    mobileno:"",
    picture:undefined
  };

  constructor(
    private navParam:NavParams,
    private view:ViewController
  ) {
    console.log('Hello ContactformComponent Component');

    this.contact = this.navParam.get('data');
  }

  protected saveContact(){
    this.view.dismiss(this.contact);
  }

}
