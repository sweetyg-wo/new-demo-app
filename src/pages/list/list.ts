import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { ContactProvider } from '../../providers/contact/contact';
import { APIResponce, ContactModel } from '../../common/model';
import { ContactformComponent } from '../../components/contactform/contactform';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  
  contactList :Array<any> = [];

  constructor(
    private navCtrl: NavController, 
    private navParams: NavParams,
    private contactService:ContactProvider,
    private modalCtrl: ModalController
    ) { 
  }

  ngOnInit(){
    this.loadContacts();
  }

  private loadContacts(){
    this.contactService.listContacts().then((resp:APIResponce)=>{
      console.warn(resp);
      this.contactList =  resp.data;
    }).catch((error)=>{
      console.log(error);
      this.contactList =  [];
    })
  }

  initNewContact(){
    let person :ContactModel = {
      name:"",
      email:"",
      mobileno:"",
      picture:""
    }
    this.openContactModal(person);
  }

  itemTapped(person) {
   console.log(person);
   this.openContactModal(person);
  }

  private openContactModal(data){
    let newContactForm  = this.modalCtrl.create(ContactformComponent,{data:data});
    newContactForm.onDidDismiss(async (resp)=>{
      console.log(resp);
      this.contactService.saveContact(resp).then((answer:APIResponce)=>{
        this.loadContacts();
      }).catch((error)=>{
        console.log(error);
      })
    });

    newContactForm.present();
  }

}
