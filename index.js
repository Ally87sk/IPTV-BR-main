const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');
const axios = require('axios');

const M3U_URL = 'http://pastebin.com/raw/gvXYDQhC';
const CATEGORIES = [
  { id: 'cat_BRASIL', name: 'BRASIL', keywords: ['Rede Minas','Ypê (MG)','PLAN TV (MG)','MARCHETI','TV Nação','Sou + Pop','TV SETE LAGOAS (MG)','Aldeia','Sou +Pop Tv','TV Aracati (CE)','TV Metropole (CE)','TvPlug (CE)','CHDPlay (CE)','TV LAVRAS (CE)','UmaTV','Mana Brasil','TV Nova Nordeste (PE)','TV NORDESTINA (PE)','TV CORDEIRO (PE)','Caruaru (PE)','PBC18 (PE)','Gente Brasil (SP)','BLITS TV (SP)','AWTV (SP)','NGT (SP)','VIVAX (SP)','ISTV (SP)','TV ITAPE (SP)','Santa Cecilia (SP)','TV CHROMA (SP)','VV8 TV (SP)','Receitas','Olha TV (UniTv) (ES)','W1 webtv (SE)','Canal 29','TV Gazeta','Brasil Oeste (MT)','Yeeaah TV','Olé TV','Canal 33 ESPKA-BOOM','RNS','TV COM MACEIO','RTV CANAL38 (PR)','Central TV (PR)','TV Bahia (BA)','TV SDB (BA)','TV NBN (BA)','TV Sjid (BA)','CWB TV (PR)','ElyTV','NATURE TV','TV SUL BAHIA','UNISUL TV','CLASSIQUE TV','America SP','Viva Web TV','D+ TV (RS)','TV Mon (RS)','ADESSO TV (RS)','TV PASSO FUNDO (RS)','TV CLUBE WEB (RS)','Vambora Tv (RS)','Nativus (RS)','TCM 10 (RN)','Tv Caicó (RN)','NOVA ERA (SC)','PRIMER TV (SC)','TV Florida','TV OMINDARE','Fala Litoral WEB TV','TV SUL DE MINAS','🇵🇹 SIC ᴴᴰ','TV MAIS MARICA','SAO RAIMUNDO TV','Marajoara-Pará','TV TSPB (Tv Brasil)','CANAL 25 JUNDIAI','Inova360','Phoenix TV','XR Health','Canal Educação','Diversidade','TV A7 (GO)','TV da Gente','TV Padre Cícero','TV Recon','Notícias Agrícolas','Tv Londres'] },
  { id: 'cat_filmes', name: 'Filmes', keywords: ['Play+','Hallo Movies',TV GRU (SP)','Gospel Movie TV','Trailers de filmes','Rede QDM (SP)','Moviesphere','Tvi FICÇÃO','Sony One','My Time Movies','Runtime','Runtime CinEspanto','Runtime Comédia','Runtime Ação','Runtime Romance','Runtime Crime','Urban Movie','Cinerama 🇧🇴 (Bolívia)','Channel 1','DarkFlix',Soul Cine Clube','Cindie Lite','Spark TV','TV GALLO (PI)','Seo Peliculas 🇧🇴','Filmes Ação','Adrenalina Freezone','Cine Comédia','Cine Comédia Romântica','Cine Drama','BangBang','Cine Aventura','Cine Romance','Filmelier','Filmes Suspense','Cine Crime','Cine Terror','Ficção Científica','NetMovies','Runtime','Filmes Nacionais','Cine Clássicos','Cine Inspiração','Cine Família','Séries Criminais','Pluto TV Séries Ação','Séries Sci-Fi','Séries Drama','Séries Comédia','BET PlutoTV','Retrô','Cineminha','Cine Sucessos'] },
   { id: 'cat_novelas', name: 'Novelas', keywords: ['Novelas Turcas','Novelissima','Novelissima (Esp)','Reviva - Séries','Sony Novelas','Canela Telenovelas','SomosNovelas 🇺🇸','TELEVISA','Wedo Amor','SIC Especial','Wow (El Salvador)','Como Antes TV'] },
     { id: 'cat_musicas', name: 'Músicas', keywords: ['M2O','KroneHIT (Áustria)','1Mus (Rússia)','MAIS UM','Gospel Music','Rock TV','Ocko Star (RC)','4Fun TV (Poland)','RTL (Italia)','Colosal TV','88 STEREO (Costa-Rica)','TV 538 (Netherlands)','ON FM TV','CMC (California)','BLINK 102.7 (MS)','Rede Metropolitana','Trace Urban','MTV Biggest Pop - Pluto TV','Rjtv','AlternaTV','Popcorn central','Company tv','Hit Tv','Nick Music','Panik TV (Grécia)','The Voice TV','mbcm k-pop 🇰🇷','Urbano TV','Activa Tv','V2Beat','NOW ROCK 🇬🇧','MTV Rock','MTV Party Music','Next Radio Generation','Vevo Pop (US)','MozHit','Atomic Academy 🇷🇺','Magic Tv 🇷🇴'] },
      { id: 'cat_news', name: 'News', keywords: ['Jovem Pan News','Record News','CNN Brasil','Band News 🔴','DW News PT','Canal Gov','CNN Portugal 🇵🇹','Al Jazeera','RT 🇪🇸','Euronews 🇵🇹','NEW Brasil','CANAL UOL','011 News','TV VIDEONEWS','TV Câmera','CNBC'] },
       { id: 'cat_religioso', name: 'Religioso', keywords: ['RIT','Jampa Jovem','Avivando Nações','Feliz 7 Play','Feliz 7 Play 2','Rede Vida HD','TV Universal (IURD)','TV Templo','Novo Tempo','IMPD TV','TV Adorador','Global Station','TV El Shaday','TV Apóstolos','TV Kairós','Tv Evangelizar','Spirit Tv 🇺🇸','Adoram Tv 🇩🇴'] },
       { id: 'cat_desenhos', name: 'Desenhos', keywords: ['Loading','Anime TV','Otaku Sign TV','Urban Kids','Geekdot','Kuriakos Kids','Retro Cartoon','Fox Kids','Gospel Cartoon','Toon Googles','Tartarugas Ninja','Poop Tv','ZooMoo','PBS Kids EN','Pluto TV Rugrats','Wording','Nick Clássico','BabyFirst','Anime | Pluto TV','BeyBlade','Anime Ação | Pluto TV','Super Onze | Pluto TV','Yu-Gi-Oh! -Pluto TV','Os Padrinhos Mágicos | Pluto TV','Rocket Power | Pluto TV','Turma da Mônica - Pluto TV','NickTeen - Pluto TV','iCarly - Pluto TV','Geek e Tech','Kanuca TV','Mr Bean'] },
         { id: 'cat_esportes', name: 'Esportes', keywords: ['Life Fit 🏋️‍♀️','CazéTV','CazéTV l','REDBULL','Esportes Brasilia','Fuel Tv','Livre TV (RN)','Desimpedidos','Canal UOL Esportes','Pluto TV Esportes','MAVTV Brasil','PFL MMA','Dazn Darts','World of freesports 🇩🇪','Canela Deportes','FOX Deportes','ACI Sports','Cs Sport +1','Sport Outdoor','Danz Combate','Fusball Tv','World of Wof Sports 🇺🇸','Bike','Surfer']},
           { id: 'cat_documentario', name: 'Documentario', keywords: ['Urban Travel','Urban Docs','Viagens - Pluto TV','LOVE NATURE','Natureza - Pluto TV','Xtrema Nature 🇦🇷','RT Documentary Channel','RedB Nature 🇫🇷','DroneTV Cam','Animais','O Encantador de Cães','Turbo','Curiosidade','Vida Real','Negócio Fechado','Minha Obsessão Favorita','Pronto-socorro','Pluto Mistérios','Caçadores de Óvnis','Documentários - Pluto Tv','Guerreiros do Ar','Pluto TV Investigação','Detetives Médicos','CNN Money','Canal Educação','CONECT TV (SP)','VezaTv (Entrevistas)'] },
             { id: 'cat_reality', name: 'Reality', keywords: ['MTV Pluto','MTV Com o Ex','MasterChef','SharkTank','Comédia Stand-Up','TVI Reality 🇵🇹','iFood','MTV Catfish | Brasil'] },
               { id: 'Internacionais', name: 'Internacionais', keywords: ['A24 🇦🇷','TELESUR 🇻🇪','Ecuavisa 🇪🇨','Zaracay Tv 🇪🇨','Azteca Internacional 🇲🇽 México','Estrellas 🇲🇽','The Guardian','PRESS TV 🇮🇷','Panamerica 🇵🇪','CCTV News 🇯🇵','Sic Notícias 🇵🇹','FOX NEWS ᴴᴰ 🇺🇲','Deutsche Welle','Global News','DMJ 🇵🇪','32/4 🇪🇸','ATV Turkya 🇹🇷','Star Tv 🇹🇷','RTP TV Portuguesa 🇵🇹','SKY News','NHK Japan 🇯🇵','NTV 24 Japan 🇯🇵','Ecuador Tv 🇪🇨','MBN 🇰🇷','ABN News 🇰🇷','Arirang Korea 🇰🇷','RT France 🇫🇷','TV 5MONDE INFO 🇫🇷','LE MÉDIA TV 🇫🇷','The Weather Channel','Tv Penol 🇧🇴','Púcon Tv 🇨🇱','MO Channel 🇵🇪','Retrox 🇨🇷','Multivision Sports 🇬🇹','San Isidro 🇩🇴'] },
                 { id: 'cat_radios', name: 'Radios', keywords: ['Rádio Pop','Dumont 104.3','Rádio Pop PB','SoundPop','Hip-Hop','RÁDIO MONTE FM 96.7','RÁDIO JK 102.7','RÁDIO CIDADE 99.7 FM','Nordeste Fm','Metropolitana','ClipStation Radio','Energia 97 Fm','Pagode 90','Rock','89\'Rock','Recife 97.1 FM','Gospel','Gospel Internacional','Rádio Mix SP','Meo Music','RC OneHit World','Bíblia em áudio','Mega Hits Pt','Nostalgia FM','Central Reggae','Luna World FM','Gazeta Fm 88.1','Rádio Trend - Trap (SP)','RFI Notícias','Massa FM (Floripa)','Só Flashback','92 FM','AE Rádio 🇨🇱'] },
       ]

