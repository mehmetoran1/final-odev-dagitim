import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Kayit } from 'src/app/models/Kayit';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { ActivatedRoute } from '@angular/router';
import { Odev } from 'src/app/models/Odev';
import { MatTableDataSource } from '@angular/material/table';
import { Sonuc } from 'src/app/models/Sonuc';
import { KategoriDialogComponent } from '../dialogs/kategori-dialog/kategori-dialog.component';
import { KayitDialogComponent } from '../dialogs/kayit-dialog/kayit-dialog.component';

@Component({
  selector: 'app-odevUye',
  templateUrl: './odevUye.component.html',
  styleUrls: ['./odevUye.component.css']
})
export class OdevUyeComponent implements OnInit {
  kayitlar!: Kayit[];
  odevler!: Odev[];
  secOdev!: Odev;
  odevId: any;
  odevIdVar: boolean = false;
  displayedColumns = ["kayitId", "adSoyad", "email", "uyeOdevSayisi", "odevAdi", "kayitDurum", "islemler"]
  dataSource: any;
  showSpinner: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<KayitDialogComponent>;
  confirmDialogRef!: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    public apiServis: ApiService,
    private matDialog: MatDialog,
    private alertServis: MyAlertService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.params.subscribe((p: any) => {
      this.odevId = p.odevId;
    });
    this.odevId ? this.odevIdVar = true : this.odevIdVar = false;
    this.OdevById(this.odevId);
    this.OdevListele();
    this.KayitListele();

  }

  OdevListele() {
    this.apiServis.OdevListele().subscribe((d: Odev[]) => {
      this.odevler = d;
    })
  }
  OdevById(odevId: number) {
    this.apiServis.OdevById(odevId).subscribe((d: Odev) => {
      this.secOdev = d;
    })
  }
  KayitListele() {
    this.apiServis.UyeByOdev(this.odevId).subscribe((d: Kayit[]) => {
      this.kayitlar = d;
      this.dataSource = new MatTableDataSource(this.kayitlar);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }


  filtrele(e: any) {
    var val = e.target.value;
    this.dataSource.filter = val.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  OdevEkle() {
    var yeniOdev: Kayit = new Kayit();
    this.odevId ? yeniOdev.kayitOdevId = this.odevId : null;
    this.dialogRef = this.matDialog.open(KayitDialogComponent, {
      width: '400px',
      data: {
        kayit: yeniOdev,
        islem: 'ekle',
        odevIdVar: true
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      if (d != undefined) {
        this.apiServis.KayitEkle(d).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.KayitListele() : null;
        })
      }
    })
  }
  OdevDuzenle(kayit: Kayit) {
    this.dialogRef = this.matDialog.open(KayitDialogComponent, {
      width: "400px",
      data: {
        kayit: kayit,
        islem: "duzenle",
        odevIdVar: true
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {

      if (!d) {

      } else {
        kayit.kayitUyeId = d.kayitUyeId;
        kayit.kayitDurum = d.kayitDurum;

        this.apiServis.KayitDuzenle(kayit).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.KayitListele() : null;
        })

      }
    })
  }

  OdevSil(kayit: Kayit) {
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: "400px"
    });
    this.confirmDialogRef.componentInstance.dialogMesaj = '"' + kayit.odevBilgi.odevAdi + '" ' + "Adlı Odev Silinecektir Onaylıyor musunuz?";
    this.confirmDialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.apiServis.KayitSil(kayit.kayitId).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.KayitListele() : null;
        })
      }
    })
  }

  kayitFiltrele(e: any) {
    this.OdevById(e);
    this.apiServis.OdevByUye(e).subscribe((d: Kayit[]) => {
      this.kayitlar = d;
      this.dataSource = new MatTableDataSource(this.kayitlar);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }
}
