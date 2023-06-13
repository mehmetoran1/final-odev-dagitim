import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Kategori } from 'src/app/models/Kategori';

@Component({
  selector: 'app-kategori-dialog',
  templateUrl: './kategori-dialog.component.html',
  styleUrls: ['./kategori-dialog.component.css']
})
export class KategoriDialogComponent implements OnInit {

  dialogBaslik!: string;
  islem!: string;
  frm!: FormGroup;
  yeniKategori!: Kategori;
  constructor(
    private apiServis: ApiService,
    public MatDialog: MatDialog,
    private frmBuilder: FormBuilder,
    public dialogRef: MatDialogRef<KategoriDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.islem = data.islem;
    this.yeniKategori = data.kayit;
    if (this.islem == "ekle") {
      this.dialogBaslik = "Kategori Ekle";
    }
    if (this.islem == "duzenle") {
      this.dialogBaslik = "Kategori Düzenle";
    }
    this.frm= this.FormOlustur();
  }

  ngOnInit() {
  }
  FormOlustur() {
    return this.frmBuilder.group({
      kategoriAdi: [this.yeniKategori.kategoriAdi]
    })
  }



}