const manifest = {
  id: 'com.iptv.0800.addon',
  version: '1.0.0',
  name: 'IPTV 0800',
  description: '🇧🇷 Acesso completo aos principais canais brasileiros de TV aberta, esportes, notícias, entretenimento e muito mais! Organize seus canais favoritos por categoria e assista à TV brasileira onde estiver.\n\n💰 Apoie o projeto: https://livepix.gg/willacris',
  
  // Informações do desenvolvedor
  contactEmail: 'alinesuper15@gmail.com',

  // Recursos disponíveis
  resources: ['catalog', 'stream', 'meta'],
  types: ['tv'],
  
  // Catálogos organizados por categoria
  catalogs: CATEGORIES.map(cat => ({
    type: 'tv',
    id: cat.id,
    name: cat.name,
    extra: [
      {
        name: 'search',
        isRequired: false
      },
      {
        name: 'genre',
        isRequired: false,
        options: ['IPTV']
      }
    ]
  })),
  
  // Prefixos de ID
  idPrefixes: ['iptv_'],
  
  // Configurações visuais
  logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/1200px-Flag_of_Brazil.svg.png',
  background: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
  
  // Configurações de comportamento
  behaviorHints: {
    adult: false,
    p2p: false,
    configurable: false,
    configurationRequired: false
  }
};

