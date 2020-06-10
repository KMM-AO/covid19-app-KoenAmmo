import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {DataService} from '../services/data.service';


@Component({
    selector: 'app-folder',
    templateUrl: './folder.page.html',
    styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
    public folder: string;
    public deaths: string;
    public confirmed: string;
    public recovered: string;
    public active: string;
    public error: string;
    public data = [];

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

}
