# Friseursalon Wiesenthal — Website-Relaunch

Statische Website (HTML + CSS + Vanilla JS, kein Framework, kein Build-Schritt)
für den Friseursalon Wiesenthal, Dorfstraße 6, 13057 Berlin-Falkenberg.

## Struktur

```
index.html        One-Pager (Hero, Salon, Leistungen, Team, Galerie,
                  Stimmen, FAQ, Kontakt/Buchung, Anfahrt)
impressum.html    Impressum
datenschutz.html  Datenschutzerklärung
css/style.css     Design-System + alle Styles
js/main.js        Interaktionen (Akkordeons, Karussell, Vorher/Nachher-
                  Slider, Zwei-Klick-Maps, Formular, Sticky-CTA)
assets/fonts/     Self-gehostete Schriften (DSGVO-konform, keine
                  Google-Fonts-Einbindung von fremden Servern)
assets/img/       SVG-Platzhalter — werden durch echte Fotos (WebP) ersetzt
```

Lokal ansehen: einfach `index.html` im Browser öffnen oder
`python3 -m http.server` im Projektordner starten.

## Datenschutz-Eigenschaften

- Keine Cookies, kein Tracking → kein Cookie-Banner nötig
- Google Maps nur per Zwei-Klick-Consent
- Fonts self-hosted
- Rückruf-Formular versendet per `mailto:` (keine Speicherung auf dem Server);
  ein Form-Endpoint (z. B. Formspree) ist in `js/main.js` vorbereitet

## Offene Punkte (TODO: KLÄREN MIT KUNDIN)

Alle Stellen sind im Code mit `TODO: KLÄREN MIT KUNDIN` markiert:

1. **Preisliste** — alle Preise in der Leistungs-Sektion (und FAQ) sind
   realistische Platzhalter und müssen ersetzt werden.
2. **Fotos** — Teamporträts und 6 Galeriebilder sind eingebaut (von der
   Kundin bereitgestellt). Noch offen: Hero-Foto, 2–3 Salonfotos und
   2–3 Vorher/Nachher-Paare (Einverständnis der Kundinnen!). Für bessere
   Qualität später hochauflösende Fotos nachliefern und als WebP exportieren.
3. **Team-Rollen** — genaue Rollen/Qualifikationen (Meisterin? Schwerpunkte?)
   und die Zuordnung der vier Porträtfotos zu den Namen bestätigen.
4. **Original-Salontext** — Text über die Salongestaltung von der alten Seite
   übernehmen (Seite war nicht abrufbar); aktueller Text ist ein Vorschlag.
5. **WhatsApp** — Buttons sind aktuell DEAKTIVIERT (auskommentiert), weil die
   Festnetznummer nicht bei WhatsApp registriert ist und der Link eine
   Fehlermeldung zeigte. Zum Aktivieren: Nummer bei WhatsApp Business
   registrieren oder WhatsApp-fähige Mobilnummer nennen, dann die drei
   auskommentierten Blöcke in `index.html` (Header, Kontakt-Sektion,
   Sticky-Mobile-CTA) wieder einkommentieren und die Nummer ersetzen.
6. **Google-Maps-Profil-URL** — exakten Profil-Link einsetzen (Stimmen-Sektion,
   Anfahrt, JSON-LD `sameAs`); Geo-Koordinaten im JSON-LD prüfen.
7. **ÖPNV** — Haltestelle und Linien für die Anfahrts-Sektion.
8. **Impressum** — Inhaberin/Rechtsform, USt-IdNr., Kammer-Eintragung
   bestätigen; alte Inhalte waren nicht abrufbar. Rechtlich prüfen lassen.
9. **Datenschutzerklärung** — Hosting-Anbieter ergänzen, Stand-Datum setzen,
    rechtlich prüfen lassen.
10. **Online-Buchung** — falls gewünscht: Planity/Treatwell/Calendly-Widget;
    Einbau-Stelle ist in `index.html` (Kontakt-Sektion) vorbereitet und
    kommentiert.
11. **Stellen-Badge** — sucht der Salon Verstärkung? (Footer, vorbereitet)
