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

    public searchValue: string;
    public selectedIndex = 0;
    public staticAppPages = [];
    public appPages = [];

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

        this.dataService.getCountriesListRequest().subscribe((response: any[]) => {
            console.log(response);
            this.data = response;
            this.createPages();
            this.sortPages();
            this.staticAppPages = this.appPages;
        });

        const path = window.location.pathname.split('folder/')[1];
        if (path !== undefined) {
            this.selectedIndex = this.appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
        }


    }

    private createPages() {
        console.log("test pages create" + this.data.length);
        for (let i = 0; this.data.length > i; i++) {
            this.appPages.push({
                title: this.data[i].Country,
                url: "/folder/" + this.data[i].Country
            })
        }
    }

    private sortPages() {
        this.appPages.sort(function (a, b) {
            var x = a.title.toLowerCase();
            var y = b.title.toLowerCase();
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
    }

    search() {
        let searchedAppPages = [];
        this.appPages = this.staticAppPages;

        for (let i = 0; i < this.appPages.length; i++) {
            if (this.appPages[i].title.startsWith(this.searchValue) ||
                this.appPages[i].title.toLowerCase().startsWith(this.searchValue)) {
                searchedAppPages.push(this.appPages[i])
            }
        }
        this.appPages = searchedAppPages;
    }


}
