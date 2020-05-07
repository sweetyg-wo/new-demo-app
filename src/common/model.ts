export interface SigninModel{
    email:string,
    password:string
}

export interface SignupModel{
    email:string,
    password:string
    confirmpassword:string
}

export interface ContactModel{
    _id?:string,
    name:string,
    email:string,
    mobileno:string,
    picture:any,
    userid?:string
};

export interface APIResponce{
    status:string,
    message:string,
    data:any
};

export class Server{
    API = "http://192.168.0.104:3000/";
}