const builder = new addonBuilder(manifest);

let cache = null;
let cacheTime = 0;
const CACHE_DURATION = 300000;

async function loadM3U() {
  const now = Date.now();
  if (cache && (now - cacheTime < CACHE_DURATION)) {
    console.log(`📋 IPTV 0800: usando cache (${cache.length} canais)`);
    return cache;
  }

  try {
    console.log('🔄 IPTV 0800: carregando lista de canais...');
    const res = await axios.get(M3U_URL, {
      timeout: 30000,
      headers: {
        'User-Agent': 'IPTV-0800-Addon/1.0.0'
      }
    });
    
    const lines = res.data.split('\n');
    const items = [];
    const logoRegex = /tvg-logo="([^"]+)"/;
    const groupRegex = /group-title="([^"]+)"/;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('#EXTINF:')) {
        const logoMatch = line.match(logoRegex);
        const groupMatch = line.match(groupRegex);
        const logo = logoMatch ? logoMatch[1] : 'https://img.icons8.com/color/480/tv.png';
        const group = groupMatch ? groupMatch[1] : 'BRASIL';

        const name = line.substring(line.indexOf(',') + 1).trim();
        const url = (lines[i + 1] || '').trim();

        // Filtrar URLs válidas - aceitar máximo de formatos de streaming possíveis
        if (url && name && name.length > 0) {
          
          // Protocolos de streaming suportados
          const supportedProtocols = [
            'http://', 'https://',      // HTTP/HTTPS streams
            'rtmp://', 'rtmps://',      // RTMP streams  
            'rtsp://',                  // RTSP streams
            'udp://',                   // UDP streams
            'rtp://',                   // RTP streams
            'mms://',                   // MMS streams
            'mmsh://', 'mmst://'        // Microsoft Media Server
          ];
          
          const hasValidProtocol = supportedProtocols.some(protocol => 
            url.toLowerCase().startsWith(protocol)
          );
          
          if (hasValidProtocol) {
            // Filtrar arquivos não-streaming (incluindo .mp4 conforme solicitado)
            const invalidExtensions = [
              '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico', '.bmp',  // Imagens
              '.txt', '.html', '.htm', '.xml', '.json',                          // Documentos
              '.zip', '.rar', '.7z', '.tar', '.gz',                             // Arquivos compactados
              '.mp4', '.avi', '.mkv', '.mov', '.wmv', '.flv'                    // Vídeos offline (conforme solicitado)
            ];
            
            const urlLower = url.toLowerCase();
            const isInvalidFile = invalidExtensions.some(ext => urlLower.endsWith(ext));
            
            // CORREÇÃO: Aceitar QUALQUER URL válida, exceto arquivos proibidos
            // Não filtrar por palavras específicas - deixar o Stremio decidir se funciona
            const isValidUrl = hasValidProtocol && !isInvalidFile;
            
            if (isValidUrl) {
              items.push({
                id: 'iptv_' + Buffer.from(url).toString('base64').slice(0, 32),
                name: name.replace(/🔴/g, '').trim(), // Remove emoji vermelho
                logo,
                group,
                url
              });
              i++; // Pular a próxima linha (URL)
            }
          }
        }
      }
    }

    cache = items;
    cacheTime = now;
    console.log(`✅ IPTV 0800: ${items.length} canais carregados com sucesso!`);
    return items;
    
  } catch (error) {
    console.error('❌ Erro ao carregar M3U:', error.message);
    
    // Se há cache anterior, usar como fallback
    if (cache && cache.length > 0) {
      console.log(`⚠️  Usando cache anterior (${cache.length} canais)`);
      return cache;
    }
    
    // Retornar lista vazia se não há cache
    console.log('📭 Retornando lista vazia devido ao erro');
    return [];
  }
}

