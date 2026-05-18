/**
 * NovaSeguros – Icon Generator
 * Genera favicon (icon.png) y app-icon.png con sharp + SVG inline
 * Ejecutar: node generate-icons.mjs
 */
import sharp from 'sharp';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/* ─────────────────────────── SHIELD SVG ─────────────────────────── */
// Viewbox 200×240 – escudo heráldico clásico con N dorada y swoosh
const SHIELD_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240" shape-rendering="geometricPrecision">
  <defs>
    <!-- Borde dorado exterior -->
    <linearGradient id="gBorder" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#F5E070"/>
      <stop offset="35%" stop-color="#D4A83C"/>
      <stop offset="70%" stop-color="#C9A84C"/>
      <stop offset="100%" stop-color="#7A5A12"/>
    </linearGradient>
    <!-- Fondo interior del escudo -->
    <radialGradient id="gNavy" cx="42%" cy="32%" r="72%">
      <stop offset="0%" stop-color="#1E304F"/>
      <stop offset="55%" stop-color="#0E1E3A"/>
      <stop offset="100%" stop-color="#060F20"/>
    </radialGradient>
    <!-- Letra N dorada -->
    <linearGradient id="gN" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8E068"/>
      <stop offset="40%" stop-color="#D4A838"/>
      <stop offset="100%" stop-color="#8A6018"/>
    </linearGradient>
    <!-- Slash plateado/brillante -->
    <linearGradient id="gSlash" x1="5%" y1="0%" x2="95%" y2="100%">
      <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.05"/>
      <stop offset="25%"  stop-color="#FFFFFF" stop-opacity="0.95"/>
      <stop offset="55%"  stop-color="#E8F2FF" stop-opacity="0.90"/>
      <stop offset="80%"  stop-color="#C0CDE0" stop-opacity="0.50"/>
      <stop offset="100%" stop-color="#8A9BB5" stop-opacity="0.05"/>
    </linearGradient>
    <!-- Swoosh dorado horizontal -->
    <linearGradient id="gSwoosh" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%"   stop-color="#C9A84C" stop-opacity="0.10"/>
      <stop offset="18%"  stop-color="#F5DC58" stop-opacity="0.95"/>
      <stop offset="50%"  stop-color="#D4A838" stop-opacity="1.00"/>
      <stop offset="82%"  stop-color="#F5DC58" stop-opacity="0.90"/>
      <stop offset="100%" stop-color="#C9A84C" stop-opacity="0.10"/>
    </linearGradient>
    <!-- Dorado lateral faceta -->
    <linearGradient id="gFacetR" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1A3055" stop-opacity="0"/>
      <stop offset="100%" stop-color="#2A4570" stop-opacity="0.4"/>
    </linearGradient>
  </defs>

  <!-- ════ ESCUDO EXTERIOR (borde dorado) ════ -->
  <path d="M100,7
           L188,36 L188,126
           Q188,196 100,230
           Q12,196 12,126
           L12,36 Z"
        fill="url(#gBorder)"/>

  <!-- Línea interior del borde (segundo reborde dorado) -->
  <path d="M100,14
           L181,41 L181,126
           Q181,189 100,222
           Q19,189 19,126
           L19,41 Z"
        fill="none" stroke="#E8C84A" stroke-width="1.2" opacity="0.55"/>

  <!-- ════ INTERIOR DEL ESCUDO (navy) ════ -->
  <path d="M100,19
           L176,44 L176,126
           Q176,184 100,215
           Q24,184 24,126
           L24,44 Z"
        fill="url(#gNavy)"/>

  <!-- Facetas geométricas para efecto 3D (paneles de cristal) -->
  <!-- Panel superior-izquierdo -->
  <path d="M100,19 L24,44 L55,95 L100,75 Z"
        fill="#FFFFFF" opacity="0.04"/>
  <!-- Panel superior-derecho -->
  <path d="M100,19 L176,44 L145,95 L100,75 Z"
        fill="#FFFFFF" opacity="0.07"/>
  <!-- Panel derecho -->
  <path d="M176,44 L145,95 L155,175 L176,126 Z"
        fill="url(#gFacetR)" opacity="1"/>
  <!-- Panel central inferior -->
  <path d="M55,95 L100,75 L145,95 L100,215 L55,155 Z"
        fill="#000010" opacity="0.12"/>

  <!-- ════ LETRA N ════ -->
  <!-- Eje izquierdo -->
  <rect x="60" y="60" width="20" height="102" rx="1.5"
        fill="url(#gN)"/>
  <!-- Diagonal (arriba-izquierda → abajo-derecha) -->
  <polygon points="60,60 80,60 136,162 116,162"
           fill="url(#gN)"/>
  <!-- Eje derecho -->
  <rect x="116" y="60" width="20" height="102" rx="1.5"
        fill="url(#gN)"/>

  <!-- Sombra sutil bajo el eje izquierdo (profundidad 3D) -->
  <rect x="60" y="60" width="20" height="102" rx="1.5"
        fill="#000000" opacity="0.18"/>
  <!-- Luz en el borde superior del eje izquierdo -->
  <rect x="60" y="60" width="20" height="8" rx="1.5"
        fill="#FFFFFF" opacity="0.12"/>

  <!-- ════ SLASH PLATEADO (destello diagonal) ════ -->
  <polygon points="72,74 94,61 150,150 128,163"
           fill="url(#gSlash)"/>

  <!-- ════ SWOOSH DORADO ════ -->
  <!-- Arco principal (grueso) -->
  <path d="M30,172 Q100,152 170,172"
        stroke="url(#gSwoosh)" stroke-width="6" fill="none"
        stroke-linecap="round"/>
  <!-- Arco secundario (más sutil) -->
  <path d="M40,180 Q100,162 160,180"
        stroke="url(#gSwoosh)" stroke-width="3.2" fill="none"
        stroke-linecap="round" opacity="0.45"/>
