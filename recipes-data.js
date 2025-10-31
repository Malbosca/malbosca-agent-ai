// Database delle ricette Malbosca
const recipesData = [
    {
        id: 1,
        name: "Tagliere di Salumi e Formaggi",
        category: "antipasti",
        description: "Un classico antipasto italiano con salumi pregiati e formaggi stagionati selezionati.",
        icon: "🧀",
        difficulty: "Facile",
        time: "15 min",
        servings: 4,
        products: ["Prosciutto Crudo", "Salame", "Pecorino", "Parmigiano"],
        ingredients: [
            "200g di Prosciutto Crudo DOP",
            "150g di Salame nostrano",
            "200g di Pecorino stagionato",
            "150g di Parmigiano Reggiano DOP 24 mesi",
            "100g di Bresaola della Valtellina",
            "Fichi freschi o marmellata di fichi",
            "Noci e nocciole",
            "Pane carasau o grissini"
        ],
        instructions: [
            "Disporre i salumi su un grande tagliere di legno, facendo delle piccole pieghe decorative",
            "Tagliare i formaggi a scaglie o cubetti, a seconda della consistenza",
            "Aggiungere i fichi freschi tagliati a metà o la marmellata in una ciotolina",
            "Disporre le noci e nocciole in piccoli mucchietti",
            "Accompagnare con pane carasau o grissini croccanti",
            "Servire a temperatura ambiente per esaltare i sapori"
        ],
        tips: "Per un abbinamento perfetto, servite con un vino rosso corposo o un Prosecco DOC."
    },
    {
        id: 2,
        name: "Pasta alla Carbonara Tradizionale",
        category: "primi",
        description: "La vera carbonara romana con guanciale, uova, pecorino e pepe nero.",
        icon: "🍝",
        difficulty: "Media",
        time: "25 min",
        servings: 4,
        products: ["Guanciale", "Pecorino", "Pasta Artigianale"],
        ingredients: [
            "400g di pasta artigianale (spaghetti o rigatoni)",
            "200g di guanciale a cubetti",
            "4 tuorli d'uovo freschi",
            "100g di Pecorino Romano grattugiato",
            "Pepe nero macinato fresco q.b.",
            "Sale q.b."
        ],
        instructions: [
            "Mettere a bollire abbondante acqua salata per la pasta",
            "Tagliare il guanciale a listarelle e farlo rosolare in padella senza aggiungere olio fino a renderlo croccante",
            "In una ciotola, sbattere i tuorli con il pecorino grattugiato e abbondante pepe nero",
            "Cuocere la pasta al dente e scolarla, conservando un po' di acqua di cottura",
            "Spegnere il fuoco sotto la padella del guanciale, unire la pasta e mescolare",
            "Aggiungere il composto di uova e pecorino, amalgamando velocemente e aggiungendo acqua di cottura se necessario",
            "Servire immediatamente con una spolverata di pecorino e pepe nero"
        ],
        tips: "Il segreto è non far cuocere le uova: la pasta deve essere calda ma non bollente quando si aggiunge il composto."
    },
    {
        id: 3,
        name: "Risotto al Tartufo Nero",
        category: "primi",
        description: "Un risotto cremoso e profumato con tartufo nero pregiato.",
        icon: "🍚",
        difficulty: "Media",
        time: "35 min",
        servings: 4,
        products: ["Tartufo Nero", "Parmigiano", "Vino Bianco"],
        ingredients: [
            "320g di riso Carnaroli",
            "50g di tartufo nero fresco",
            "1 litro di brodo vegetale",
            "80g di Parmigiano Reggiano grattugiato",
            "1 scalogno",
            "100ml di vino bianco",
            "50g di burro",
            "Olio extravergine di oliva",
            "Sale e pepe q.b."
        ],
        instructions: [
            "Preparare il brodo vegetale e tenerlo caldo",
            "Tritare finemente lo scalogno e farlo imbiondire in una casseruola con olio e un po' di burro",
            "Tostare il riso per 2 minuti mescolando continuamente",
            "Sfumare con il vino bianco e lasciare evaporare",
            "Aggiungere il brodo un mestolo alla volta, mescolando spesso",
            "A cottura ultimata (circa 18 minuti), mantecare con il burro rimanente e il parmigiano",
            "Aggiungere il tartufo nero a lamelle sottili, conservandone alcune per guarnire",
            "Servire immediatamente con lamelle di tartufo fresco sopra"
        ],
        tips: "Per intensificare il sapore, potete aggiungere alcune gocce di olio al tartufo durante la mantecatura."
    },
    {
        id: 4,
        name: "Bistecca alla Fiorentina",
        category: "secondi",
        description: "La classica bistecca toscana con osso, cotta alla brace.",
        icon: "🥩",
        difficulty: "Media",
        time: "20 min",
        servings: 2,
        products: ["Carne Chianina", "Olio EVO", "Sale Grosso"],
        ingredients: [
            "1 bistecca di Chianina con osso (circa 1kg)",
            "Olio extravergine di oliva toscano",
            "Sale grosso marino",
            "Pepe nero macinato fresco",
            "Rosmarino fresco (facoltativo)"
        ],
        instructions: [
            "Estrarre la bistecca dal frigorifero almeno 1 ora prima per portarla a temperatura ambiente",
            "Preparare la brace o riscaldare una griglia molto calda",
            "Non salare la carne prima della cottura",
            "Cuocere la bistecca 3-4 minuti per lato per una cottura al sangue (la vera fiorentina)",
            "Mettere la bistecca in verticale sull'osso per 1-2 minuti",
            "Trasferire su un tagliere, condire con sale grosso, pepe e un filo d'olio EVO",
            "Lasciare riposare 5 minuti prima di servire"
        ],
        tips: "La vera fiorentina deve essere alta almeno 3-4 cm e cotta rigorosamente al sangue. Accompagnate con fagioli cannellini e un Chianti Classico."
    },
    {
        id: 5,
        name: "Bruschette al Pomodoro",
        category: "antipasti",
        description: "Bruschette croccanti con pomodori freschi, basilico e olio extravergine.",
        icon: "🍅",
        difficulty: "Facile",
        time: "15 min",
        servings: 4,
        products: ["Olio EVO", "Pomodori", "Pane Toscano"],
        ingredients: [
            "8 fette di pane toscano",
            "4 pomodori maturi",
            "2 spicchi d'aglio",
            "Basilico fresco",
            "Olio extravergine di oliva",
            "Sale e pepe q.b."
        ],
        instructions: [
            "Tagliare i pomodori a cubetti piccoli e metterli in una ciotola",
            "Aggiungere basilico tritato, sale, pepe e un generoso filo d'olio EVO",
            "Lasciare marinare per 10 minuti",
            "Tostare le fette di pane su una griglia o in padella",
            "Strofinare delicatamente l'aglio tagliato sul pane ancora caldo",
            "Distribuire il condimento di pomodoro sulle bruschette",
            "Servire immediatamente con un filo d'olio a crudo"
        ],
        tips: "Per un tocco speciale, aggiungete qualche scaglia di ricotta salata o burrata."
    },
    {
        id: 6,
        name: "Parmigiana di Melanzane",
        category: "primi",
        description: "La classica parmigiana napoletana con melanzane fritte, salsa di pomodoro e mozzarella.",
        icon: "🍆",
        difficulty: "Media",
        time: "90 min",
        servings: 6,
        products: ["Parmigiano", "Mozzarella", "Pomodori"],
        ingredients: [
            "1kg di melanzane",
            "500g di mozzarella fiordilatte",
            "200g di Parmigiano Reggiano grattugiato",
            "800g di passata di pomodoro",
            "2 spicchi d'aglio",
            "Basilico fresco",
            "Olio per friggere",
            "Sale q.b."
        ],
        instructions: [
            "Tagliare le melanzane a fette di 5mm, salarle e farle spurgare per 30 minuti",
            "Sciacquare e asciugare bene le melanzane",
            "Friggerle in abbondante olio fino a doratura",
            "Preparare la salsa facendo soffriggere l'aglio, aggiungendo la passata e il basilico",
            "In una pirofila, alternare strati di melanzane, salsa, mozzarella a cubetti e parmigiano",
            "Terminare con parmigiano abbondante",
            "Cuocere in forno a 180°C per 30-40 minuti",
            "Lasciare riposare 10 minuti prima di servire"
        ],
        tips: "La parmigiana è ancora più buona il giorno dopo! Conservatela in frigo e riscaldatela in forno."
    },
    {
        id: 7,
        name: "Ossobuco alla Milanese",
        category: "secondi",
        description: "Tenero ossobuco di vitello con gremolada, servito con risotto allo zafferano.",
        icon: "🍖",
        difficulty: "Difficile",
        time: "120 min",
        servings: 4,
        products: ["Carne di Vitello", "Vino Bianco", "Brodo"],
        ingredients: [
            "4 fette di ossobuco di vitello (alte 3-4cm)",
            "Farina 00 per infarinare",
            "1 cipolla",
            "1 carota",
            "1 costa di sedano",
            "400g di pomodori pelati",
            "250ml di vino bianco secco",
            "Brodo di carne",
            "50g di burro",
            "Per la gremolada: prezzemolo, aglio, scorza di limone"
        ],
        instructions: [
            "Legare gli ossibuchi con lo spago da cucina per mantenere la forma",
            "Infarinare leggermente la carne",
            "Rosolare gli ossibuchi nel burro finché sono ben dorati da entrambi i lati",
            "Rimuovere la carne e soffriggere il trito di cipolla, carota e sedano",
            "Rimettere la carne, sfumare con il vino bianco",
            "Aggiungere i pomodori e il brodo, coprire e cuocere a fuoco basso per 90 minuti",
            "Preparare la gremolada tritando finemente prezzemolo, aglio e scorza di limone",
            "Servire gli ossibuchi con il loro fondo di cottura e la gremolada sopra"
        ],
        tips: "L'ossobuco è perfetto con il risotto allo zafferano. Il midollo dell'osso è una prelibatezza da gustare con un cucchiaino!"
    },
    {
        id: 8,
        name: "Caprese Gourmet",
        category: "antipasti",
        description: "La classica caprese rivisitata con mozzarella di bufala, pomodori cuore di bue e basilico.",
        icon: "🧄",
        difficulty: "Facile",
        time: "10 min",
        servings: 4,
        products: ["Mozzarella di Bufala", "Pomodori", "Olio EVO"],
        ingredients: [
            "2 mozzarelle di bufala DOP (250g ciascuna)",
            "4 pomodori cuore di bue maturi",
            "Basilico fresco",
            "Olio extravergine di oliva DOP",
            "Sale marino in fiocchi",
            "Pepe nero macinato fresco",
            "Aceto balsamico tradizionale (facoltativo)"
        ],
        instructions: [
            "Tagliare i pomodori a fette spesse circa 1cm",
            "Tagliare le mozzarelle a fette della stessa dimensione",
            "Disporre sul piatto alternando fette di pomodoro e mozzarella",
            "Distribuire le foglie di basilico fresco",
            "Condire con sale in fiocchi e un filo abbondante di olio EVO",
            "Aggiungere una macinata di pepe nero",
            "Se desiderato, decorare con qualche goccia di aceto balsamico"
        ],
        tips: "Usate ingredienti a temperatura ambiente per esaltarne i sapori. La mozzarella di bufala è fondamentale!"
    },
    {
        id: 9,
        name: "Polenta con Funghi Porcini",
        category: "primi",
        description: "Polenta cremosa servita con funghi porcini trifolati.",
        icon: "🍄",
        difficulty: "Media",
        time: "60 min",
        servings: 4,
        products: ["Funghi Porcini", "Polenta", "Parmigiano"],
        ingredients: [
            "300g di polenta bramata",
            "400g di funghi porcini freschi (o 50g secchi reidratati)",
            "3 spicchi d'aglio",
            "Prezzemolo fresco",
            "100g di Parmigiano Reggiano grattugiato",
            "50g di burro",
            "Olio extravergine di oliva",
            "Sale e pepe q.b.",
            "1,5 litri d'acqua"
        ],
        instructions: [
            "Pulire i funghi porcini con un panno umido e tagliarli a fette",
            "Portare a ebollizione l'acqua salata e versare la polenta a pioggia mescolando",
            "Cuocere la polenta mescolando spesso per 40-45 minuti",
            "Nel frattempo, soffriggere l'aglio in olio, aggiungere i funghi e cuocere a fuoco vivo",
            "Aggiungere prezzemolo tritato, sale e pepe ai funghi",
            "Mantecare la polenta con burro e parmigiano",
            "Servire la polenta cremosa con i funghi trifolati sopra"
        ],
        tips: "Se usate funghi secchi, conservate l'acqua di ammollo filtrata e aggiungetela alla polenta per più sapore."
    },
    {
        id: 10,
        name: "Tiramisù Classico",
        category: "dolci",
        description: "Il famoso dolce italiano con savoiardi, mascarpone, caffè e cacao.",
        icon: "🍰",
        difficulty: "Facile",
        time: "30 min + riposo",
        servings: 8,
        products: ["Mascarpone", "Savoiardi", "Caffè"],
        ingredients: [
            "500g di mascarpone",
            "4 uova fresche (tuorli e albumi separati)",
            "100g di zucchero",
            "300g di savoiardi",
            "300ml di caffè espresso (raffreddato)",
            "3 cucchiai di liquore Marsala o Amaretto (facoltativo)",
            "Cacao amaro in polvere",
            "Un pizzico di sale"
        ],
        instructions: [
            "Preparare il caffè e lasciarlo raffreddare completamente",
            "Montare i tuorli con metà dello zucchero fino a ottenere una crema chiara e spumosa",
            "Incorporare il mascarpone ai tuorli montati, mescolando delicatamente",
            "Montare gli albumi a neve ferma con un pizzico di sale e lo zucchero rimanente",
            "Incorporare delicatamente gli albumi al composto di mascarpone",
            "Inzuppare rapidamente i savoiardi nel caffè (con liquore se desiderato)",
            "Disporre uno strato di savoiardi in una pirofila, coprire con la crema",
            "Ripetere con un altro strato di savoiardi e crema",
            "Spolverare abbondante cacao amaro in superficie",
            "Refrigerare per almeno 4-6 ore (meglio una notte intera)"
        ],
        tips: "Non inzuppare troppo i savoiardi per evitare che si disfino. Il tiramisù è ancora più buono dopo una notte in frigo!"
    },
    {
        id: 11,
        name: "Penne all'Arrabbiata",
        category: "primi",
        description: "Pasta al pomodoro piccante con aglio, peperoncino e prezzemolo.",
        icon: "🌶️",
        difficulty: "Facile",
        time: "25 min",
        servings: 4,
        products: ["Pasta Artigianale", "Pomodori", "Peperoncino"],
        ingredients: [
            "400g di penne rigate",
            "400g di pomodori pelati",
            "3 spicchi d'aglio",
            "2 peperoncini freschi (o secchi)",
            "Prezzemolo fresco",
            "Olio extravergine di oliva",
            "Sale q.b."
        ],
        instructions: [
            "In una padella, soffriggere l'aglio tagliato a fette e il peperoncino in olio EVO",
            "Aggiungere i pomodori pelati schiacciati e cuocere per 15 minuti",
            "Regolare di sale e aggiungere il prezzemolo tritato",
            "Cuocere le penne in abbondante acqua salata",
            "Scolare la pasta al dente e saltarla nella padella con il sugo",
            "Servire con prezzemolo fresco e un filo d'olio a crudo"
        ],
        tips: "Regolate la quantità di peperoncino secondo il vostro gusto! Per un tocco gourmet, aggiungete pecorino grattugiato."
    },
    {
        id: 12,
        name: "Panna Cotta ai Frutti di Bosco",
        category: "dolci",
        description: "Delicato dolce al cucchiaio con coulis di frutti di bosco.",
        icon: "🍓",
        difficulty: "Facile",
        time: "20 min + riposo",
        servings: 6,
        products: ["Panna Fresca", "Frutti di Bosco", "Miele"],
        ingredients: [
            "500ml di panna fresca",
            "80g di zucchero",
            "1 bacca di vaniglia",
            "3 fogli di colla di pesce (6g)",
            "300g di frutti di bosco misti",
            "50g di zucchero per il coulis",
            "Succo di mezzo limone"
        ],
        instructions: [
            "Mettere la colla di pesce in acqua fredda per ammorbidirla",
            "Scaldare la panna con lo zucchero e i semi di vaniglia senza farla bollire",
            "Strizzare la colla di pesce e scioglierla nella panna calda",
            "Versare in stampini monoporzione e refrigerare per almeno 4 ore",
            "Preparare il coulis frullando i frutti di bosco con zucchero e limone",
            "Filtrare il coulis per eliminare i semi",
            "Servire la panna cotta rovesciata nel piatto con il coulis"
        ],
        tips: "Per una versione più leggera, usate metà panna e metà latte. Decorate con frutti di bosco freschi."
    }
];

// Estrazione automatica di tutti i prodotti unici
const allProducts = [...new Set(recipesData.flatMap(recipe => recipe.products))].sort();
