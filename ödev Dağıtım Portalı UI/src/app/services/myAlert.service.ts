import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sonuc } from '../models/Sonuc';
import { AlertDialogComponent } from '../components/dialogs/alert-dialog/alert-dialog.component';

@Injectable()
export class MyAlertService {
    alertDialogRef!: MatDialogRef<AlertDialogComponent> | null;

    constructor(
        public matDialog: MatDialog
    ) { }


    AlertUygula(s: Sonuc) {
        var baslik = "";
        if (s?.islem) {
            baslik = "İşlem Başarılı";
        } else {
            baslik = "Hata";
        }
        this.alertDialogRef = this.matDialog.open(AlertDialogComponent, {
            width: "300px"
        })
        this.alertDialogRef.componentInstance.dialogBaslik = baslik;
        this.alertDialogRef.componentInstance.dialogMesaj = s?.mesaj;
        this.alertDialogRef.componentInstance.dialogIslem = s?.islem;

        this.alertDialogRef.afterClosed().subscribe(d => {
            this.alertDialogRef = null;
        });

    }

}
