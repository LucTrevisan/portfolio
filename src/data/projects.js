/**
 * XR LAB — fonte única de dados do catálogo.
 *
 * Para adicionar uma experiência, acrescente um objeto em `projects`:
 *   1. imagem    → coloque o arquivo em /assets/projects/ (16:9, WebP).
 *                  Opcional: uma versão menor "<nome>-480.webp" em `imageSmall`.
 *                  Sem imagem? Use `image: null` — o card mostra um placeholder.
 *   2. title     → nome exibido.
 *   3. description
 *   4. url       → endereço público da aplicação (https).
 *   5. categories → chaves de `categories` abaixo (ex.: "vr", "ar", "webxr").
 *
 * Nenhuma outra alteração é necessária: linhas do catálogo, filtros, busca e
 * badges são gerados automaticamente a partir destes dados.
 *
 * Regra editorial: descreva apenas o que a aplicação realmente faz.
 */

/** Taxonomia. A ordem define a ordem das linhas do catálogo. */
export const categories = {
  'digital-twin': { label: 'Digital Twin', badge: 'DT', row: 'Digital Twins', aliases: ['gêmeo digital', 'digital twins', 'twin'] },
  vr: { label: 'Realidade Virtual', badge: 'VR', row: 'Realidade Virtual', aliases: ['vr', 'rv', 'virtual'] },
  ar: { label: 'Realidade Aumentada', badge: 'AR', row: 'Realidade Aumentada', aliases: ['ar', 'ra', 'aumentada'] },
  webxr: { label: 'WebXR', badge: 'WEBXR', row: 'WebXR', aliases: ['xr', 'web xr'] },
  iot: { label: 'IoT', badge: 'IoT', row: 'IoT & Monitoramento', aliases: ['internet das coisas', 'monitoramento', 'sensores', 'telemetria'] },
};

/** Chips de filtro. `category` filtra por categoria; `technology` por tecnologia. */
export const filters = [
  { id: 'vr', label: 'VR', category: 'vr' },
  { id: 'ar', label: 'AR', category: 'ar' },
  { id: 'webxr', label: 'WebXR', category: 'webxr' },
  { id: 'digital-twin', label: 'Digital Twin', category: 'digital-twin' },
  { id: 'iot', label: 'IoT', category: 'iot' },
  { id: 'babylon', label: 'Babylon.js', technology: 'Babylon.js' },
];

/** Configuração geral do portal. */
export const site = {
  name: 'XR LAB',
  tagline: 'Experiências Imersivas',
  hero: {
    projectId: 'atlas', // projeto usado como imagem de destaque do Hero
    image: 'assets/hero/atlas.webp',
    imageSmall: 'assets/hero/atlas-720.webp',
  },
};

