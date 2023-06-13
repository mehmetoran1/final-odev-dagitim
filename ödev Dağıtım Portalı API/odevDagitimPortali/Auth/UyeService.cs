using odevDagitimPortali.Models;
using System;
using odevDagitimPortali.ViewModel;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace odevDagitimPortali.Auth
{
    public class UyeService
    {
        odevPortalEntities db = new odevPortalEntities();

        public UyeModel UyeOturumAc(string kadi, string parola)
        {
            UyeModel uye = db.Uye.Where(s => s.kullaniciAdi == kadi && s.parola == parola).Select(x => new UyeModel()
            {
                uyeId = x.uyeId,
                kullaniciAdi = x.kullaniciAdi,
                adSoyad = x.adSoyad,
                email = x.email,
                parola = x.parola,
                uyeTipi = x.uyeTipi
            }).SingleOrDefault();
            return uye;
        }

    }
}