import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ListPage } from '../pages/list/list';
import { SigninPage } from '../pages/signin/signin';
import { HomePage } from '../pages/home/home';


import { LoaderProvider } from '../providers/loader/loader';
import { ProfilePage } from '../pages/profile/profile';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any ;

  pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    private loader: LoaderProvider

  ) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Profile', component: ProfilePage },
      { title: 'Contacts', component: ListPage },
      { title: 'Logout',component:undefined }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      let token = localStorage.getItem('token');

      if(token){
        this.rootPage = ListPage;
      }else{
        this.rootPage = SigninPage;
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title == "Logout"){
      // this.nav.push(HomePage);
      this.loader.askConfirmation("Logout","Are you sure you want to logout?",()=>{
        this.nav.setRoot(SigninPage);
      },
      ()=>{
        console.log('you have canceled the logout')
      })
    }else{
      this.nav.push(page.component);
    }
  }
}
