import { Odev } from "./Odev";
import { Uye } from "./Uye";

export class Kayit {
    kayitId!: number;
    kayitOdevId!: number;
    kayitUyeId!: number;
    kayitDurum!: number;
    odevBilgi!: Odev;
    uyeBilgi!: Uye;
}