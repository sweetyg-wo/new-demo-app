import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SigninModel, SignupModel,Server, APIResponce } from '../../common/model';
import { LoaderProvider } from '../loader/loader';

@Injectable()
export class UserProvider {

  private serverObj:Server;
  
  constructor(
    private http: HttpClient,
    private loader: LoaderProvider
  ) {
    // console.log('Hello UserProvider Provider');
    this.serverObj = new Server();
  }

  login(data:SigninModel){
    return new Promise((resolve,reject)=>{
      this.loader.show();
      this.http.post(this.serverObj.API+"login",data).subscribe((resp:APIResponce)=>{
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

  signUp(data:SignupModel){
    return new Promise((resolve,reject)=>{
      this.loader.show();
      this.http.post(this.serverObj.API+"signup",(data)).subscribe((resp:APIResponce)=>{
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
