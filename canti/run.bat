@echo off
:: Chiedi il titolo della canzone
set /p title=Inserisci il titolo della canzone: 

:: Esegui il programma Python e passa il titolo e il testo come argomenti
python song_to_html.py "%title%"
pause