Per scaricare ulteriori file di font, seguire la seguente procedura.

1. Su [https://fonts.google.com/]() scegliere il font da scaricare.
2. Cliccare sul font scelto.
3. Cliccare sul pulsante 'Get Font'.
4. Cliccare su 'Get embed code'.
5. Copiare il link che si trova nel codice html fornito.
6. Incollare il link in una nuova scheda del browser.
7. Scegliere solo i tipi gli stili del font che si vogliono ottenere.
8. Copiare i link degli stili scelti (dentro `src: url(...)`).
9. Incollare i link in altre schede del browser e scaricare i file. Consiglio di rinominarli.
10. Tornare sulla scheda di Google Fonts (come fino al passaggio 5).
11. Copiare il codice CSS.
12. Incollare il codice all'inizio del file CSS.
13. Sostituire il nome della classe con `@font-face`.
14. Aggiungere, se non presente, `font-display: swap`.
15. Aggiungere `src: url('/fonts/nome.woff2') format('woff2');`.

N.B.: Fare attenzione che il sistema linguistico sia latino.