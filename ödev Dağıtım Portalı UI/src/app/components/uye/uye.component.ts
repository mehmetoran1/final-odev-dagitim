import { UyeDialogComponent } from './../dialogs/uye-dialog/uye-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Sonuc } from 'src/app/models/Sonuc';
import { Uye } from 'src/app/models/Uye';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-uye',
  templateUrl: './uye.component.html',
  styleUrls: ['./uye.component.css']
})
export class UyeComponent implements OnInit {
  uyeler!: Uye[];
  displayedColumns = ["uyeId", "kullaniciAdi", "adSoyad", "email", "parola", "uyeTipi", "uyeOdevSayisi", "islemler"]
  dataSource: any;
  showSpinner: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<UyeDialogComponent>;
  confirmDialogRef!: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    private apiServis: ApiService,
    private matDialog: MatDialog,
    private alertServis: MyAlertService
  ) { }

  ngOnInit() {
    this.UyeListele();
  }

  UyeListele() {
    this.apiServis.UyeListele().subscribe((d: Uye[]) => {
      this.uyeler = d;
      this.dataSource = new MatTableDataSource(this.uyeler);
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
  UyeEkle() {
    var yeniUye: Uye = new Uye();
    this.dialogRef = this.matDialog.open(UyeDialogComponent, {
      width: '400px',
      data: {
        kayit: yeniUye,
        islem: 'ekle'
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      if (d != undefined) {
        this.apiServis.UyeEkle(d).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.UyeListele() : null;
        })
      }
    })
  }
  UyeDuzenle(kayit: Uye) {
    this.dialogRef = this.matDialog.open(UyeDialogComponent, {
      width: "400px",
      data: {
        kayit: kayit,
        islem: "duzenle"
      }
    })
    this.dialogRef.afterClosed().subscribe(d => {
      
      if(!d){

      }else{
        kayit.adSoyad = d?.adSoyad;
        kayit.email = d?.email;
        kayit.kullaniciAdi = d?.kullaniciAdi;
        kayit.parola = d?.parola;
        kayit.uyeTipi = d?.uyeTipi;
  
        this.apiServis.UyeDuzenle(kayit).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.UyeListele() : null;
        })

      }
    })
  }

  UyeSil(kayit: Uye){
    this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent,{
      width: "400px"
    });
    this.confirmDialogRef.componentInstance.dialogMesaj = '"' + kayit.kullaniciAdi + '" ' + "Kullanıcı Adlı Üye Silinecektir Onaylıyor musunuz?";
    this.confirmDialogRef.afterClosed().subscribe(d => {
      if(d){
        this.apiServis.UyeSil(kayit.uyeId).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.UyeListele() : null;
        })
      }
    })
  }

  uyeTipiFiltrele(e: any){
    if(e == 3){
      this.UyeListele();
    }else{
      this.apiServis.UyeByUyeTipi(e).subscribe((d: Uye[]) => {
        this.uyeler = d;
        this.dataSource = new MatTableDataSource(this.uyeler);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      })
    }
  }
}
