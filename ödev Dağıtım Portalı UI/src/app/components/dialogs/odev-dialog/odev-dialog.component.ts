import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Odev } from 'src/app/models/Odev';
import { Kategori } from 'src/app/models/Kategori';
import { Ders } from 'src/app/models/Ders';

@Component({
  selector: 'app-odev-dialog',
  templateUrl: './odev-dialog.component.html',
  styleUrls: ['./odev-dialog.component.css']
})
export class OdevDialogComponent implements OnInit {

  dialogBaslik!: string;
  islem!: string;
  frm!: FormGroup;
  yeniOdev!: Odev;
  dersler!: Ders[];
  dersIdVar: boolean= false;

  constructor(
    private apiServis: ApiService,
    public MatDialog: MatDialog,
    private frmBuilder: FormBuilder,
    public dialogRef: MatDialogRef<OdevDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.islem = data.islem;
    this.yeniOdev = data.kayit;
    this.dersIdVar = data.dersIdVar;
    if (this.islem == "ekle") {
      this.dialogBaslik = "Odev Ekle";
    }
    if (this.islem == "duzenle") {
      this.dialogBaslik = "Odev Düzenle";
    }
    if(this.dersIdVar){
      this.frm?.controls['odevDersId'].setValue(this.yeniOdev.odevDersId);
    }
    this.frm= this.FormOlustur();
  }

  ngOnInit() {
    this.DersListle();
  }

  DersListle() {
    this.apiServis.DersListele().subscribe((d: Ders[]) => {
      this.dersler = d;
    })
  }
  FormOlustur() {
    return this.frmBuilder.group({
      odevAdi: [this.yeniOdev.odevAdi],
      odevAciklama: [this.yeniOdev.odevAciklama],
      odevSonTarih: [this.yeniOdev.odevSonTarih],
      odevDersId: [this.yeniOdev.odevDersId],
    })
  }



}
