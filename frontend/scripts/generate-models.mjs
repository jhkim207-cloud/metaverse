/**
 * generate-models.mjs
 *
 * 순수 glTF 2.0 스펙으로 저폴리 3D 모델(.glb)을 절차적 생성합니다.
 * Three.js GLTFExporter는 Node에서 동작하지 않으므로 직접 바이너리를 작성합니다.
 *
 * 실행: node scripts/generate-models.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const MODELS_DIR = join(__dirname, '..', 'public', 'models');

function ensureDir(dir) { mkdirSync(dir, { recursive: true }); }

// ─── glTF Binary Builder ───

function buildGLB(meshes) {
  // meshes: Array<{ name, positions: Float32Array, indices: Uint16Array, color: [r,g,b], emissive?: [r,g,b], emissiveIntensity?: number, translation?: [x,y,z] }>

  const nodes = [];
  const meshDefs = [];
  const accessors = [];
  const bufferViews = [];
  const materials = [];
  const binChunks = [];
  let byteOffset = 0;

  for (let i = 0; i < meshes.length; i++) {
    const m = meshes[i];

    // Material
    const matIdx = materials.length;
    const mat = {
      pbrMetallicRoughness: {
        baseColorFactor: [...m.color, 1.0],
        metallicFactor: 0.1,
        roughnessFactor: 0.6,
      },
      name: `mat_${i}`,
    };
    if (m.emissive) {
      mat.emissiveFactor = m.emissive;
    }
    if (m.transparent) {
      mat.alphaMode = 'BLEND';
      mat.pbrMetallicRoughness.baseColorFactor[3] = m.opacity ?? 0.5;
    }
    materials.push(mat);

    // Positions buffer view
    const posBuf = Buffer.from(m.positions.buffer);
    const posViewIdx = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset, byteLength: posBuf.byteLength });
    binChunks.push(posBuf);
    byteOffset += posBuf.byteLength;
    // Align to 4 bytes
    const posPad = (4 - (byteOffset % 4)) % 4;
    if (posPad > 0) { binChunks.push(Buffer.alloc(posPad)); byteOffset += posPad; }

    // Indices buffer view
    const idxBuf = Buffer.from(m.indices.buffer);
    const idxViewIdx = bufferViews.length;
    bufferViews.push({ buffer: 0, byteOffset, byteLength: idxBuf.byteLength });
    binChunks.push(idxBuf);
    byteOffset += idxBuf.byteLength;
    const idxPad = (4 - (byteOffset % 4)) % 4;
    if (idxPad > 0) { binChunks.push(Buffer.alloc(idxPad)); byteOffset += idxPad; }

    // Position accessor - compute min/max
    const posCount = m.positions.length / 3;
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let j = 0; j < posCount; j++) {
      const x = m.positions[j * 3], y = m.positions[j * 3 + 1], z = m.positions[j * 3 + 2];
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }

    const posAccIdx = accessors.length;
    accessors.push({
      bufferView: posViewIdx,
      componentType: 5126, // FLOAT
      count: posCount,
      type: 'VEC3',
      max: [maxX, maxY, maxZ],
      min: [minX, minY, minZ],
    });

    const idxAccIdx = accessors.length;
    accessors.push({
      bufferView: idxViewIdx,
      componentType: 5123, // UNSIGNED_SHORT
      count: m.indices.length,
      type: 'SCALAR',
    });

    // Mesh
    const meshIdx = meshDefs.length;
    meshDefs.push({
      name: m.name,
      primitives: [{
        attributes: { POSITION: posAccIdx },
        indices: idxAccIdx,
        material: matIdx,
      }],
    });

    // Node
    const node = { mesh: meshIdx, name: m.name };
    if (m.translation) node.translation = m.translation;
    if (m.rotation) node.rotation = m.rotation;
    if (m.scale) node.scale = m.scale;
    nodes.push(node);
  }

  const binBuffer = Buffer.concat(binChunks);

  const gltf = {
    asset: { version: '2.0', generator: 'metaverse-model-gen' },
    scene: 0,
    scenes: [{ nodes: nodes.map((_, i) => i) }],
    nodes,
    meshes: meshDefs,
    accessors,
    bufferViews,
    buffers: [{ byteLength: binBuffer.byteLength }],
    materials,
  };

  const jsonStr = JSON.stringify(gltf);
  const jsonBuf = Buffer.from(jsonStr, 'utf8');
  // Pad JSON to 4-byte alignment
  const jsonPad = (4 - (jsonBuf.byteLength % 4)) % 4;
  const paddedJsonBuf = Buffer.concat([jsonBuf, Buffer.alloc(jsonPad, 0x20)]); // pad with spaces

  // Pad bin to 4-byte alignment
  const binPad = (4 - (binBuffer.byteLength % 4)) % 4;
  const paddedBinBuf = Buffer.concat([binBuffer, Buffer.alloc(binPad, 0)]);

  // GLB header (12 bytes)
  const totalLength = 12 + 8 + paddedJsonBuf.byteLength + 8 + paddedBinBuf.byteLength;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546C67, 0); // magic "glTF"
  header.writeUInt32LE(2, 4);           // version
  header.writeUInt32LE(totalLength, 8);  // total length

  // JSON chunk header (8 bytes)
  const jsonChunkHeader = Buffer.alloc(8);
  jsonChunkHeader.writeUInt32LE(paddedJsonBuf.byteLength, 0);
  jsonChunkHeader.writeUInt32LE(0x4E4F534A, 4); // "JSON"

  // BIN chunk header (8 bytes)
  const binChunkHeader = Buffer.alloc(8);
  binChunkHeader.writeUInt32LE(paddedBinBuf.byteLength, 0);
  binChunkHeader.writeUInt32LE(0x004E4942, 4); // "BIN\0"

  return Buffer.concat([header, jsonChunkHeader, paddedJsonBuf, binChunkHeader, paddedBinBuf]);
}

// ─── Geometry Helpers ───

function box(w, h, d, tx = 0, ty = 0, tz = 0) {
  const hw = w / 2, hh = h / 2, hd = d / 2;
  // 8 vertices of a box
  const positions = new Float32Array([
    -hw + tx, -hh + ty, -hd + tz,   hw + tx, -hh + ty, -hd + tz,   hw + tx,  hh + ty, -hd + tz,  -hw + tx,  hh + ty, -hd + tz,  // back
    -hw + tx, -hh + ty,  hd + tz,   hw + tx, -hh + ty,  hd + tz,   hw + tx,  hh + ty,  hd + tz,  -hw + tx,  hh + ty,  hd + tz,  // front
  ]);
  const indices = new Uint16Array([
    0, 1, 2, 0, 2, 3, // back
    4, 6, 5, 4, 7, 6, // front
    0, 4, 5, 0, 5, 1, // bottom
    2, 6, 7, 2, 7, 3, // top
    0, 3, 7, 0, 7, 4, // left
    1, 5, 6, 1, 6, 2, // right
  ]);
  return { positions, indices };
}

function cylinder(rTop, rBot, h, segments, tx = 0, ty = 0, tz = 0) {
  const positions = [];
  const indices = [];
  const n = segments;

  // Top center, bottom center
  positions.push(tx, ty + h / 2, tz); // 0: top center
  positions.push(tx, ty - h / 2, tz); // 1: bottom center

  for (let i = 0; i <= n; i++) {
    const a = (i / n) * Math.PI * 2;
    const cos = Math.cos(a), sin = Math.sin(a);
    positions.push(tx + rTop * cos, ty + h / 2, tz + rTop * sin); // top ring: 2 + i
    positions.push(tx + rBot * cos, ty - h / 2, tz + rBot * sin); // bot ring: 2 + n+1 + i
  }

  const topStart = 2;
  const botStart = 2 + n + 1;

  for (let i = 0; i < n; i++) {
    // Top face
    indices.push(0, topStart + i, topStart + i + 1);
    // Bottom face
    indices.push(1, botStart + i + 1, botStart + i);
    // Side
    indices.push(topStart + i, botStart + i, botStart + i + 1);
    indices.push(topStart + i, botStart + i + 1, topStart + i + 1);
  }

  return { positions: new Float32Array(positions), indices: new Uint16Array(indices) };
}

function sphere(r, wSeg, hSeg, tx = 0, ty = 0, tz = 0) {
  const positions = [];
  const indices = [];

  for (let y = 0; y <= hSeg; y++) {
    const v = y / hSeg;
    const phi = v * Math.PI;
    for (let x = 0; x <= wSeg; x++) {
      const u = x / wSeg;
      const theta = u * Math.PI * 2;
      positions.push(
        tx + r * Math.sin(phi) * Math.cos(theta),
        ty + r * Math.cos(phi),
        tz + r * Math.sin(phi) * Math.sin(theta)
      );
    }
  }

  for (let y = 0; y < hSeg; y++) {
    for (let x = 0; x < wSeg; x++) {
      const a = y * (wSeg + 1) + x;
      const b = a + wSeg + 1;
      indices.push(a, b, a + 1);
      indices.push(b, b + 1, a + 1);
    }
  }

  return { positions: new Float32Array(positions), indices: new Uint16Array(indices) };
}

function hexColor(hex) {
  const r = ((hex >> 16) & 0xff) / 255;
  const g = ((hex >> 8) & 0xff) / 255;
  const b = (hex & 0xff) / 255;
  return [r, g, b];
}

// ─── Model Builders ───

function forkliftParts() {
  return [
    { name: 'body', ...box(1.0, 0.4, 1.6, 0, 0.5, 0), color: hexColor(0xff8c00) },
    { name: 'cabin', ...box(0.9, 0.6, 0.8, 0, 0.9, 0.3), color: hexColor(0x333333) },
    { name: 'roof', ...box(1.0, 0.06, 1.0, 0, 1.23, 0.3), color: hexColor(0xff8c00) },
    { name: 'mastL', ...box(0.06, 1.4, 0.06, -0.3, 0.9, -0.85), color: hexColor(0x555555) },
    { name: 'mastR', ...box(0.06, 1.4, 0.06, 0.3, 0.9, -0.85), color: hexColor(0x555555) },
    { name: 'forkL', ...box(0.12, 0.04, 0.8, -0.2, 0.22, -1.15), color: hexColor(0x888888) },
    { name: 'forkR', ...box(0.12, 0.04, 0.8, 0.2, 0.22, -1.15), color: hexColor(0x888888) },
    { name: 'cw', ...box(0.9, 0.35, 0.3, 0, 0.48, 0.75), color: hexColor(0x444444) },
    { name: 'wheelFL', ...cylinder(0.18, 0.18, 0.12, 10, -0.45, 0.18, 0.55), color: hexColor(0x222222) },
    { name: 'wheelFR', ...cylinder(0.18, 0.18, 0.12, 10, 0.45, 0.18, 0.55), color: hexColor(0x222222) },
    { name: 'wheelBL', ...cylinder(0.18, 0.18, 0.12, 10, -0.45, 0.18, -0.45), color: hexColor(0x222222) },
    { name: 'wheelBR', ...cylinder(0.18, 0.18, 0.12, 10, 0.45, 0.18, -0.45), color: hexColor(0x222222) },
    { name: 'hlL', ...sphere(0.05, 6, 6, -0.35, 0.55, -0.82), color: hexColor(0xffff00), emissive: hexColor(0xffff00) },
    { name: 'hlR', ...sphere(0.05, 6, 6, 0.35, 0.55, -0.82), color: hexColor(0xffff00), emissive: hexColor(0xffff00) },
  ];
}

function truckParts() {
  return [
    { name: 'cabin', ...box(1.2, 0.9, 1.0, 0, 0.75, 1.0), color: hexColor(0x2266cc) },
    { name: 'windshield', ...box(1.0, 0.45, 0.04, 0, 0.9, 0.48), color: hexColor(0x88ccff), transparent: true, opacity: 0.5 },
    { name: 'cargo', ...box(1.3, 0.8, 2.2, 0, 0.7, -0.65), color: hexColor(0xcccccc) },
    { name: 'frame', ...box(1.1, 0.15, 3.5, 0, 0.22, 0.1), color: hexColor(0x333333) },
    { name: 'wFL', ...cylinder(0.22, 0.22, 0.15, 10, -0.6, 0.22, 1.1), color: hexColor(0x1a1a1a) },
    { name: 'wFR', ...cylinder(0.22, 0.22, 0.15, 10, 0.6, 0.22, 1.1), color: hexColor(0x1a1a1a) },
    { name: 'wBL1', ...cylinder(0.22, 0.22, 0.15, 10, -0.6, 0.22, -0.8), color: hexColor(0x1a1a1a) },
    { name: 'wBR1', ...cylinder(0.22, 0.22, 0.15, 10, 0.6, 0.22, -0.8), color: hexColor(0x1a1a1a) },
    { name: 'wBL2', ...cylinder(0.22, 0.22, 0.15, 10, -0.6, 0.22, -1.2), color: hexColor(0x1a1a1a) },
    { name: 'wBR2', ...cylinder(0.22, 0.22, 0.15, 10, 0.6, 0.22, -1.2), color: hexColor(0x1a1a1a) },
    { name: 'hlL', ...sphere(0.06, 6, 6, -0.45, 0.6, 0.48), color: hexColor(0xffffcc), emissive: hexColor(0xffffcc) },
    { name: 'hlR', ...sphere(0.06, 6, 6, 0.45, 0.6, 0.48), color: hexColor(0xffffcc), emissive: hexColor(0xffffcc) },
    { name: 'tlL', ...box(0.08, 0.08, 0.02, -0.55, 0.5, -1.76), color: hexColor(0xff2200), emissive: hexColor(0xff2200) },
    { name: 'tlR', ...box(0.08, 0.08, 0.02, 0.55, 0.5, -1.76), color: hexColor(0xff2200), emissive: hexColor(0xff2200) },
  ];
}

function cctvParts() {
  return [
    { name: 'pole', ...cylinder(0.04, 0.06, 2.0, 8, 0, 1.0, 0), color: hexColor(0x666666) },
    { name: 'base', ...cylinder(0.12, 0.12, 0.04, 10, 0, 0.02, 0), color: hexColor(0x555555) },
    { name: 'housing', ...cylinder(0.12, 0.12, 0.3, 10, 0, 2.05, -0.1), color: hexColor(0xeeeeee) },
    { name: 'lens', ...sphere(0.08, 8, 8, 0, 2.05, -0.27), color: hexColor(0x111111) },
    { name: 'bracket', ...box(0.04, 0.04, 0.2, 0, 2.05, -0.05), color: hexColor(0x888888) },
    { name: 'led', ...sphere(0.02, 6, 6, 0.1, 2.12, -0.1), color: hexColor(0x00ff00), emissive: hexColor(0x00ff00) },
  ];
}

function workerParts() {
  return [
    { name: 'head', ...sphere(0.15, 8, 8, 0, 1.65, 0), color: hexColor(0xf5c6a5) },
    { name: 'helmet', ...sphere(0.17, 8, 4, 0, 1.72, 0), color: hexColor(0xffcc00) },
    { name: 'brim', ...cylinder(0.2, 0.2, 0.02, 10, 0, 1.68, 0), color: hexColor(0xffcc00) },
    { name: 'torso', ...box(0.35, 0.45, 0.2, 0, 1.28, 0), color: hexColor(0xff6600) },
    { name: 'stripe1', ...box(0.36, 0.03, 0.21, 0, 1.35, 0), color: hexColor(0xcccccc), emissive: hexColor(0xcccccc) },
    { name: 'stripe2', ...box(0.36, 0.03, 0.21, 0, 1.2, 0), color: hexColor(0xcccccc), emissive: hexColor(0xcccccc) },
    { name: 'armL', ...box(0.1, 0.4, 0.1, -0.25, 1.25, 0), color: hexColor(0xff6600) },
    { name: 'armR', ...box(0.1, 0.4, 0.1, 0.25, 1.25, 0), color: hexColor(0xff6600) },
    { name: 'handL', ...sphere(0.05, 6, 6, -0.25, 1.02, 0), color: hexColor(0xf5c6a5) },
    { name: 'handR', ...sphere(0.05, 6, 6, 0.25, 1.02, 0), color: hexColor(0xf5c6a5) },
    { name: 'legL', ...box(0.14, 0.45, 0.14, -0.1, 0.78, 0), color: hexColor(0x334455) },
    { name: 'legR', ...box(0.14, 0.45, 0.14, 0.1, 0.78, 0), color: hexColor(0x334455) },
    { name: 'bootL', ...box(0.14, 0.12, 0.2, -0.1, 0.5, 0.02), color: hexColor(0x3a2a1a) },
    { name: 'bootR', ...box(0.14, 0.12, 0.2, 0.1, 0.5, 0.02), color: hexColor(0x3a2a1a) },
    { name: 'eyeL', ...sphere(0.025, 6, 6, -0.05, 1.67, -0.13), color: hexColor(0x222222) },
    { name: 'eyeR', ...sphere(0.025, 6, 6, 0.05, 1.67, -0.13), color: hexColor(0x222222) },
  ];
}

// ─── Main ───

console.log('\n🏭 3D 모델(.glb) 생성 시작...\n');

const models = [
  { parts: forkliftParts, path: 'vehicles/forklift.glb' },
  { parts: truckParts, path: 'vehicles/truck.glb' },
  { parts: cctvParts, path: 'environment/cctv.glb' },
  { parts: workerParts, path: 'characters/worker.glb' },
];

for (const { parts, path } of models) {
  const fullPath = join(MODELS_DIR, path);
  ensureDir(dirname(fullPath));
  const glb = buildGLB(parts());
  writeFileSync(fullPath, glb);
  console.log(`  ✓ ${path} (${(glb.byteLength / 1024).toFixed(1)} KB)`);
}

console.log('\n✅ 모든 모델 생성 완료!\n');
