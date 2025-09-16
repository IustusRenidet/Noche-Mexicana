const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.siteName = 'Noche Mexicana';
  res.locals.currentYear = new Date().getFullYear();
  next();
});

let gritos = [
  {
    id: 1,
    texto: '¡Viva México!',
    descripcion: 'El grito que encabeza cada celebración patria y nos recuerda la fuerza de nuestra independencia.',
    region: 'Dolores Hidalgo, Guanajuato',
    aportadoPor: 'Tradición del Grito de Independencia',
    votos: 186,
    tags: ['Historia', 'Independencia']
  },
  {
    id: 2,
    texto: '¡Que viva la Independencia!',
    descripcion: 'El eco que resuena en plazas y hogares cuando recordamos a las y los héroes que nos dieron patria.',
    region: 'Ciudad de México',
    aportadoPor: 'Celebración oficial del Zócalo capitalino',
    votos: 142,
    tags: ['Historia', 'Orgullo']
  },
  {
    id: 3,
    texto: '¡Que viva la familia mexicana!',
    descripcion: 'Un grito que celebra la unión familiar y la calidez de cada hogar que se reúne la noche del 15 de septiembre.',
    region: 'Toda la República',
    aportadoPor: 'Familias de las fiestas patrias',
    votos: 121,
    tags: ['Familia', 'Tradición']
  },
  {
    id: 4,
    texto: '¡Que suenen los mariachis!',
    descripcion: 'Con trompetas y violines el mariachi acompaña la fiesta más mexicana.',
    region: 'Jalisco',
    aportadoPor: 'Amantes de la música vernácula',
    votos: 98,
    tags: ['Música', 'Fiesta']
  },
  {
    id: 5,
    texto: '¡Arriba el norte y su bravura!',
    descripcion: 'Rinde homenaje al carácter valiente y trabajador del norte de México.',
    region: 'Norte de México',
    aportadoPor: 'Comunidades norteñas',
    votos: 83,
    tags: ['Regional', 'Orgullo']
  },
  {
    id: 6,
    texto: '¡Que vivan nuestras raíces!',
    descripcion: 'Abraza la diversidad cultural, lingüística y étnica de los pueblos originarios.',
    region: 'Comunidades indígenas',
    aportadoPor: 'Colectivos culturales',
    votos: 75,
    tags: ['Cultura', 'Diversidad']
  }
];

const loteriaCards = [
  'El gallo', 'El diablito', 'La dama', 'El catrín', 'El paraguas', 'La sirena', 'La escalera', 'La botella',
  'El barril', 'El árbol', 'El melón', 'El valiente', 'El gorrito', 'La muerte', 'La pera', 'La bandera',
  'El bandolón', 'El violoncello', 'La garza', 'El pájaro', 'La mano', 'La bota', 'La luna', 'El cotorro',
  'El borracho', 'El negrito', 'El corazón', 'La sandía', 'El tambor', 'El camarón', 'Las jaras', 'El músico',
  'La araña', 'El soldado', 'La estrella', 'El cazo', 'El mundo', 'El Apache', 'El nopal', 'El alacrán',
  'La rosa', 'La calavera', 'La campana', 'El cantarito', 'El venado', 'El Sol', 'La corona', 'La chalupa',
  'El pino', 'El pescado', 'La palma', 'La maceta', 'El arpa', 'La rana'
];