export const projects = [
  {
    id: 'atlas',
    title: 'ATLAS',
    subtitle: 'Gêmeo digital de braço robótico',
    description:
      'Gêmeo digital de um braço robótico em Babylon.js, com WebXR (hand tracking), comunicação MQTT e ESP32.',
    image: 'assets/projects/atlas.webp',
    imageSmall: 'assets/projects/atlas-480.webp',
    url: 'https://luctrevisan.github.io/atlas/',
    categories: ['digital-twin', 'vr', 'webxr', 'iot'],
    technologies: ['Babylon.js', 'WebXR', 'MQTT', 'ESP32'],
    tags: ['robótica', 'braço robótico', 'hand tracking', 'telemetria'],
    features: [
      'Controle das articulações: base, ombro, cotovelo, punho e garra',
      'Demonstração guiada em 6 etapas',
      'Telemetria e envio de comandos via MQTT para ESP32',
      'Controle do braço por rastreamento de mãos em VR',
      'Botão de parada de emergência',
    ],
    featured: true,
  },
  {
    id: 'furadeira',
    title: 'Furadeira XR',
    subtitle: 'Simulador de furadeira manual',
    description:
      'Simulador interativo WebXR de furadeira manual para treinamento industrial: transmissão por engrenagens, mandril e acionamento manual.',
    image: 'assets/projects/furadeira.webp',
    imageSmall: 'assets/projects/furadeira-480.webp',
    url: 'https://luctrevisan.github.io/furadeira/',
    categories: ['vr', 'webxr', 'iot', 'digital-twin'],
    technologies: ['Babylon.js', 'WebXR', 'ESP32', 'MQTT', 'WebSocket'],
    tags: ['treinamento', 'treinamento industrial', 'engrenagens', 'mandril'],
    features: [
      'Controle de rotação (0 a 3000 RPM), sentido e liga/desliga',
      'Vista explodida dos componentes',
      'Identificação de peças com nome, função e descrição',
      'Treinamento guiado em 5 etapas',
      'Conexão com ESP32 e sensores via MQTT ou WebSocket',
    ],
    compatibility: ['Desktop', 'Tablet', 'Meta Quest'],
    featured: true,
  },
  {
    id: 'assistente',
    title: 'Assistente',
    subtitle: 'ROMI D1250 XR',
    description:
      'Simulador de montagem e vista explodida do centro de usinagem CNC ROMI D1250, com modos de Realidade Virtual e Realidade Aumentada.',
    image: 'assets/projects/assistente.webp',
    imageSmall: 'assets/projects/assistente-480.webp',
    url: 'https://luctrevisan.github.io/assistente/',
    categories: ['vr', 'ar', 'webxr'],
    technologies: ['Babylon.js', 'WebXR'],
    tags: ['CNC', 'usinagem', 'centro de usinagem', 'montagem', 'mecatrônica'],
    features: [
      'Modos Livre e Explodido',
      'Controle do fator de explosão',
      'Acesso ao Manual do Operador',
      'Modo RV e Modo RA',
    ],
    featured: true,
  },
  {
    id: 'demo-one',
    title: 'Demo One',
    subtitle: 'Recursos do Babylon.js em RA/RV',
    description:
      'Demonstração de recursos do Babylon.js em Realidade Aumentada e Realidade Virtual, com modo de demonstração.',
    image: 'assets/projects/demo-one.webp',
    imageSmall: 'assets/projects/demo-one-480.webp',
    url: 'https://luctrevisan.github.io/demo_one/',
    categories: ['vr', 'ar', 'webxr'],
    technologies: ['Babylon.js', 'WebXR'],
    tags: ['demonstração', 'física', 'modelo 3D'],
    features: [
      'Entrada em RV e em RA',
      'Modo Demonstração',
      'Recursos navegáveis, como Modelo 3D, Física e Câmera',
    ],
  },
  {
    id: 'morsa-xr',
    title: 'Morsa XR',
    subtitle: 'Simulador de montagem de morsa',
    description:
      'Simulador de montagem de uma morsa com 15 componentes identificáveis, em modos livre, guiado e explodido, com suporte a VR.',
    image: 'assets/projects/morsa-xr.webp',
    imageSmall: 'assets/projects/morsa-xr-480.webp',
    url: 'https://luctrevisan.github.io/morsaxr/',
    categories: ['vr', 'webxr'],
    technologies: ['Babylon.js', 'WebXR'],
    tags: ['montagem', 'morsa', 'mecatrônica', 'componentes'],
    features: [
      'Modos Livre, Guiado e Explodido',
      'Ficha de cada peça: função, material, norma, torque, ferramenta e manutenção',
      'Contador de peças identificadas (15 componentes)',
      'Entrada em VR',
    ],
  },
  {
    id: 'moenda',
    title: 'Moenda XR',
    subtitle: 'Simulador de montagem de moenda',
    description:
      'Simulador de montagem de uma moenda, com identificação de peças, modos livre, guiado e explodido, em Realidade Virtual e Aumentada.',
    image: 'assets/projects/moenda.webp',
    imageSmall: 'assets/projects/moenda-480.webp',
    url: 'https://moenda.netlify.app/',
    categories: ['vr', 'ar', 'webxr'],
    technologies: ['Babylon.js', 'WebXR'],
    tags: ['montagem', 'moenda', 'mecatrônica', 'mancal', 'rolamento'],
    features: [
      'Modos Livre, Guiado (passo a passo) e Explodido',
      'Lista de peças identificadas',
      'Acesso ao desenho de montagem',
      'Entrada em RV e em RA',
    ],
  },
  {
    id: 'bomba-ra',
    title: 'Bomba RA',
    subtitle: 'Simulador de montagem de bomba',
    description:
      'Simulador de montagem de um conjunto de bomba com motor elétrico, com identificação de peças, modos livre, guiado e explodido, em RV e RA.',
    image: 'assets/projects/bomba-ra.webp',
    imageSmall: 'assets/projects/bomba-ra-480.webp',
    url: 'https://luctrevisan.github.io/bomba-ra/',
    categories: ['ar', 'vr', 'webxr'],
    technologies: ['Babylon.js', 'WebXR'],
    tags: ['montagem', 'bomba', 'motor elétrico', 'rotor', 'mecatrônica'],
    features: [
      'Modos Livre, Guiado (passo a passo) e Explodido',
      'Lista de peças identificadas',
      'Acesso ao desenho de montagem',
      'Entrada em RV e em RA',
    ],
    featured: true,
  },
  {
    id: 'mecmonitor',
    title: 'MecMonitor',
    subtitle: 'Digital twin · Manutenção preditiva',
    description:
      'Gêmeo digital da bomba centrífuga P-01 para manutenção preditiva, com telemetria de sensores via ESP32 e indicador de saúde do equipamento.',
    image: 'assets/projects/mecmonitor.webp',
    imageSmall: 'assets/projects/mecmonitor-480.webp',
    url: 'https://luctrevisan.github.io/mecmonitor/',
    categories: ['digital-twin', 'iot', 'vr', 'webxr'],
    technologies: ['Babylon.js', 'WebXR', 'ESP32', 'MQTT'],
    tags: ['manutenção preditiva', 'bomba centrífuga', 'sensores', 'telemetria', 'monitoramento'],
    features: [
      'Saúde do equipamento com limites normal, alerta e crítico',
      'Telemetria e histórico dos sensores',
      'Visualizações Normal, Sensores, Raio-X, Térmico e Câmera',
      'Entrada em VR',
    ],
    featured: true,
  },
  {
    id: 'kit-iot',
    title: 'Kit IoT',
    subtitle: 'Laboratório virtual do ESP32-C3 Mini',
    description:
      'Laboratório virtual 3D/WebXR do Kit IoT ESP32-C3 Mini: módulos, mapa de GPIOs e código de exemplo para Arduino IDE.',
    image: 'assets/projects/kit-iot.webp',
    imageSmall: 'assets/projects/kit-iot-480.webp',
    url: 'https://luctrevisan.github.io/kit_iot/',
    categories: ['iot', 'vr', 'ar', 'webxr'],
    technologies: ['Babylon.js', 'WebXR', 'ESP32'],
    tags: ['ESP32-C3', 'GPIO', 'Arduino', 'kit didático', 'Indústria 4.0', 'mecatrônica'],
    features: [
      '9 módulos com descrição técnica',
      'Mapa de 11 GPIOs',
      'Código de exemplo para Arduino IDE',
      'Vista explodida e tampa aberta/fechada',
    ],
    compatibility: [
      'Desktop, celular e tablet',
      'VR: Meta Quest (navegador do Quest)',
      'AR: Chrome no Android com ARCore ou Meta Quest 3/3S',
      'iPhone/iPad: sem WebXR no Safari',
    ],
  },
  {
    id: 'torno-cnc',
    title: 'Torno CNC XR',
    subtitle: 'Simulador de montagem e explosão',
    description:
      'Simulador de montagem e vista explodida de um torno CNC, com modos de Realidade Virtual e Realidade Aumentada.',
    image: null, // sem prévia por enquanto: o card exibe o placeholder
    url: 'https://luctrevisan.github.io/centur/',
    categories: ['vr', 'ar', 'webxr'],
    technologies: ['Babylon.js', 'WebXR'],
    tags: ['CNC', 'torno', 'usinagem', 'montagem', 'mecatrônica'],
    features: ['Modos Livre e Explodido', 'Controle do fator de explosão', 'Acesso ao Manual do Operador', 'Modo RV e Modo RA'],
  },
];
