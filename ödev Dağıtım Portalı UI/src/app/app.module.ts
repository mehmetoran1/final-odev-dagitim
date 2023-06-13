import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './components/home/home.component';
import { MaterialModule } from './material.module';
import { AlertDialogComponent } from './components/dialogs/alert-dialog/alert-dialog.component';
import { MyAlertService } from './services/myAlert.service';
import { ConfirmDialogComponent } from './components/dialogs/confirm-dialog/confirm-dialog.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { UyeComponent } from './components/uye/uye.component';
import { KategoriComponent } from './components/kategori/kategori.component';
import { UyeDialogComponent } from './components/dialogs/uye-dialog/uye-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KategoriDialogComponent } from './components/dialogs/kategori-dialog/kategori-dialog.component';
import { DersDialogComponent } from './components/dialogs/ders-dialog/ders-dialog.component';
import { DersComponent } from './components/ders/ders.component';
import { OdevComponent } from './components/odev/odev.component';
import { OdevDialogComponent } from './components/dialogs/odev-dialog/odev-dialog.component';
import { DersOdevComponent } from './components/dersOdev/dersOdev.component';
import { OdevKayitComponent } from './components/odevKayit/odevKayit.component';
import { KayitDialogComponent } from './components/dialogs/kayit-dialog/kayit-dialog.component';
import { UyeOdevComponent } from './components/uyeOdev/uyeOdev.component';
import { OdevUyeComponent } from './components/odevUye/odevUye.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './services/AuthGuard';
import { AuthInterceptor } from './services/AuthInterceptor';
import { ApiService } from './services/api.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MainNavComponent,
    UyeComponent,
    KategoriComponent,
    DersComponent,
    OdevComponent,
    DersOdevComponent,
    OdevKayitComponent,
    UyeOdevComponent,
    OdevUyeComponent,
    LoginComponent,





    //DIALOGS
    AlertDialogComponent,
    UyeDialogComponent,
    KategoriDialogComponent,
    ConfirmDialogComponent,
    DersDialogComponent,
    OdevDialogComponent,
    KayitDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [MyAlertService, AuthGuard,ApiService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
