# Create favicons

Crea i file favicons come descritto in [How to Favicon in 2024](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs).

Utilizzo:

```bash
npx create-favicons [--dir=./path/to/dir]
```

Lo script agisce normalmente nella directory corrente, ma, utilizzando il parametro opzionale `--dir`, 
è possibile specificare una directory alternativa (percorso relativo alla dir di esecuzione). 

Lo script in prima battuta cerca nella dir di lavoro il file `create-favicons-cfg.mjs` che contiene un oggetto
con tutti i parametri necessari (vedi di seguito).

In sua assenza, cerca il file `favicon-src.svg` da utilizzare come sorgente per tutte le immagini, e assumendo i valori di default (vedi dopo) per tutti gli altri parametri. 

Tra gli altri, è possibile spcificare il parametro `small_src_img` nel caso sia necessario specificare un'immagine ottimizzata per le piccole dimensioni (32px).

Il formato migliore per i file sorgenti è SVG, o in alternativa PNG.

In assenza di entrambi i file viene restituito un errore.

I parametri di default sono elencati in dettaglio nel file `src/create-favicons/src/defaults.mjs`, 
e possono essere personalizzati nel file di configurazione, che deve avere questa forma: 

```javascript
// file create-favicons-cfg.mjs
const params = [{ /* ... */ }];

export default params;
```

`params` può essere un ogetto o un array. In quest'ultimo caso, ogni elemento dell'array corrisponde ad un diverso set di favicons.

Per creare un file di cfg di esempio **nella directory corrente** (con tutti i valori di default e la loro descrizione), 
utilizzare il comando:

```bash
npx create-favicons init
```

## Utilizzo da remoto

I comandi possono essere eseguiti anche senza installare preventivamente il package:

```
npx --package=@massimo-cassandro/dev-utilities create-favicons init
npx --package=@massimo-cassandro/dev-utilities create-favicons [--dir=...]

```

## Esecuzione

Lo script produce le varie immagini png ed svg, il file `manifest.webmanifest` e uno snippet html (o nel linguaggio indicato nel parametro `snippet_language`).
Tutte le immagini vengono ottimizzate con [SVGO](https://github.com/svg/svgo) e [imagemin](https://github.com/imagemin/imagemin).

Tutti file vengono salvati nella dir indicata in `output_dir` (default: directory corrente).

Opzionalmente il file snippet può essere salvato in una directory differente (`snippet_path`) o si può decidere di non crearlo, 
impostando il valore `snippet_name` a `null`.

Nel file di configurazione è anche possibile impostare il parametro `webmanifest_extra`, che permette di aggiungere voci aggiuntive al file *manifest*.
Per ulteriori info: <https://developer.mozilla.org/en-US/docs/Web/Manifest>

File generati:

```html
<link rel="icon" href="/favicon.ico" sizes="any"> <!-- 32×32 + 16x16 -->
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png"> <!-- 180×180 -->
<link rel="manifest" href="/manifest.webmanifest">
```

```javascript
// manifest.webmanifest
{
  "icons": [
    { "src": "/icon-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "/icon-512.png", "type": "image/png", "sizes": "512x512" }
  ]
}
```

Vedi anche esempio in <https://github.com/massimo-cassandro/dev-utilities/tree/main/test/test/create-favicons-test>.
