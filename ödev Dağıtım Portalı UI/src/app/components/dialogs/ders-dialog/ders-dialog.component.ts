import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ders } from 'src/app/models/Ders';
import { Kategori } from 'src/app/models/Kategori';

@Component({
  selector: 'app-ders-dialog',
  templateUrl: './ders-dialog.component.html',
  styleUrls: ['./ders-dialog.component.css']
})
export class DersDialogComponent implements OnInit {

  dialogBaslik!: string;
  islem!: string;
  frm!: FormGroup;
  yeniDers!: Ders;
  kategoriler!: Kategori[];
  katIdVar: boolean= false;

  constructor(
    private apiServis: ApiService,
    public MatDialog: MatDialog,
    private frmBuilder: FormBuilder,
    public dialogRef: MatDialogRef<DersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.islem = data.islem;
    this.yeniDers = data.kayit;
    this.katIdVar = data.katId;
    if (this.islem == "ekle") {
      this.dialogBaslik = "Ders Ekle";
    }
    if (this.islem == "duzenle") {
      this.dialogBaslik = "Ders Düzenle";
    }
    if(this.katIdVar){
      if(this.katIdVar){
        this.frm?.controls['dersKategoriId'].setValue(this.yeniDers.dersKategoriId);
      }
    }
    this.frm= this.FormOlustur();
  }

  ngOnInit() {
    this.KategoriListele();
  }

  KategoriListele() {
    this.apiServis.KategoriListele().subscribe((d: Kategori[]) => {
      this.kategoriler = d;
    })
  }
  FormOlustur() {
    return this.frmBuilder.group({
      dersAdi: [this.yeniDers.dersAdi],
      dersKodu: [this.yeniDers.dersKodu],
      dersKredi: [this.yeniDers.dersKredi],
      dersKategoriId: [this.yeniDers.dersKategoriId],
    })
  }



}
