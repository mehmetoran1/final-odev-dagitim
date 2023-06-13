import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DersDialogComponent } from '../dialogs/ders-dialog/ders-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { MatTableDataSource } from '@angular/material/table';
import { Ders } from 'src/app/models/Ders';
import { Sonuc } from 'src/app/models/Sonuc';
import { Kategori } from 'src/app/models/Kategori';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ders',
  templateUrl: './ders.component.html',
  styleUrls: ['./ders.component.css']
})
export class DersComponent implements OnInit {
  dersler!: Ders[];
  kategoriler!: Kategori[];
  displayedColumns = ["dersId", "dersAdi", "dersKodu", "dersKredi", "kategoriAdi", "dersOdevSayisi", "islemler"]
  dataSource: any;
  katId: any;
  katIdVar: boolean = false;

  showSpinner: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<DersDialogComponent>;
  confirmDialogRef!: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    public apiServis: ApiService,
    private matDialog: MatDialog,
    private alertServis: MyAlertService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.params.subscribe((p: any) => {
      this.katId = Number(p.katId);
    })
    if (!this.katId) {
      this.DersListele();
    } else {
      this.DersByKat();
    }
    this.KategoriListele();
    this.katId ? this.katIdVar = true : this.katIdVar = false;
  }

  KategoriListele() {
    this.apiServis.KategoriListele().subscribe((d: Kategori[]) => {
      this.kategoriler = d;
    })
  }
  DersListele() {
    this.apiServis.DersListele().subscribe((d: Ders[]) => {
      this.dersler = d;
      this.dataSource = new MatTableDataSource(this.dersler);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }
  DersByKat() {
    this.apiServis.DersByKat(this.katId).subscribe((d: Ders[]) => {
      this.dersler = d;
      this.dataSource = new MatTableDataSource(this.dersler);
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
  DersEkle() {
    var yeniDers: Ders = new Ders();
    this.katIdVar ? yeniDers.dersKategoriId = this.katId : null;
    this.dialogRef = this.matDialog.open(DersDialogComponent, {
      width: '400px',
      data: {
        kayit: yeniDers,
        islem: 'ekle',
        katId: this.katIdVar
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      
      if (d != undefined) {
        this.apiServis.DersEkle(d).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          if(s.islem){
            this.katIdVar ? this.DersByKat() : this.DersListele();
          }
        })
      }
    })
  }
  DersDuzenle(kayit: Ders) {
    this.dialogRef = this.matDialog.open(DersDialogComponent, {
      width: "400px",
      data: {
        kayit: kayit,
        islem: "duzenle",
        katId: this.katIdVar
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {

      if (!d) {

      } else {
        kayit.dersAdi = d?.dersAdi;
        kayit.dersKodu = d?.dersKodu;
        kayit.dersKredi = d?.dersKredi;
        kayit.dersKategoriId = d?.dersKategoriId;

        this.apiServis.DersDuzenle(kayit).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.DersListele() : null;
        })

      }
    })
  }

  DersSil(kayit: Ders) {
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent, {
      width: "400px"
    });
    this.confirmDialogRef.componentInstance.dialogMesaj = '"' + kayit.dersAdi + '" ' + "Adlı Ders Silinecektir Onaylıyor musunuz?";
    this.confirmDialogRef.afterClosed().subscribe(d => {
      if (d) {
        this.apiServis.DersSil(kayit.dersId).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.DersListele() : null;
        })
      }
    })
  }

  dersFiltrele(e: any) {
    if (e == 0) {
      this.DersListele();
    } else {
      this.apiServis.DersByKat(e).subscribe((d: Ders[]) => {
        this.dersler = d;
        this.dataSource = new MatTableDataSource(this.dersler);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }
  }
}