const musicLibrary = [
  {
    genre: 'Mariachi clásico',
    description: 'Violines, trompetas y guitarrón que acompañan serenatas, festejos y grandes historias de amor.',
    playlistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX1HUbZS4LEyL',
    tracks: [
      {
        title: 'El Son de la Negra (versión instrumental)',
        artist: 'Mariachi tradicional',
        region: 'Jalisco',
        year: 1958,
        description: 'El himno del mariachi que no puede faltar en ninguna plaza.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_3a24847ce1.mp3?filename=fiesta-en-el-corazon-110961.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/Son_de_la_Negra'
      },
      {
        title: 'Cielito Lindo (serenata acústica)',
        artist: 'Trío de guitarras',
        region: 'Centro de México',
        year: 1940,
        description: 'Interpretación íntima para cantar a todo pulmón el “ay ay ay ay”.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/15/audio_2d9b4ffd93.mp3?filename=serenata-124566.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/Cielito_lindo'
      },
      {
        title: 'Guadalajara (versión de salón)',
        artist: 'Mariachi de gala',
        region: 'Jalisco',
        year: 1960,
        description: 'Una fanfarria orgullosa que enciende cualquier celebración jalisciense.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/07/24/audio_540d9bbd58.mp3?filename=fiesta-mariachi-115158.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/Guadalajara_(canci%C3%B3n)'
      }
    ]
  },
  {
    genre: 'Son jarocho y tradición veracruzana',
    description: 'Zapateado, jarana y arpa con versos que viajan entre ríos, fandangos y costas del Golfo.',
    playlistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX4xuWVBsdf00',
    tracks: [
      {
        title: 'La Bamba (jarana comunitaria)',
        artist: 'Colectivo jaranero',
        region: 'Veracruz',
        year: 1958,
        description: 'Versión festiva inspirada en los fandangos de Tlacotalpan.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/16/audio_373f338387.mp3?filename=son-jarocho-110978.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/La_bamba'
      },
      {
        title: 'El Cascabel',
        artist: 'Taller de sones jarochos',
        region: 'Veracruz',
        year: 1969,
        description: 'Un clásico para improvisar décimas y presumir el zapateado.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/22/audio_24c5d68230.mp3?filename=son-del-rio-126947.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/El_cascabel'
      },
      {
        title: 'El Colás',
        artist: 'Encuentro de jaraneros',
        region: 'Veracruz',
        year: 1971,
        description: 'Un son alegre que invita a toda la comunidad a cantar en coro.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2023/02/02/audio_27b141a218.mp3?filename=colores-de-veracruz-139396.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/El_col%C3%A1s'
      }
    ]
  },
  {
    genre: 'Cumbia, tropical y fiesta',
    description: 'Sabrosura para la pista con acordeón, metales y percusiones herederas del Caribe.',
    playlistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWXRqgorJj26U',
    tracks: [
      {
        title: 'Cumbia Sampuesana',
        artist: 'Aniceto Molina',
        region: 'Veracruz / Caribe',
        year: 1970,
        description: 'Un clásico bailable que llegó a México y nunca se fue.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/08/17/audio_b523c32d72.mp3?filename=cumbia-no-frills-faster-116199.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/Aniceto_Molina'
      },
      {
        title: 'Mi Matamoros Querido',
        artist: 'Rigo Tovar',
        region: 'Tamaulipas',
        year: 1972,
        description: 'Cumbia con toques rockeros dedicada a la frontera norte.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2023/02/28/audio_bda17109c4.mp3?filename=cumbia-futura-141334.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/Rigo_Tovar'
      },
      {
        title: 'Como te voy a olvidar',
        artist: 'Los Ángeles Azules',
        region: 'Iztapalapa, CDMX',
        year: 1996,
        description: 'Cumbia sinfónica para cantar a todo pulmón con la familia.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/07/04/audio_af3c19bc29.mp3?filename=cumbia-sinfonica-114065.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/Los_%C3%81ngeles_Azules'
      }
    ]
  },
  {
    genre: 'Rock, pop y nuevas voces',
    description: 'Propuestas contemporáneas que siguen poniendo en alto el talento nacional.',
    playlistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX2VXwwgu0PzV',
    tracks: [
      {
        title: 'En el 2000 (versión acústica)',
        artist: 'Natalia Lafourcade',
        region: 'Veracruz / CDMX',
        year: 2002,
        description: 'Una mirada pop nostálgica que se volvió himno generacional.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/09/23/audio_dae394a7d3.mp3?filename=pop-mexicano-120606.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/Natalia_Lafourcade'
      },
      {
        title: 'Eres',
        artist: 'Café Tacvba',
        region: 'Ciudad de México',
        year: 2003,
        description: 'Balada alternativa que mezcla ternura, rock y tradiciones.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2022/11/04/audio_1dcaed9d98.mp3?filename=amor-en-mexico-125921.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/Caf%C3%A9_Tacvba'
      },
      {
        title: 'Hasta la raíz (huapango pop)',
        artist: 'Natalia Lafourcade',
        region: 'Veracruz',
        year: 2015,
        description: 'Un canto a la identidad y al arraigo que combina pop con son jarocho.',
        audioUrl: 'https://cdn.pixabay.com/download/audio/2023/05/04/audio_3bfcb96d70.mp3?filename=huapango-pop-146551.mp3',
        infoUrl: 'https://es.wikipedia.org/wiki/Hasta_la_ra%C3%ADz_(canci%C3%B3n)'
      }
    ]
  }
];

