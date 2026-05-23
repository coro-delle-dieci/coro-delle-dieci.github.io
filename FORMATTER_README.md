# Configurazione HTML Formatter

Questo file `.jsbeautifyrc` configura il formatter HTML per mantenere uno stile consistente.

## Come usare

### Opzione 1: Editor (consigliato)

**VS Code:**
1. Installa l'estensione "Beautify" o "Prettier"
2. Copia `.jsbeautifyrc` nella root del progetto
3. Il formatter userà automaticamente queste impostazioni

**Altri editor:**
- Cerca un plugin HTML formatter compatibile con `.jsbeautifyrc`

### Opzione 2: Da riga di comando

```bash
# Installa js-beautify globalmente
npm install -g js-beautify

# Formatta un singolo file
html-beautify --config .jsbeautifyrc canti/vocazione.html

# Formatta tutti i file HTML in una cartella
html-beautify --config .jsbeautifyrc --replace 'canti/*.html'
```

## Impostazioni

- **indent_size: 4** - Usa 4 spazi per l'indentazione
- **wrap_line_length: 0** - Non spezzare le righe automaticamente
- **indent_inner_html: false** - Non indentare `<head>` e `<body>`
- **max_preserve_newlines: 2** - Massimo 2 righe vuote consecutive
