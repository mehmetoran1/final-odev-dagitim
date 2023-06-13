import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Ders } from 'src/app/models/Ders';
import { Odev } from 'src/app/models/Odev';
import { Sonuc } from 'src/app/models/Sonuc';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { OdevDialogComponent } from '../dialogs/odev-dialog/odev-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dersOdev',
  templateUrl: './dersOdev.component.html',
  styleUrls: ['./dersOdev.component.css']
})
export class DersOdevComponent implements OnInit {
  odevler!: Odev[];
  displayedColumns = ["odevId", "odevAdi", "odevAciklama", "odevSonTarih", "odevDersAdi", "odevOgrenciSayisi", "islemler"]
  dataSource: any;
  dersId: any;
  secDers: Ders = new Ders();
  showSpinner: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<OdevDialogComponent>;
  confirmDialogRef!: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    public apiServis: ApiService,
    private matDialog: MatDialog,
    private alertServis: MyAlertService,
    private router: ActivatedRoute
  ) { }

  ngOnInit() {
    this.router.params.subscribe((p: any) => {
      this.dersId = Number(p.dersId);
    })
    this.DersGetir();
    this.OdevListele();
  }

  DersGetir(){
    this.apiServis.DersById(Number(this.dersId)).subscribe((d: Ders) => {
      this.secDers = d;
      console.log(this.secDers);
    })
  }

  OdevListele() {
    this.apiServis.OdevByDers(this.dersId).subscribe((d: Odev[]) => {
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
    yeniOdev.odevDersId = this.dersId;
    this.dialogRef = this.matDialog.open(OdevDialogComponent, {
      width: '400px',
      data: {
        kayit: yeniOdev,
        islem: 'ekle',
        dersIdVar: true
      }
    })
    this.dialogRef.afterClosed().subscribe((d: Odev) => {
      if (d != undefined) {
        d.odevDersId = this.dersId;
        this.apiServis.OdevEkle(d).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.OdevListele() : null;
        })
      }
    })
  }
  OdevDuzenle(kayit: Odev) {
    kayit.odevDersId = this.dersId;
    this.dialogRef = this.matDialog.open(OdevDialogComponent, {
      width: "400px",
      data: {
        kayit: kayit,
        islem: "duzenle",
        dersIdVar: true

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


}