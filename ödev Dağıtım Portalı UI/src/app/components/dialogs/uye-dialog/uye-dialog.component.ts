import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Uye } from 'src/app/models/Uye';

@Component({
  selector: 'app-uye-dialog',
  templateUrl: './uye-dialog.component.html',
  styleUrls: ['./uye-dialog.component.css']
})
export class UyeDialogComponent implements OnInit {

  dialogBaslik!: string;
  islem!: string;
  frm!: FormGroup;
  yeniUye!: Uye;
  constructor(
    private apiServis: ApiService,
    public MatDialog: MatDialog,
    private frmBuilder: FormBuilder,
    public dialogRef: MatDialogRef<UyeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.islem = data.islem;
    this.yeniUye = data.kayit;
    if (this.islem == "ekle") {
      this.dialogBaslik = "Üye Ekle";
    }
    if (this.islem == "duzenle") {
      this.dialogBaslik = "Üye Düzenle";
    }
    this.frm= this.FormOlustur();
  }

  ngOnInit() {
  }
  FormOlustur() {
    return this.frmBuilder.group({
      adSoyad: [this.yeniUye.adSoyad],
      kullaniciAdi: [this.yeniUye.kullaniciAdi],
      email: [this.yeniUye.email],
      parola: [this.yeniUye.parola],
      uyeTipi: [this.yeniUye.uyeTipi],
    })
  }



}
