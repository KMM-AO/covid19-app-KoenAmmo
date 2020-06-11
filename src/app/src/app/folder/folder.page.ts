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

    public folder: string;

    public deaths: string;
    public confirmed: string;
    public recovered: string;
    public active: string;
    public error: string;

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
            this.error = "there is no data available"
        }

    }

    ngOnInit() {
        this.folder = this.activatedRoute.snapshot.paramMap.get('id');

        this.dataService.getCountryRequest(this.folder).subscribe((response: any[]) => {
            console.log(response);
            this.data = response;
            this.setData(this.data)
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

        if (this.validateDates(this.startTime, this.endTime)) {

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
            this.error = "";
            this.updateData(startIndex, endIndex)
        } else {
            this.error = "Invalid Date"
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

    private validateDates(startDate, endDate) {
        // jjjj-mm-dd
        let reg = RegExp("([12]\\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01]))");
        return reg.test(startDate) && reg.test(endDate);
    }

}
