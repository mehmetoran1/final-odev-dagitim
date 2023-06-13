import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { KategoriDialogComponent } from '../dialogs/kategori-dialog/kategori-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { MatTableDataSource } from '@angular/material/table';
import { Sonuc } from 'src/app/models/Sonuc';
import { Kategori } from 'src/app/models/Kategori';

@Component({
  selector: 'app-kategori',
  templateUrl: './kategori.component.html',
  styleUrls: ['./kategori.component.css']
})
export class KategoriComponent implements OnInit {
  kategoriler!: Kategori[];
  displayedColumns = ["kategoriId", "kategoriAdi", "kategoriDersSayisi", "islemler"]
  dataSource: any;
  showSpinner: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<KategoriDialogComponent>;
  confirmDialogRef!: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    public apiServis: ApiService,
    private matDialog: MatDialog,
    private alertServis: MyAlertService
  ) { }

  ngOnInit() {
    this.KategoriListele();
  }


  KategoriListele() {
    this.apiServis.KategoriListele().subscribe((d: Kategori[]) => {
      this.kategoriler = d;
      this.dataSource = new MatTableDataSource(this.kategoriler);
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
  KategoriEkle() {
    var yeniKategori: Kategori = new Kategori();
    this.dialogRef = this.matDialog.open(KategoriDialogComponent, {
      width: '400px',
      data: {
        kayit: yeniKategori,
        islem: 'ekle'
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      if (d != undefined) {
        this.apiServis.KategoriEkle(d).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.KategoriListele() : null;
        })
      }
    })
  }
  KategoriDuzenle(kayit: Kategori) {
    this.dialogRef = this.matDialog.open(KategoriDialogComponent, {
      width: "400px",
      data: {
        kayit: kayit,
        islem: "duzenle"
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      if (!d) {

      } else {
        kayit.kategoriAdi = d?.kategoriAdi;

        this.apiServis.KategoriDuzenle(kayit).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.KategoriListele() : null;
        })
      }
    })
  }

  KategoriSil(kayit: Kategori) {
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: "400px"
    });
    this.confirmDialogRef.componentInstance.dialogMesaj = '"' + kayit.kategoriAdi + '" ' + "Adlı Kategori Silinecektir Onaylıyor musunuz?";
    this.confirmDialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.apiServis.KategoriSil(kayit.kategoriId).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.KategoriListele() : null;
        })
      }
    })
  }

}
