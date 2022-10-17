import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-invoice',
  templateUrl: './search-invoice.component.html',
  styleUrls: ['./search-invoice.component.scss']
})
export class SearchInvoiceComponent implements OnInit {
  customers: any = [];
  loading = false;
  constructor() { }

  ngOnInit(): void {
    this.customers = [
      {
        "id": 1000,
        "name": "James Butt",
        "country": {
            "name": "Algeria",
            "code": "dz"
        },
        "company": "Benton, John B Jr",
        "date": "2015-09-13",
        "status": "unqualified",
        "activity": 17,
        "representative": {
            "name": "Ioni Bowcher",
            "image": "ionibowcher.png"
        }
    },
    {
        "id": 1001,
        "name": "Josephine Darakjy",
        "country": {
            "name": "Egypt",
            "code": "eg"
        },
        "company": "Chanay, Jeffrey A Esq",
        "date": "2019-02-09",
        "status": "proposal",
        "activity": 0,
        "representative": {
            "name": "Amy Elsner",
            "image": "amyelsner.png"
        }
    },
    {
        "id": 1002,
        "name": "Art Venere",
        "country": {
            "name": "Panama",
            "code": "pa"
        },
        "company": "Chemel, James L Cpa",
        "date": "2017-05-13",
        "status": "qualified",
        "activity": 63,
        "representative": {
            "name": "Asiya Javayant",
            "image": "asiyajavayant.png"
        }
    },
    {
        "id": 1003,
        "name": "Lenna Paprocki",
        "country": {
            "name": "Slovenia",
            "code": "si"
        },
        "company": "Feltz Printing Service",
        "date": "2020-09-15",
        "status": "new",
        "activity": 37,
        "representative": {
            "name": "Xuxue Feng",
            "image": "xuxuefeng.png"
        }
    },
    {
        "id": 1004,
        "name": "Donette Foller",
        "country": {
            "name": "South Africa",
            "code": "za"
        },
        "company": "Printing Dimensions",
        "date": "2016-05-20",
        "status": "proposal",
        "activity": 33,
        "representative": {
            "name": "Asiya Javayant",
            "image": "asiyajavayant.png"
        }
    },
    {
        "id": 1005,
        "name": "Simona Morasca",
        "country": {
            "name": "Egypt",
            "code": "eg"
        },
        "company": "Chapman, Ross E Esq",
        "date": "2018-02-16",
        "status": "qualified",
        "activity": 68,
        "representative": {
            "name": "Ivan Magalhaes",
            "image": "ivanmagalhaes.png"
        }
    },
    {
        "id": 1006,
        "name": "Mitsue Tollner",
        "country": {
            "name": "Paraguay",
            "code": "py"
        },
        "company": "Morlong Associates",
        "date": "2018-02-19",
        "status": "renewal",
        "activity": 54,
        "representative": {
            "name": "Ivan Magalhaes",
            "image": "ivanmagalhaes.png"
        }
    },
    {
        "id": 1007,
        "name": "Leota Dilliard",
        "country": {
            "name": "Serbia",
            "code": "rs"
        },
        "company": "Commercial Press",
        "date": "2019-08-13",
        "status": "renewal",
        "activity": 69,
        "representative": {
            "name": "Onyama Limba",
            "image": "onyamalimba.png"
        }
    }
    ];
  }

}
