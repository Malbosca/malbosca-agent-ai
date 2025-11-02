/**
 * Script JavaScript da eseguire nella Console del browser
 * per estrarre gli URL dei PDF dei vini
 *
 * ISTRUZIONI:
 * 1. Apri http://catalogoviti.politicheagricole.it/dopigp.php
 * 2. Premi F12 → tab Console
 * 3. Copia e incolla questo intero script
 * 4. Premi Invio
 * 5. Lo script processerà tutti i vini e mostrerà il risultato JSON
 * 6. Copia il JSON e salvalo
 */

(async function() {
    console.log('🍷 ESTRATTORE URL PDF VINI - INIZIO');
    console.log('=====================================\n');

    // Lista dei codici dei vini da processare (primi 30 DOCG)
    const wineCodes = [
        {code: '1001', name: 'Aglianico del Taburno'},
        {code: '1003', name: 'Alta Langa'},
        {code: '1004', name: 'Amarone della Valpolicella'},
        {code: '1024', name: 'Asolo - Prosecco'},
        {code: '1005', name: 'Asti'},
        {code: '1007', name: 'Barbaresco'},
        {code: '1008', name: "Barbera d'Asti"},
        {code: '1010', name: 'Bardolino Superiore'},
        {code: '1011', name: 'Barolo'},
        {code: '1012', name: "Brachetto d'Acqui o Acqui"},
        {code: '1013', name: 'Brunello di Montalcino'},
        {code: '1014', name: 'Cannellino di Frascati'},
        {code: '1015', name: 'Carmignano'},
        {code: '1020', name: 'Cerasuolo di Vittoria'},
        {code: '1021', name: 'Cesanese del Piglio o Piglio'},
        {code: '1022', name: 'Chianti'},
        {code: '1023', name: 'Chianti Classico'},
        {code: '1026', name: 'Colli di Conegliano'},
        {code: '1028', name: 'Colli Orientali del Friuli Picolit'}
        // Aggiungi altri codici secondo necessità
    ];

    const results = [];
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    for (let i = 0; i < wineCodes.length; i++) {
        const wine = wineCodes[i];
        console.log(`[${i+1}/${wineCodes.length}] Processando: ${wine.name}`);

        try {
            // Fetch della pagina del vino
            const url = `http://catalogoviti.politicheagricole.it/denominazioni.php?codice=${wine.code}`;
            const response = await fetch(url);
            const html = await response.text();

            // Parse HTML per trovare link PDF
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            // Cerca link al PDF
            const pdfLinks = doc.querySelectorAll('a[href$=".pdf"], a[href*=".pdf"]');

            let pdfUrl = null;
            if (pdfLinks.length > 0) {
                pdfUrl = pdfLinks[0].href;
                console.log(`  ✓ PDF trovato: ${pdfUrl}`);
            } else {
                console.log(`  ✗ PDF non trovato`);
            }

            results.push({
                code: wine.code,
                name: wine.name,
                denominazione_url: url,
                pdf_url: pdfUrl
            });

        } catch (error) {
            console.log(`  ✗ Errore: ${error.message}`);
            results.push({
                code: wine.code,
                name: wine.name,
                error: error.message
            });
        }

        // Pausa per non sovraccaricare il server
        await delay(1000);
    }

    console.log('\n=====================================');
    console.log('✓ COMPLETATO!');
    console.log('=====================================\n');
    console.log('Copia il JSON qui sotto:\n');
    console.log(JSON.stringify(results, null, 2));

    // Scarica automaticamente il file
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'wine_pdf_urls.json';
    link.click();

    console.log('\n📥 File scaricato: wine_pdf_urls.json');

    return results;
})();