const triviaQuestions = [
  {
    id: 1,
    category: 'Gastronomía',
    difficulty: 'Familiar',
    question: 'Platillos típicos que se disfrutan en las fiestas patrias mexicanas.',
    clue: 'Piensa en antojitos que se sirven en septiembre con maíz, chile y carne.',
    funFact: 'El pozole prehispánico se preparaba originalmente con maíz cacahuazintle y carne de guajolote.',
    answers: [
      { text: 'Pozole', points: 45 },
      { text: 'Chiles en nogada', points: 25 },
      { text: 'Tostadas de tinga', points: 20, aliases: ['Tostadas'] },
      { text: 'Tamales', points: 10 }
    ]
  },
  {
    id: 2,
    category: 'Historia',
    difficulty: 'Familiar',
    question: 'Héroes y heroínas que se recuerdan durante el Grito de Independencia.',
    clue: 'Se mencionan desde Miguel Hidalgo hasta figuras femeninas fundamentales.',
    funFact: 'Josefa Ortiz de Domínguez avisó sobre la conspiración desde Querétaro con un mensaje cifrado en plena madrugada.',
    answers: [
      { text: 'Miguel Hidalgo', points: 35, aliases: ['Miguel Hidalgo y Costilla', 'Hidalgo'] },
      { text: 'José María Morelos', points: 25, aliases: ['Morelos'] },
      { text: 'Josefa Ortiz de Domínguez', points: 20, aliases: ['La Corregidora'] },
      { text: 'Ignacio Allende', points: 20, aliases: ['Allende'] }
    ]
  },
  {
    id: 3,
    category: 'Música',
    difficulty: 'Familiar',
    question: 'Instrumentos que no pueden faltar en un mariachi tradicional.',
    clue: 'Piensa en cuerdas y metales que acompañan la voz.',
    funFact: 'El mariachi moderno se consolidó en la década de 1930 cuando se integró la trompeta al ensamble.',
    answers: [
      { text: 'Violín', points: 35 },
      { text: 'Trompeta', points: 30 },
      { text: 'Guitarrón', points: 20, aliases: ['Guitarron'] },
      { text: 'Vihuela', points: 15 }
    ]
  },
  {
    id: 4,
    category: 'Lugares',
    difficulty: 'Explorador',
    question: 'Pueblos mágicos famosos por sus celebraciones patrias.',
    clue: 'Uno está en Guanajuato, otro en Michoacán y otro en Puebla.',
    funFact: 'Dolores Hidalgo fue declarado Pueblo Mágico en 2002 y es considerado la cuna de la Independencia.',
    answers: [
      { text: 'Dolores Hidalgo', points: 40 },
      { text: 'Pátzcuaro', points: 25, aliases: ['Patzcuaro'] },
      { text: 'Cholula', points: 20 },
      { text: 'San Miguel de Allende', points: 15 }
    ]
  },
  {
    id: 5,
    category: 'Gastronomía',
    difficulty: 'Explorador',
    question: 'Bebidas representativas de México para brindar en una noche mexicana.',
    clue: 'Incluye destilados y bebidas sin alcohol tradicionales.',
    funFact: 'El tequila y el mezcal cuentan con denominación de origen protegida.',
    answers: [
      { text: 'Tequila', points: 35 },
      { text: 'Mezcal', points: 25 },
      { text: 'Agua de horchata', points: 20, aliases: ['Horchata'] },
      { text: 'Atole', points: 20 }
    ]
  },
  {
    id: 6,
    category: 'Arte y cultura',
    difficulty: 'Curiosidad',
    question: 'Bailes folclóricos emblemáticos de la cultura mexicana.',
    clue: 'Uno es de Veracruz, otro de Jalisco y uno más del norte.',
    funFact: 'El jarabe tapatío se hizo famoso internacionalmente tras presentarse en el Palacio de Bellas Artes en 1924.',
    answers: [
      { text: 'Jarabe tapatío', points: 35, aliases: ['Jarabe Tapatio'] },
      { text: 'Son jarocho', points: 25 },
      { text: 'Danza del venado', points: 20, aliases: ['Danza del Venado Yaqui'] },
      { text: 'Polka norteña', points: 20, aliases: ['Polka Norteña'] }
    ]
  },
  {
    id: 7,
    category: 'Historia',
    difficulty: 'Curiosidad',
    question: 'Estados que formaron parte del primer recorrido insurgente tras el Grito.',
    clue: 'Inició en Guanajuato y pasó por territorios hoy conocidos como estados centrales.',
    funFact: 'El ejército insurgente llegó a tener más de 20 mil personas antes de la toma de la Alhóndiga de Granaditas.',
    answers: [
      { text: 'Guanajuato', points: 35 },
      { text: 'Michoacán', points: 25 },
      { text: 'Querétaro', points: 20, aliases: ['Queretaro'] },
      { text: 'Estado de México', points: 20, aliases: ['Edomex', 'Mexico'] }
    ]
  },
  {
    id: 8,
    category: 'Personajes',
    difficulty: 'Explorador',
    question: 'Personajes de la música mexicana contemporánea que han ganado premios Grammy Latinos.',
    clue: 'Piensa en cantautoras y agrupaciones que fusionan géneros.',
    funFact: 'El Grammy Latino reconoce a artistas desde el año 2000 y México es de los países con más galardones.',
    answers: [
      { text: 'Natalia Lafourcade', points: 35 },
      { text: 'Lila Downs', points: 25 },
      { text: 'Café Tacvba', points: 20, aliases: ['Cafe Tacuba', 'Cafe Tacvba'] },
      { text: 'Carlos Rivera', points: 20 }
    ]
  },
  {
    id: 9,
    category: 'Cine',
    difficulty: 'Cinéfilo',
    question: 'Películas mexicanas imprescindibles para un maratón patriótico.',
    clue: 'Incluye clásicos de la Época de Oro y relatos históricos.',
    funFact: '“Los tres García” y “Vámonos con Pancho Villa” consolidaron al cine nacional en la década de 1940.',
    answers: [
      { text: 'Los tres García', points: 30 },
      { text: 'Vámonos con Pancho Villa', points: 25, aliases: ['Vamonos con Pancho Villa'] },
      { text: 'Como agua para chocolate', points: 25 },
      { text: 'Roma', points: 20 }
    ]
  },
  {
    id: 10,
    category: 'Saberes populares',
    difficulty: 'Curiosidad',
    question: 'Elementos que no pueden faltar en una kermés mexicana.',
    clue: 'Piensa en juegos, música en vivo y antojitos.',
    funFact: 'Las kermeses llegaron a México a principios del siglo XX y se mezclaron con tradiciones religiosas y comunitarias.',
    answers: [
      { text: 'Juego de lotería', points: 30, aliases: ['Lotería', 'Juego de Loteria'] },
      { text: 'Puestos de antojitos', points: 25, aliases: ['Antojitos'] },
      { text: 'Música en vivo', points: 25 },
      { text: 'Papel picado', points: 20 }
    ]
  },
  {
    id: 11,
    category: 'Naturaleza',
    difficulty: 'Explorador',
    question: 'Símbolos naturales que representan a México.',
    clue: 'Uno es un ave, otro una flor y otro un árbol.',
    funFact: 'El águila real aparece en el escudo nacional desde 1823.',
    answers: [
      { text: 'Águila real', points: 35, aliases: ['Aguila Real'] },
      { text: 'Flor de dahlia', points: 25, aliases: ['Dalia', 'Flor de Dahlia'] },
      { text: 'Nopal', points: 20 },
      { text: 'Ahuehuete', points: 20 }
    ]
  },
  {
    id: 12,
    category: 'Festividades',
    difficulty: 'Familiar',
    question: 'Celebraciones mexicanas que reúnen música, comida y comunidad.',
    clue: 'Se celebran a lo largo del año y honran tanto la vida como la muerte.',
    funFact: 'El Día de Muertos fue reconocido como Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO en 2008.',
    answers: [
      { text: 'Día de Muertos', points: 35, aliases: ['Dia de Muertos'] },
      { text: 'Guelaguetza', points: 25 },
      { text: 'Fiestas patrias', points: 20, aliases: ['Fiestas Patrias Mexicanas'] },
      { text: 'Feria de San Marcos', points: 20 }
    ]
  }
];

