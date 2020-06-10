import {Component, OnInit} from '@angular/core';

import {Platform} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';
import {DataService} from './services/data.service';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {
    public data = [];
    public selectedIndex = 0;
    public appPages = [
        {
            title: 'Home',
            url: '/folder/Home',
        },
    ];


    private createPages() {
      console.log("test pages create"+ this.data.length);
        for (let i = 0; this.data.length > i; i++) {
            this.appPages.push({
                title: this.data[i].Country,
                url: "/folder/" + this.data[i].Country
            })
        }
    }

    //not used

    // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private dataService: DataService
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.splashScreen.hide();
        });
    }

    ngOnInit() {

        // *UNUSED*

      this.dataService.getCountriesListRequest().subscribe((response: any[]) => {
        console.log(response);
        this.data = response;
        this.createPages();
      });


        const path = window.location.pathname.split('folder/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }


    }


}