builder.defineCatalogHandler(async ({ id }) => {
  try {
    const items = await loadM3U();
    const category = CATEGORIES.find(c => c.id === id);
    
    if (!category) {
      console.log(`⚠️  Categoria não encontrada: ${id}`);
      return { metas: [] };
    }
    
    const metas = items
      .filter(ch => {
        const groupLower = ch.group.toLowerCase();
        const nameLower = ch.name.toLowerCase();
        return category.keywords.some(keyword => 
          groupLower.includes(keyword.toLowerCase()) || 
          nameLower.includes(keyword.toLowerCase())
        );
      })
      .map(ch => ({
        id: ch.id,
        type: 'tv',
        name: ch.name,
        poster: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${ch.group}`,
        genres: ['IPTV'],
        releaseInfo: 'Ao Vivo'
      }));
      // CORREÇÃO: Removido limite de 100 canais - mostrar TODOS os canais encontrados
    
    console.log(`📺 Categoria ${category.name}: ${metas.length} canais`);
    return { metas };
    
  } catch (error) {
    console.error(`❌ Erro no catalog handler:`, error.message);
    return { metas: [] };
  }
});

builder.defineMetaHandler(async ({ id }) => {
  try {
    const items = await loadM3U();
    const ch = items.find(x => x.id === id);
    
    if (!ch) {
      throw new Error(`Canal não encontrado: ${id}`);
    }
    
    return {
      meta: {
        id: ch.id,
        type: 'tv',
        name: ch.name,
        poster: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        background: ch.logo || 'https://img.icons8.com/color/480/tv.png',
        description: `📺 ${ch.group}\n\n🇧🇷 Canal brasileiro disponível 24 horas por dia.\n\n⚡ Qualidade de transmissão ao vivo.`,
        genres: ['IPTV'],
        releaseInfo: 'Ao Vivo',
        website: 'https://github.com/Ally87sk'
      }
    };
  } catch (error) {
    console.error(`❌ Erro no meta handler:`, error.message);
    throw error;
  }
});

builder.defineStreamHandler(async ({ id }) => {
  try {
    const items = await loadM3U();
    const ch = items.find(x => x.id === id);
    
    if (!ch) {
      throw new Error(`Stream não encontrado: ${id}`);
    }
    
    console.log(`🎬 Stream solicitado: ${ch.name}`);
    
    return {
      streams: [
        {
          name: 'IPTV 0800',
          title: `📺 ${ch.name} - ${ch.group}`,
          url: ch.url,
          behaviorHints: {
            notWebReady: true,
            bingeGroup: `iptv-${ch.group.toLowerCase().replace(/\s+/g, '-')}`
          }
        }
      ]
    };
  } catch (error) {
    console.error(`❌ Erro no stream handler:`, error.message);
    throw error;
  }
});

const port = process.env.PORT || 7000;

// Inicialização do servidor
serveHTTP(builder.getInterface(), { port })
  .then(() => {
    console.log('🚀 ====================================');
    console.log('🇧🇷 IPTV 0800 Addon v1.0.0');
    console.log('🚀 ====================================');
    console.log(`📡 Servidor rodando na porta: ${port}`);
    console.log(`🌐 URL do Manifest: http://localhost:${port}/manifest.json`);
    console.log(`📺 Total de Categorias: ${CATEGORIES.length}`);
    console.log('✨ Addon pronto para uso no Stremio!');
    console.log('🚀 ====================================');
    
    // Pré-carregar os canais
    loadM3U()
      .then(() => console.log('✅ Cache inicial carregado com sucesso!'))
      .catch(err => console.error('⚠️  Aviso: Erro no carregamento inicial:', err.message));
  })
  .catch(err => {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  });

// Tratamento de erros não capturados
process.on('uncaughtException', (err) => {
  console.error('❌ Erro não capturado:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Promise rejeitada:', err);
});
