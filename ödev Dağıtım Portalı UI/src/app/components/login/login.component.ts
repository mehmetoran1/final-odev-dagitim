import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sonuc } from 'src/app/models/Sonuc';
import { ApiService } from 'src/app/services/api.service';
import { MyAlertService } from 'src/app/services/myAlert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    public apiServis: ApiService,
    private alert: MyAlertService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  OturumAc(kAdi: string, sifre: string) {
    var s: Sonuc = new Sonuc();
    this.apiServis.tokenAl(kAdi, sifre).subscribe({
      next: (d: any) => {
        localStorage.setItem("token", d.access_token)
        localStorage.setItem("uid", d.uyeId)
        localStorage.setItem("kadi", d.uyeKadi)
        localStorage.setItem("uyeYetkileri", d.uyeYetkiler)
        location.href = "/"

      },
      error: err => {
        s.islem = false;
        s.mesaj = "Kullanıcı Adı Veya Parola Geçersizdir";
        this.alert.AlertUygula(s)
      }
    })
  }

}