</svg>`;

/* ─────────────────────────── APP ICON SVG ─────────────────────────── */
// 512×512 – escudo sobre fondo navy profundo con glow azul
const APP_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" shape-rendering="geometricPrecision">
  <defs>
    <!-- Fondo rounded-square navy deep -->
    <linearGradient id="bgGrad" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#0B1628"/>
      <stop offset="100%" stop-color="#040A14"/>
    </linearGradient>
    <!-- Glow azul radial detrás del escudo -->
    <radialGradient id="blueGlow" cx="50%" cy="46%" r="45%">
      <stop offset="0%"   stop-color="#2060C0" stop-opacity="0.60"/>
      <stop offset="40%"  stop-color="#1040A0" stop-opacity="0.30"/>
      <stop offset="75%"  stop-color="#0820508" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#000000"  stop-opacity="0.00"/>
    </radialGradient>
    <!-- Borde dorado exterior escudo -->
    <linearGradient id="gBorder2" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%"   stop-color="#F8E870"/>
      <stop offset="35%"  stop-color="#D4A838"/>
      <stop offset="70%"  stop-color="#C9A84C"/>
      <stop offset="100%" stop-color="#7A5A12"/>
    </linearGradient>
    <!-- Navy interior -->
    <radialGradient id="gNavy2" cx="42%" cy="32%" r="72%">
      <stop offset="0%"   stop-color="#1E304F"/>
      <stop offset="55%"  stop-color="#0E1E3A"/>
      <stop offset="100%" stop-color="#060F20"/>
    </radialGradient>
    <!-- N dorada -->
    <linearGradient id="gN2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="#F8E068"/>
      <stop offset="40%"  stop-color="#D4A838"/>
      <stop offset="100%" stop-color="#8A6018"/>
    </linearGradient>
    <!-- Slash plateado -->
    <linearGradient id="gSlash2" x1="5%" y1="0%" x2="95%" y2="100%">
      <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.05"/>
      <stop offset="25%"  stop-color="#FFFFFF" stop-opacity="0.98"/>
      <stop offset="55%"  stop-color="#E8F2FF" stop-opacity="0.92"/>
      <stop offset="80%"  stop-color="#C0CDE0" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#8A9BB5" stop-opacity="0.05"/>
    </linearGradient>
    <!-- Swoosh -->
    <linearGradient id="gSwoosh2" x1="0%" y1="50%" x2="100%" y2="50%">
      <stop offset="0%"   stop-color="#C9A84C" stop-opacity="0.10"/>
      <stop offset="18%"  stop-color="#F8E060" stop-opacity="0.98"/>
      <stop offset="50%"  stop-color="#D4A838" stop-opacity="1.00"/>
      <stop offset="82%"  stop-color="#F8E060" stop-opacity="0.92"/>
      <stop offset="100%" stop-color="#C9A84C" stop-opacity="0.10"/>
    </linearGradient>
    <!-- Faceta derecha -->
    <linearGradient id="gFacetR2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1A3055" stop-opacity="0"/>
      <stop offset="100%" stop-color="#2A4570" stop-opacity="0.4"/>
    </linearGradient>
    <!-- Sombra suave debajo del escudo (profundidad) -->
    <filter id="shieldShadow" x="-12%" y="-8%" width="124%" height="124%">
      <feDropShadow dx="0" dy="8" stdDeviation="18" flood-color="#000820" flood-opacity="0.7"/>
    </filter>
  </defs>

  <!-- ── Fondo rounded-square ── -->
  <rect x="0" y="0" width="512" height="512" rx="115" ry="115"
        fill="url(#bgGrad)"/>

  <!-- ── Glow azul de fondo ── -->
  <ellipse cx="256" cy="236" rx="230" ry="240"
           fill="url(#blueGlow)"/>

  <!-- ── Punto de luz brillante superior (halo) ── -->
  <radialGradient id="topLight" cx="50%" cy="25%" r="35%">
    <stop offset="0%" stop-color="#6090F0" stop-opacity="0.25"/>
    <stop offset="100%" stop-color="#6090F0" stop-opacity="0"/>
  </radialGradient>
  <ellipse cx="256" cy="130" rx="180" ry="120"
           fill="url(#topLight)"/>

  <!-- ── ESCUDO (escalado 2.27× desde viewbox 200×240, centrado en 512×512) ── -->
  <!-- translate(57, 18) scale(1.99) para que el escudo mida ~398×478, centrado -->
  <g transform="translate(57 18) scale(1.99)" filter="url(#shieldShadow)">

    <!-- Borde exterior (dorado) -->
    <path d="M100,7 L188,36 L188,126 Q188,196 100,230 Q12,196 12,126 L12,36 Z"
          fill="url(#gBorder2)"/>
    <!-- Segunda línea del borde -->
    <path d="M100,14 L181,41 L181,126 Q181,189 100,222 Q19,189 19,126 L19,41 Z"
          fill="none" stroke="#E8C84A" stroke-width="1.2" opacity="0.55"/>
    <!-- Interior navy -->
    <path d="M100,19 L176,44 L176,126 Q176,184 100,215 Q24,184 24,126 L24,44 Z"
          fill="url(#gNavy2)"/>

    <!-- Facetas -->
    <path d="M100,19 L24,44 L55,95 L100,75 Z"  fill="#FFFFFF" opacity="0.04"/>
    <path d="M100,19 L176,44 L145,95 L100,75 Z" fill="#FFFFFF" opacity="0.08"/>
    <path d="M176,44 L145,95 L155,175 L176,126 Z" fill="url(#gFacetR2)"/>
    <path d="M55,95 L100,75 L145,95 L100,215 L55,155 Z" fill="#000010" opacity="0.12"/>

    <!-- N: eje izquierdo -->
    <rect x="60" y="60" width="20" height="102" rx="1.5" fill="url(#gN2)"/>
    <!-- N: diagonal -->
    <polygon points="60,60 80,60 136,162 116,162" fill="url(#gN2)"/>
    <!-- N: eje derecho -->
    <rect x="116" y="60" width="20" height="102" rx="1.5" fill="url(#gN2)"/>
    <!-- Sombra 3D eje izquierdo -->
    <rect x="60" y="60" width="20" height="102" rx="1.5" fill="#000000" opacity="0.18"/>
    <rect x="60" y="60" width="20" height="8" rx="1.5"   fill="#FFFFFF" opacity="0.12"/>

    <!-- Slash plateado -->
    <polygon points="72,74 94,61 150,150 128,163" fill="url(#gSlash2)"/>

    <!-- Swoosh dorado -->
    <path d="M30,172 Q100,152 170,172"
          stroke="url(#gSwoosh2)" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M40,180 Q100,162 160,180"
          stroke="url(#gSwoosh2)" stroke-width="3.2" fill="none"
          stroke-linecap="round" opacity="0.45"/>
  </g>
</svg>`;

