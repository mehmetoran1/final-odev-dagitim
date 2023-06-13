using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Web;

namespace odevDagitimPortali.Auth
{
    public class AuthProvider : OAuthAuthorizationServerProvider
    {

        public override async Task ValidateClientAuthentication(OAuthValidateClientAuthenticationContext context)
        {
            context.Validated();
        }

        public override async Task GrantResourceOwnerCredentials(OAuthGrantResourceOwnerCredentialsContext context)
        {
            //context.OwinContext.Response.Headers.Add("Access-Control-Allow-Origin", new[] { "*" });

            var uyeServis = new UyeService();
            var uye = uyeServis.UyeOturumAc(context.UserName, context.Password);
            List<string> uyeYetkiler = new List<string>();


            if (uye != null)
            {
                string yetki = "";
                if (uye.uyeTipi == 0)
                {
                    yetki = "ogrenci";
                }
                else if(uye.uyeTipi == 1)
                {
                    yetki = "ogretmen";
                }else
                {
                    yetki = "admin";
                }
                uyeYetkiler.Add(yetki);

                var identity = new ClaimsIdentity(context.Options.AuthenticationType);

                identity.AddClaim(new Claim(ClaimTypes.Name, context.UserName));
                identity.AddClaim(new Claim(ClaimTypes.Role, yetki));
                identity.AddClaim(new Claim(ClaimTypes.PrimarySid, uye.uyeId.ToString()));

                AuthenticationProperties prop = new AuthenticationProperties(new Dictionary<string, string>
                {
                    { "uyeId" ,uye.uyeId.ToString() },
                    { "uyeKadi", uye.kullaniciAdi},
                    { "uyeYetkiler", Newtonsoft.Json.JsonConvert.SerializeObject(uyeYetkiler)}
                });

                AuthenticationTicket ticket = new AuthenticationTicket(identity, prop);

                context.Validated(ticket);
            }
            else
            {
                context.SetError("Geçersiz İstek", "Hatalı Kullanıcı Bilgis");
                return;

            }
        }
        public override Task TokenEndpoint(OAuthTokenEndpointContext context)
        {
            foreach (KeyValuePair<string, string> property in context.Properties.Dictionary)
            {
                context.AdditionalResponseParameters.Add(property.Key, property.Value);
            }

            return Task.FromResult<object>(null);
        }
    }
}