let nextGritoId = gritos.reduce((max, grito) => Math.max(max, grito.id), 0) + 1;

const getRanking = () => [...gritos].sort((a, b) => b.votos - a.votos);

const getRankingMetrics = () => {
  const ranking = getRanking();
  const totalVotes = ranking.reduce((sum, grito) => sum + grito.votos, 0);
  const maxVotes = ranking.length ? Math.max(...ranking.map((grito) => grito.votos)) : 0;
  return { ranking, totalVotes, maxVotes };
};

app.get('/', (req, res) => {
  const { ranking } = getRankingMetrics();
  const topGritos = ranking.slice(0, 3);
  res.render('menu', {
    activePage: 'menu',
    topGritos,
    featuredMusic: musicLibrary.slice(0, 3),
    totalTriviaQuestions: triviaQuestions.length
  });
});

app.get('/gritos', (req, res) => {
  const { ranking, totalVotes, maxVotes } = getRankingMetrics();
  res.render('gritos', {
    activePage: 'gritos',
    gritos: ranking,
    totalVotes,
    maxVotes,
    highlight: ranking[0] || null,
    secondaryHighlights: ranking.slice(1, 3)
  });
});

app.post('/gritos/agregar', (req, res) => {
  const { grito, descripcion, region, aportadoPor } = req.body;
  const texto = grito ? grito.trim() : '';
  if (!texto) {
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(400).json({ success: false, message: 'El grito debe tener texto.' });
    }
    return res.redirect('/gritos#ranking');
  }

  const nuevoGrito = {
    id: nextGritoId++,
    texto,
    descripcion: descripcion && descripcion.trim() ? descripcion.trim() : 'Un grito fresco que se une a la celebración.',
    region: region && region.trim() ? region.trim() : 'Toda la República',
    aportadoPor: aportadoPor && aportadoPor.trim() ? aportadoPor.trim() : 'Anónimo',
    votos: 0,
    tags: []
  };

  gritos.push(nuevoGrito);
  const metrics = getRankingMetrics();

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.status(201).json({
      success: true,
      grito: nuevoGrito,
      ...metrics,
      highlight: metrics.ranking[0] || null,
      secondaryHighlights: metrics.ranking.slice(1, 3)
    });
  }

  res.redirect('/gritos#ranking');
});

