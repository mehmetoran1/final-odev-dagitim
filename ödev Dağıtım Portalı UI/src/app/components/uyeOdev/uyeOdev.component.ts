import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Ders } from 'src/app/models/Ders';
import { Odev } from 'src/app/models/Odev';
import { Sonuc } from 'src/app/models/Sonuc';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { OdevDialogComponent } from '../dialogs/odev-dialog/odev-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { Kayit } from 'src/app/models/Kayit';
import { Uye } from 'src/app/models/Uye';
import { KayitDialogComponent } from '../dialogs/kayit-dialog/kayit-dialog.component';

@Component({
  selector: 'app-uyeOdev',
  templateUrl: './uyeOdev.component.html',
  styleUrls: ['./uyeOdev.component.css']
})
export class UyeOdevComponent implements OnInit {
  kayitlar!: Kayit[];
  uyeler!: Uye[];
  secOgr!: Uye;
  uyeId: any;
  uyeIdVar: boolean = false;
  displayedColumns = ["kayitId", "odevAdi", "odevAciklama", "odevSonTarih", "odevDersAdi", "adSoyad","kayitDurum", "islemler"]
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
      this.uyeId = p.uyeId;
    });
    this.uyeId ? this.uyeIdVar = true : this.uyeIdVar = false;
    this.OgrenciById(this.uyeId);
    this.DersListele();
    this.KayitListele();

  }

  DersListele() {
    this.apiServis.UyeByUyeTipi(0).subscribe((d: Uye[]) => {
      this.uyeler = d;
    })
  }
  OgrenciById(uyeId: number) {
    this.apiServis.UyeById(uyeId).subscribe((d: Uye) => {
      this.secOgr = d;
    })
  }
  KayitListele() {
    this.apiServis.OdevByUye(this.uyeId).subscribe((d: Kayit[]) => {
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
    this.uyeIdVar ? yeniOdev.kayitUyeId = this.uyeId : null;
    this.dialogRef = this.matDialog.open(KayitDialogComponent, {
      width: '400px',
      data: {
        kayit: yeniOdev,
        islem: 'ekle',
        uyeIdVar: true
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
        uyeIdVar: true

      }
    })
    this.dialogRef.afterClosed().subscribe(d => {

      if (!d) {

      } else {
        kayit.kayitOdevId = d?.kayitOdevId;
        kayit.kayitDurum = d?.kayitDurum;


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
    this.confirmDialogRef.componentInstance.dialogMesaj = '"' + kayit.uyeBilgi.adSoyad + '" ' + "Adlı Öğrenci Silinecektir Onaylıyor musunuz?";
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
    this.OgrenciById(e);
    this.apiServis.OdevByUye(e).subscribe((d: Kayit[]) => {
      this.kayitlar = d;
      this.dataSource = new MatTableDataSource(this.kayitlar);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }
}
