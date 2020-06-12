import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../services/data.service';


@Component({
    selector: 'app-folder',
    templateUrl: './folder.page.html',
    styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
    public data = [];
    // make get data out of local

    public saveData = [];

    public saveName: string;
    public selectedSaveIndex: any;

    public folder: string;

    public deaths: string;
    public confirmed: string;
    public recovered: string;
    public active: string;
    public msg: string;

    public startTime: string;
    public endTime: string;

    constructor(private activatedRoute: ActivatedRoute, private dataService: DataService) {
    }


    private setData(data) {
        let latestData = data[data.length - 1];
        if (latestData) {
            this.deaths = latestData.Deaths;
            this.confirmed = latestData.Confirmed;
            this.recovered = latestData.Recovered;
            this.active = latestData.Active;
        } else {
            this.msg = "there is no data available"
        }

    }

    private setSavedData() {
        console.log(this.saveData[this.selectedSaveIndex]);
        this.folder = this.saveData[this.selectedSaveIndex].Country;
        this.startTime = this.saveData[this.selectedSaveIndex].StartTime;
        this.endTime = this.saveData[this.selectedSaveIndex].EndTime;
        this.dataService.getCountryRequest(this.folder).subscribe((response: any[]) => {
            this.data = response;
            this.setData(this.data);
            this.setTime()
        });
    }

    ngOnInit() {
        this.folder = this.activatedRoute.snapshot.paramMap.get('id');

        if (JSON.parse(localStorage.getItem('data'))) {
            this.saveData = JSON.parse(localStorage.getItem('data'));
        }

        this.dataService.getCountryRequest(this.folder).subscribe((response: any[]) => {
            this.data = response;
            this.setData(this.data);
        });

    }

    setTime() {
        //get date from file
        //this.data[0].Date.split('T')[0]
        let startDateFound = false;
        let endDateFound = false;
        let startIndex = 0;
        let endIndex = 0;
        let i = 0;

        if (FolderPage.validateDates(this.startTime, this.endTime)) {

            while (startDateFound == false || endDateFound == false) {

                if (startDateFound == false) {
                    if (this.startTime === this.data[i].Date.split('T')[0]) {
                        startDateFound = true;
                        startIndex = i;
                    }
                }
                if (endDateFound == false) {
                    if (this.endTime === this.data[i].Date.split('T')[0]) {
                        endDateFound = true;
                        endIndex = i;
                    }
                }

                i++;
            }
            this.msg = "";
            this.updateData(startIndex, endIndex)
        } else {
            this.msg = "Invalid Date"
        }
    }

    private updateData(startIndex, endIndex) {
        let startDeaths = this.data[startIndex].Deaths;
        let endDeaths = this.data[endIndex].Deaths;
        let startConfirmed = this.data[startIndex].Confirmed;
        let endConfirmed = this.data[endIndex].Confirmed;
        let startActive = this.data[startIndex].Deaths;
        let endActive = this.data[endIndex].Deaths;
        let startRecovered = this.data[startIndex].Recovered;
        let endRecovered = this.data[endIndex].Recovered;

        this.deaths = (endDeaths - startDeaths).toString();
        this.confirmed = (endConfirmed - startConfirmed).toString();
        this.active = (endActive - startActive).toString();
        this.recovered = (endRecovered - startRecovered).toString();


    }

    private static validateDates(startDate, endDate) {
        // jjjj-mm-dd
        let reg = RegExp("([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))");
        if (startDate)
        return reg.test(startDate) && reg.test(endDate);
    }

    saveSettings() {

      if (FolderPage.validateDates(this.startTime,this.endTime)) {

        let saveObject = {
          Name: this.saveName,
          Country: this.folder,
          StartTime: this.startTime,
          EndTime: this.endTime
        };
        this.saveData.push(saveObject);
        localStorage.setItem('data', JSON.stringify(this.saveData));
        this.msg='Setting saved'
      }else{
        this.msg='Did not save... Invalid Date'
      }


    }
}
