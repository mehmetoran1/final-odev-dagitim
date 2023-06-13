import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OdevDialogComponent } from '../dialogs/odev-dialog/odev-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { MatTableDataSource } from '@angular/material/table';
import { Odev } from 'src/app/models/Odev';
import { Sonuc } from 'src/app/models/Sonuc';
import { Kategori } from 'src/app/models/Kategori';
import { Ders } from 'src/app/models/Ders';

@Component({
  selector: 'app-odev',
  templateUrl: './odev.component.html',
  styleUrls: ['./odev.component.css']
})
export class OdevComponent implements OnInit {
  odevler!: Odev[];
  dersler!: Ders[];
  displayedColumns = ["odevId", "odevAdi", "odevAciklama", "odevSonTarih", "odevDersAdi", "odevOgrenciSayisi", "islemler"]
  dataSource: any;
  showSpinner: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<OdevDialogComponent>;
  confirmDialogRef!: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    public apiServis: ApiService,
    private matDialog: MatDialog,
    private alertServis: MyAlertService
  ) { }

  ngOnInit() {
    this.DersListele();
    this.OdevListele();
  }

  DersListele() {
    this.apiServis.DersListele().subscribe((d: Ders[]) => {
      this.dersler = d;
    })
  }
  OdevListele() {
    this.apiServis.OdevListele().subscribe((d: Odev[]) => {
      this.odevler = d;
      this.dataSource = new MatTableDataSource(this.odevler);
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
    var yeniOdev: Odev = new Odev();
    this.dialogRef = this.matDialog.open(OdevDialogComponent, {
      width: '400px',
      data: {
        kayit: yeniOdev,
        islem: 'ekle'
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      if (d != undefined) {
        this.apiServis.OdevEkle(d).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.OdevListele() : null;
        })
      }
    })
  }
  OdevDuzenle(kayit: Odev) {
    this.dialogRef = this.matDialog.open(OdevDialogComponent, {
      width: "400px",
      data: {
        kayit: kayit,
        islem: "duzenle"
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      
      if(!d){

      }else{
        kayit.odevAdi = d?.odevAdi;
        kayit.odevAciklama = d?.odevAciklama;
        kayit.odevSonTarih = d?.odevSonTarih;
        kayit.odevDersId = d?.odevDersId;
  
        this.apiServis.OdevDuzenle(kayit).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.OdevListele() : null;
        })

      }
    })
  }

  OdevSil(kayit: Odev){
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent,{
      width: "400px"
    });
    this.confirmDialogRef.componentInstance.dialogMesaj = '"' + kayit.odevAdi + '" ' + "Adlı Odev Silinecektir Onaylıyor musunuz?";
    this.confirmDialogRef.afterClosed().subscribe(d => {
      if(d){
        this.apiServis.OdevSil(kayit.odevId).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.OdevListele() : null;
        })
      }
    })
  }

  odevFiltrele(e: any){
    if(e == 0){
      this.OdevListele();
    }else{
      this.apiServis.OdevByDers(e).subscribe((d: Odev[]) => {
        this.odevler = d;
        this.dataSource = new MatTableDataSource(this.odevler);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }
  }
}
