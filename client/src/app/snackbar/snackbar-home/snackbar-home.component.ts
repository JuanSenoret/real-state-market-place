import { Component, OnInit, Inject } from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from '@angular/material';

@Component({
  selector: 'app-snackbar-home',
  templateUrl: './snackbar-home.component.html',
  styleUrls: ['./snackbar-home.component.scss']
})
export class SnackbarHomeComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
              public snackBarRef: MatSnackBarRef<SnackbarHomeComponent>) { }

  ngOnInit() {
    console.log(this.data);
  }

}
