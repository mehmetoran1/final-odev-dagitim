import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Kayit } from 'src/app/models/Kayit';
import { Uye } from 'src/app/models/Uye';
import { Odev } from 'src/app/models/Odev';

@Component({
  selector: 'app-kayit-dialog',
  templateUrl: './kayit-dialog.component.html',
  styleUrls: ['./kayit-dialog.component.css']
})
export class KayitDialogComponent implements OnInit {

  dialogBaslik!: string;
  islem!: string;
  frm!: FormGroup;
  yeniKayit!: Kayit;
  ogrenciler!: Uye[];
  odevler!: Odev[];
  uyeIdVar: boolean = false;
  odevIdVar: boolean = false;

  constructor(
    private apiServis: ApiService,
    public MatDialog: MatDialog,
    private frmBuilder: FormBuilder,
    public dialogRef: MatDialogRef<KayitDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.islem = data.islem;
    this.yeniKayit = data.kayit;
    if(data.uyeIdVar){
      this.uyeIdVar = true;
    }
    if(data.odevIdVar){
      this.odevIdVar = true;
    }
    if (this.islem == "ekle") {
      this.dialogBaslik = "Kayit Ekle";
    }
    if (this.islem == "duzenle") {
      this.dialogBaslik = "Kayit Düzenle";
    }

    this.frm= this.FormOlustur();
  }

  ngOnInit() {
    this.OgrenciListele();
    this.OdevListele();
    
  }
  OgrenciListele(){
    this.apiServis.UyeByUyeTipi(0).subscribe((d: Uye[]) => {
      this.ogrenciler = d;
    })
  }
  OdevListele(){
    this.apiServis.OdevListele().subscribe((d: Odev[]) => {
      this.odevler = d;
    })
  }

    FormOlustur() {
      return this.frmBuilder.group({
        kayitOdevId: [this.yeniKayit.kayitOdevId],
        kayitUyeId: [this.yeniKayit.kayitUyeId],
        kayitDurum: [this.yeniKayit.kayitDurum]
      })
    }



}