app.post('/gritos/votar/:id', (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  const grito = gritos.find((item) => item.id === id);
  if (grito) {
    grito.votos += 1;
  }

  const metrics = getRankingMetrics();

  if (req.headers.accept && req.headers.accept.includes('application/json')) {
    return res.json({
      success: Boolean(grito),
      grito,
      ...metrics,
      highlight: metrics.ranking[0] || null,
      secondaryHighlights: metrics.ranking.slice(1, 3)
    });
  }

  res.redirect('/gritos#ranking');
});

app.get('/loteria', (req, res) => {
  res.render('loteria', {
    activePage: 'loteria',
    cards: loteriaCards
  });
});

app.get('/trivia', (req, res) => {
  const categories = Array.from(
    triviaQuestions.reduce((set, question) => set.add(question.category), new Set())
  );

  const groupedCategories = categories.map((category) => ({
    category,
    sampleQuestions: triviaQuestions
      .filter((question) => question.category === category)
      .slice(0, 2)
      .map((question) => question.question)
  }));

  res.render('trivia', {
    activePage: 'trivia',
    questions: triviaQuestions,
    groupedCategories
  });
});

app.get('/api/trivia/questions', (req, res) => {
  res.json(triviaQuestions);
});

app.get('/musica', (req, res) => {
  res.render('musica', {
    activePage: 'musica',
    musicLibrary
  });
});

app.get('/api/musica', (req, res) => {
  res.json(musicLibrary);
});

app.use((req, res) => {
  res.status(404).render('menu', {
    activePage: 'menu',
    topGritos: getRanking().slice(0, 3),
    featuredMusic: musicLibrary.slice(0, 3),
    totalTriviaQuestions: triviaQuestions.length,
    notFound: true
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

module.exports = app;