/* ─────────────────────────── GENERAR PNGs ─────────────────────────── */
async function generate() {
  const shieldBuf  = Buffer.from(SHIELD_SVG);
  const appIconBuf = Buffer.from(APP_ICON_SVG);

  // 1. src/app/icon.png  → favicon (Next.js App Router lo usa como /favicon)
  //    512×512 para que funcione bien en todas las densidades
  await sharp(shieldBuf)
    .resize(512, 512, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(__dirname, 'src/app/icon.png'));
  console.log('✓ src/app/icon.png  (512×512, fondo transparente)');

  // 2. src/app/apple-icon.png → Apple touch icon (180×180)
  await sharp(appIconBuf)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(__dirname, 'src/app/apple-icon.png'));
  console.log('✓ src/app/apple-icon.png  (180×180)');

  // 3. public/app-icon.png → App icon completo 1024×1024
  await sharp(appIconBuf)
    .resize(1024, 1024, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(__dirname, 'public/app-icon.png'));
  console.log('✓ public/app-icon.png  (1024×1024, con fondo navy+glow)');

  // 4. public/app-icon-512.png → App icon 512×512 (PWA manifest)
  await sharp(appIconBuf)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 })
    .toFile(join(__dirname, 'public/app-icon-512.png'));
  console.log('✓ public/app-icon-512.png  (512×512)');

  // 5. src/app/favicon.ico → ICO real (header ICO + datos PNG 32×32)
  const favicon32Buf = await sharp(shieldBuf)
    .resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } })
    .png()
    .toBuffer();

  // Construir contenedor ICO (ICONDIR + ICONDIRENTRY + datos PNG)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0);  // reserved
  icoHeader.writeUInt16LE(1, 2);  // type = 1 (ICO)
  icoHeader.writeUInt16LE(1, 4);  // count = 1 imagen

  const icoDirEntry = Buffer.alloc(16);
  icoDirEntry.writeUInt8(32, 0);              // width  = 32
  icoDirEntry.writeUInt8(32, 1);              // height = 32
  icoDirEntry.writeUInt8(0, 2);               // color count (0 = sin paleta)
  icoDirEntry.writeUInt8(0, 3);               // reserved
  icoDirEntry.writeUInt16LE(1, 4);            // planes = 1
  icoDirEntry.writeUInt16LE(32, 6);           // bits per pixel = 32
  icoDirEntry.writeUInt32LE(favicon32Buf.length, 8);  // tamaño datos
  icoDirEntry.writeUInt32LE(22, 12);          // offset datos = 6 + 16

  const icoFile = Buffer.concat([icoHeader, icoDirEntry, favicon32Buf]);
  writeFileSync(join(__dirname, 'src/app/favicon.ico'), icoFile);
  console.log('✓ src/app/favicon.ico   (ICO 32×32 con datos PNG)');

  // 6. public/favicon.ico → mismo ICO también en public/
  writeFileSync(join(__dirname, 'public/favicon.ico'), icoFile);
  console.log('✓ public/favicon.ico    (copia en public/)');

  console.log('\n✅ Todos los iconos generados.');
}

generate().catch(err => { console.error(err); process.exit(1); });
