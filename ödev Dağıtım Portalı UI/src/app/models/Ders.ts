import { Kategori } from "./Kategori";

export class Ders {
    dersId!: number;
    dersAdi!: string;
    dersKodu !: string;
    dersKredi!: string;
    dersKategoriId!: number;
    kategoriBilgi!: Kategori;
    dersOdevSayisi!: number;
}