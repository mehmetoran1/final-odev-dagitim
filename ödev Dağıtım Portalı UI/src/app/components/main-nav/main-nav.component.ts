import { Component, inject, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { ApiService } from 'src/app/services/api.service';
import { Ders } from 'src/app/models/Ders';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
  kadi!: any;
  Dersler!: Ders[];

  constructor(
    public apiServis: ApiService
  ) {}
  ngOnInit(): void {
    if(this.apiServis.OturumKontrol()){
      this.kadi = localStorage.getItem("kadi");
    }
    this.DersListele();
  }

  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

    DersListele(){
      this.apiServis.DersListele().subscribe((d: Ders[]) => {
        this.Dersler = d;
      })
    }
    OturumKapat(){
      localStorage.clear();
      location.href="/login";
    }
}
