import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Sonuc } from 'src/app/models/Sonuc';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { Kayit } from 'src/app/models/Kayit';
import { Uye } from 'src/app/models/Uye';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  kayitlar!: Kayit[];
  uyeId: any;
  uye!: Uye;
  confirmDialogRef!: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    public alert: MyAlertService,
    public MatDialog: MatDialog,
    public apiServis: ApiService
  ) { }

  ngOnInit(
  ) {
    this.uyeId = localStorage.getItem("uid");
    this.SonKayitlar();
    this.UyeById(this.uyeId);
  }

  UyeById(uyeId: number) {
    this.apiServis.UyeById(uyeId).subscribe((d: Uye) => {
      this.uye = d;
    })
  }
  SonKayitlar() {
    this.apiServis.SonEklenenler(5).subscribe((d: Kayit[]) => {

      if (this.uye?.uyeTipi == 0) {
        var filter = d.filter((x: Kayit) => x.kayitUyeId == this.uyeId);
        this.kayitlar = filter;
      } else {
        this.kayitlar = d;
      }

    })
  }

  OdevTamamla(kayit: Kayit) {
    kayit.kayitDurum = 1;
    this.apiServis.KayitDuzenle(kayit).subscribe((s: Sonuc) => {
      this.alert.AlertUygula(s);
      if (s.islem) {
        this.SonKayitlar();
      }
    })
  }
}
