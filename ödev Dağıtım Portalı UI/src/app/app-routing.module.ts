import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { UyeComponent } from './components/uye/uye.component';
import { KategoriComponent } from './components/kategori/kategori.component';
import { DersComponent } from './components/ders/ders.component';
import { OdevComponent } from './components/odev/odev.component';
import { DersOdevComponent } from './components/dersOdev/dersOdev.component';
import { OdevKayitComponent } from './components/odevKayit/odevKayit.component';
import { UyeOdevComponent } from './components/uyeOdev/uyeOdev.component';
import { OdevUyeComponent } from './components/odevUye/odevUye.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/AuthGuard';

const routes: Routes = [
  {
    path: "", component: HomeComponent
  },
  {
    path: "uye", component: UyeComponent, canActivate: [AuthGuard],
    data: {
      yetkiler: ["admin"],
      gerigit: "/login"
    }
  },
  {
    path: "login", component: LoginComponent
  },
  {
    path: "kategori", component: KategoriComponent, canActivate: [AuthGuard],
    data: {
      yetkiler: ["admin", "ogretmen", "ogrenci"],
      gerigit: "/login"
    }
  },
  {
    path: "ders", component: DersComponent, canActivate: [AuthGuard],
    data: {
      yetkiler: ["admin", "ogretmen", "ogrenci"],
      gerigit: "/login"
    }
  },
  {
    path: "odev", component: OdevComponent, canActivate: [AuthGuard],
    data: {
      yetkiler: ["admin", "ogretmen", "ogrenci"],
      gerigit: "/login"
    }
  },
  {
    path: "kat-ders/:katId", component: DersComponent, canActivate: [AuthGuard],
    data: {
      yetkiler: ["admin", "ogretmen", "ogrenci"],
      gerigit: "/login"
    }
  },
  {
    path: "ders-odev/:dersId", component: DersOdevComponent, canActivate: [AuthGuard],
    data: {
      yetkiler: ["admin", "ogretmen", "ogrenci"],
      gerigit: "/login"
    }
  },
  {
    path: "odev-kayit", component: OdevKayitComponent, canActivate: [AuthGuard],
    data: {
      yetkiler: ["admin", "ogretmen", "ogrenci"],
      gerigit: "/login"
    }
  },
  {
    path: "uyeodev/:uyeId", component: UyeOdevComponent, canActivate: [AuthGuard],
    data: {
      yetkiler: ["admin", "ogretmen", "ogrenci"],
      gerigit: "/login"
    }
  },
  {
    path: "odevuye/:odevId", component: OdevUyeComponent, canActivate: [AuthGuard],
    data: {
      yetkiler: ["admin", "ogretmen", "ogrenci"],
      gerigit: "/login"
    }
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
