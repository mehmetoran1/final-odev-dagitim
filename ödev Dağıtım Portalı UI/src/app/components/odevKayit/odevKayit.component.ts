import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';
import { MatTableDataSource } from '@angular/material/table';
import { Kayit } from 'src/app/models/Kayit';
import { KayitDialogComponent } from '../dialogs/kayit-dialog/kayit-dialog.component';
import { Sonuc } from 'src/app/models/Sonuc';

@Component({
  selector: 'app-odevKayit',
  templateUrl: './odevKayit.component.html',
  styleUrls: ['./odevKayit.component.css']
})
export class OdevKayitComponent implements OnInit {
  kayitlar!: Kayit[];
  displayedColumns = ["kayitId", "uyeBilgi", "odevBilgi", "odevAciklama","odevSonTarih", "kayitDurum", "islemler"]
  dataSource: any;
  showSpinner: boolean = false;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dialogRef!: MatDialogRef<KayitDialogComponent>;
  confirmDialogRef!: MatDialogRef<ConfirmDialogComponent>;
  constructor(
    public apiServis: ApiService,
    private matDialog: MatDialog,
    private alertServis: MyAlertService
  ) { }

  ngOnInit() {
    this.KayitListele();
  }


   KayitListele() {
     this.apiServis.KayitListele().subscribe((d: Kayit[]) => {
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
   KayitEkle() {
     var yeniKayit: Kayit = new Kayit();
     this.dialogRef = this.matDialog.open(KayitDialogComponent, {
       width: '400px',
       data: {
         kayit: yeniKayit,
         islem: 'ekle'
       }
     })
     this.dialogRef.afterClosed().subscribe(d => {
      console.log(d);
       if (d != undefined) {
        this.apiServis.KayitEkle(d).subscribe((s: Sonuc) => {
          this.alertServis.AlertUygula(s)
          s.islem ? this.KayitListele() : null;
        })
       }
     })
   }
   KayitDuzenle(kayit: Kayit) {
     this.dialogRef = this.matDialog.open(KayitDialogComponent, {
       width: "400px",
       data: {
         kayit: kayit,
         islem: "duzenle"
       }
     })
     this.dialogRef.afterClosed().subscribe(d => {
      
       if(!d){

       }else{
        kayit.kayitOdevId = d.kayitOdevId;
        kayit.kayitUyeId = d.kayitUyeId;
        kayit.kayitDurum = d.kayitDurum;
  
         this.apiServis.KayitDuzenle(kayit).subscribe((s: Sonuc) => {
           this.alertServis.AlertUygula(s)
           s.islem ? this.KayitListele() : null;
         })

       }
     })
   }

   KayitSil(kayit: Kayit){
     this.confirmDialogRef = this.matDialog.open(ConfirmDialogComponent,{
       width: "400px"
     });
     this.confirmDialogRef.componentInstance.dialogMesaj =kayit.uyeBilgi.adSoyad + " Öğrenciye Kayıtlı " + kayit.odevBilgi.odevAdi + " Ödev Silinecektir Onaylıyor musunuz?";
     this.confirmDialogRef.afterClosed().subscribe(d => {
       if(d){
         this.apiServis.KayitSil(kayit.kayitId).subscribe((s: Sonuc) => {
           this.alertServis.AlertUygula(s)
           s.islem ? this.KayitListele() : null;
         })
       }
     })
   }

   changeDurum(e: any){
    console.log(e);
      if(e.value == 2){
        this.KayitListele();
      }else{
        this.apiServis.KayitByDurum(e.value).subscribe((d: Kayit[]) => {
          this.kayitlar = d;
          this.dataSource = new MatTableDataSource(this.kayitlar);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        })
      }
    }
}
