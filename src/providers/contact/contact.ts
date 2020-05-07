import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ContactModel, Server, APIResponce } from '../../common/model';
import { LoaderProvider } from '../loader/loader';

@Injectable()
export class ContactProvider {

  private serverObj:Server;

  constructor(
    private http: HttpClient,
    private loader:LoaderProvider
  ) {
    // console.log('Hello ContactProvider Provider');
    this.serverObj = new Server();
  }

  saveContact(data:ContactModel){
    return new Promise((resolve,reject)=>{
      // this.loader.show();
      let apiEndpoint = "add";
      if(data._id)
        apiEndpoint = "edit";

      data.userid = localStorage.getItem('token');

      console.warn(data);
      
      this.http.post(this.serverObj.API+"contacts/"+apiEndpoint,data).subscribe((resp:APIResponce)=>{
        console.log(resp);
        // this.loader.close();
        if(resp.status == "success"){
          resolve(resp);
        }else{
          reject(resp);
        }
      },(error)=>{
        // this.loader.close();
        reject(error);
      });
    })
  }

  listContacts(){
    let userunkid = localStorage.getItem('token');
    return new Promise((resolve,reject)=>{
      this.loader.show();
      this.http.post(this.serverObj.API+"contacts/list",{userid:userunkid}).subscribe((resp:APIResponce)=>{
        console.log(resp);
        this.loader.close();
        if(resp.status == "success"){
          resolve(resp);
        }else{
          reject(resp);
        }
      },(error)=>{
        this.loader.close();
        reject(error);
      });
    })
  }
}
