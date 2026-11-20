"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Stage, Layer, Rect, Text, Circle, Star, Image as KonvaImage, Transformer, Path, RegularPolygon, Line, Arrow } from "react-konva";
import Konva from "konva";

const FUENTES_BASE = [
  "Arial", "Georgia", "Impact", "Courier New", "Comic Sans MS",
  "Lobster", "Pacifico", "Dancing Script", "Great Vibes", "Sacramento", 
  "Caveat", "Shadows Into Light", "Permanent Marker", "Satisfy", "Allura",
  "Alex Brush", "Tangerine", "Courgette", "Kaushan Script", "Yellowtail",
  "Bebas Neue", "Bungee", "Monoton", "Anton", "Righteous", "Oswald",
  "Cinzel", "Playfair Display", "Abril Fatface", "Alfa Slab One",
  "Fira Code", "Josefin Sans", "Quicksand", "Raleway", "Roboto", "Ubuntu", 
  "Indie Flower", "Bangers", "Fredoka One", "Press Start 2P"
];

const TEXTURAS = [
  { id: 'none', nombre: 'Ninguna' },
  { id: 'puntos', nombre: 'Hoja de Puntos (Negros)' },
  { id: 'cuadricula', nombre: 'Cuaderno Cuadriculado' },
  { id: 'rayas', nombre: 'Hoja Rayada' },
  { id: 'periodico', nombre: 'Papel Periódico' },
  { id: 'kraft', nombre: 'Papel Kraft' },
  { id: 'lisa', nombre: 'Vidrio / Brillo' },
  { id: 'suave', nombre: 'Ondas Suaves' },
  { id: 'aspera', nombre: 'Grano / Lija' },
  { id: 'rugosa', nombre: 'Madera / Corteza' },
  { id: 'porosa', nombre: 'Ladrillo' },
  { id: 'agrietada', nombre: 'Tierra Agrietada' },
  { id: 'brillante', nombre: 'Confeti / Glitter' },
  { id: 'geometrica', nombre: 'Mosaico Geométrico' },
  { id: 'organica', nombre: 'Mármol' }
];

const ETIQUETAS_ORNAMENTALES = [
  { id: 'etq_vintage_1', nombre: 'Etiqueta 1', estilo: 'svg_fill', path: 'M 10 12 Q 16 6 27 8 Q 38 6 44 12 Q 49 18 46 25 Q 49 32 44 38 Q 38 44 27 42 Q 16 44 10 38 Q 5 32 8 25 Q 5 18 10 12 Z' },
  { id: 'etq_sello_2', nombre: 'Sello 2', estilo: 'svg_fill', path: 'M 14 8 Q 20 3 27 7 Q 34 3 40 8 Q 46 11 45 18 Q 50 25 45 32 Q 46 39 40 42 Q 34 47 27 43 Q 20 47 14 42 Q 8 39 9 32 Q 4 25 9 18 Q 8 11 14 8 Z' },
  { id: 'etq_escudo_3', nombre: 'Escudo 3', estilo: 'svg_fill', path: 'M 10 7 H 44 V 23 C 44 35 27 45 27 45 C 27 45 10 35 10 23 Z' },
  { id: 'etq_escudo_4', nombre: 'Escudo 4', estilo: 'svg_fill', path: 'M 27 5 L 45 11 V 25 C 45 36 27 46 27 46 C 27 46 9 36 9 25 V 11 Z' },
  { id: 'etq_placa_5', nombre: 'Placa 5', estilo: 'svg_fill', path: 'M 12 12 L 20 8 H 34 L 42 12 L 48 18 V 32 L 42 38 L 34 42 H 20 L 12 38 L 6 32 V 18 Z' },
  { id: 'etq_oval_6', nombre: 'Óvalo 6', estilo: 'svg_fill', path: 'M 27 8 C 41 8 49 15 49 25 C 49 35 41 42 27 42 C 13 42 5 35 5 25 C 5 15 13 8 27 8 Z' },
  { id: 'etq_marco_7', nombre: 'Marco 7', estilo: 'svg_fill', path: 'M 8 14 C 14 14 14 8 20 8 H 34 C 40 8 40 14 46 14 V 36 C 40 36 40 42 34 42 H 20 C 14 42 14 36 8 36 Z' },
  { id: 'etq_tag_8', nombre: 'Tag 8', estilo: 'svg_fill', path: 'M 16 6 H 38 L 46 14 V 44 H 8 V 14 Z M 27 10 A 3 3 0 1 0 27 16 A 3 3 0 1 0 27 10 Z' },
  { id: 'etq_nube_9', nombre: 'Nube 9', estilo: 'svg_fill', path: 'M 14 38 H 40 A 9 9 0 0 0 42 20 A 11 11 0 0 0 21 13 A 10 10 0 0 0 12 22 A 8 8 0 0 0 14 38 Z' },
  { id: 'etq_cinta_10', nombre: 'Cinta 10', estilo: 'svg_fill', path: 'M 5 15 H 49 L 43 25 L 49 35 H 5 L 11 25 Z' },
  { id: 'etq_hex_11', nombre: 'Hexágono 11', estilo: 'svg_fill', path: 'M 15 9 H 39 L 49 25 L 39 41 H 15 L 5 25 Z' },
  { id: 'etq_diam_12', nombre: 'Rombo 12', estilo: 'svg_fill', path: 'M 27 5 L 48 25 L 27 45 L 6 25 Z' },
];

const FORMAS_CATALOGO = {
  etiquetas: ETIQUETAS_ORNAMENTALES,
  lineas: [
    { id: 'linea_diag', nombre: 'Diagonal', tipo: 'linea', points: [8, 8, 88, 88] },
    { id: 'flecha_diag', nombre: 'Flecha diag.', tipo: 'flecha', points: [8, 8, 88, 88] },
    { id: 'flecha_doble_diag', nombre: 'Doble flecha', tipo: 'flecha_doble', points: [10, 10, 86, 86] },
    { id: 'paso_codo', nombre: 'Paso codo', tipo: 'svg_stroke', path: 'M 8 14 H 46 V 76 H 86' },
    { id: 'paso_flecha', nombre: 'Paso flecha', tipo: 'svg_stroke', path: 'M 8 14 H 46 V 76 H 84 M 76 68 L 84 76 L 76 84' },
    { id: 'paso_doble_flecha', nombre: 'Paso doble', tipo: 'svg_stroke', path: 'M 14 14 H 46 V 76 H 84 M 22 6 L 14 14 L 22 22 M 76 68 L 84 76 L 76 84' },
    { id: 'curva_s', nombre: 'Curva S', tipo: 'svg_stroke', path: 'M 24 18 H 64 C 76 18 76 44 64 44 H 34 C 22 44 22 72 34 72 H 74' },
    { id: 'curva_s_flecha', nombre: 'S flecha', tipo: 'svg_stroke', path: 'M 24 18 H 64 C 76 18 76 44 64 44 H 34 C 22 44 22 72 34 72 H 76 M 68 64 L 76 72 L 68 80' },
    { id: 'curva_s_doble', nombre: 'S doble', tipo: 'svg_stroke', path: 'M 26 18 H 64 C 76 18 76 44 64 44 H 34 C 22 44 22 72 34 72 H 76 M 34 10 L 26 18 L 34 26 M 68 64 L 76 72 L 68 80' },
    { id: 'onda_suave', nombre: 'Onda', tipo: 'svg_stroke', path: 'M 10 56 C 24 22 44 22 52 50 C 60 78 78 74 90 42' },
    { id: 'codo_llamada', nombre: 'Gancho', tipo: 'svg_stroke', path: 'M 12 72 H 58 C 70 72 74 62 66 54 C 58 46 48 54 54 62 C 60 70 78 62 78 38 C 78 24 66 18 54 24' },
    { id: 'lazo_libre', nombre: 'Lazo', tipo: 'svg_stroke', path: 'M 14 28 C 28 14 42 48 28 54 C 16 58 24 34 44 42 C 62 50 56 80 72 76 C 84 72 82 54 90 48' },
    { id: 'arco_cuarto', nombre: 'Arco', tipo: 'svg_stroke', path: 'M 12 22 C 54 22 82 50 82 86' },
    { id: 'corchetes_abiertos', nombre: '[ ]', tipo: 'svg_stroke', path: 'M 26 18 H 14 V 80 H 26 M 70 18 H 82 V 80 H 70' },
    { id: 'llaves_abiertas', nombre: '{ }', tipo: 'svg_stroke', path: 'M 32 18 C 22 18 22 44 12 49 C 22 54 22 80 32 80 M 64 18 C 74 18 74 44 84 49 C 74 54 74 80 64 80' },
    { id: 'corchete_izq', nombre: '[', tipo: 'svg_stroke', path: 'M 28 18 H 16 V 80 H 28' },
    { id: 'corchete_der', nombre: ']', tipo: 'svg_stroke', path: 'M 68 18 H 80 V 80 H 68' },
    { id: 'llave_izq_sola', nombre: '{', tipo: 'svg_stroke', path: 'M 34 18 C 24 18 24 44 14 49 C 24 54 24 80 34 80' },
    { id: 'llave_der_sola', nombre: '}', tipo: 'svg_stroke', path: 'M 62 18 C 72 18 72 44 82 49 C 72 54 72 80 62 80' },
  ],
  flechas: [
    { id: 'arrow_right', nombre: 'Derecha', tipo: 'svg_fill', path: 'M 5 18 L 35 18 L 35 8 L 55 25 L 35 42 L 35 32 L 5 32 Z' },
    { id: 'arrow_left', nombre: 'Izquierda', tipo: 'svg_fill', path: 'M 55 18 L 25 18 L 25 8 L 5 25 L 25 42 L 25 32 L 55 32 Z' },
    { id: 'arrow_up', nombre: 'Arriba', tipo: 'svg_fill', path: 'M 22 45 L 22 22 L 10 22 L 28 5 L 46 22 L 34 22 L 34 45 Z' },
    { id: 'arrow_down', nombre: 'Abajo', tipo: 'svg_fill', path: 'M 22 5 L 22 28 L 10 28 L 28 45 L 46 28 L 34 28 L 34 5 Z' },
    { id: 'arrow_curved', nombre: 'Curva', tipo: 'svg_fill', path: 'M 8 40 Q 22 10 44 18 L 40 8 L 55 22 L 38 32 L 42 23 Q 22 18 8 40 Z' },
  ],
  llamadas: [
    { id: 'bocadillo_rect', nombre: 'Bocadillo', tipo: 'svg_fill', path: 'M 6 6 H 48 V 34 H 24 L 14 46 V 34 H 6 Z' },
    { id: 'bocadillo_oval', nombre: 'Óvalo', tipo: 'svg_fill', path: 'M 28 6 C 14 6 5 14 5 23 C 5 29 9 34 15 36 L 10 46 L 22 38 C 24 38 26 39 28 39 C 42 39 51 31 51 23 C 51 14 42 6 28 6 Z' },
    { id: 'nube_pensar', nombre: 'Pensar', tipo: 'svg_fill', path: 'M 16 32 A 9 9 0 1 1 19 15 A 12 12 0 0 1 41 16 A 9 9 0 1 1 38 33 Z M 12 40 A 4 4 0 1 0 12 41 M 7 45 A 2.5 2.5 0 1 0 7 46' },
    { id: 'nota_esquina', nombre: 'Nota', tipo: 'svg_fill', path: 'M 8 6 H 38 L 48 16 V 44 H 8 Z M 38 6 V 16 H 48' },
  ],
  simbolos: [
    { id: 'mas', nombre: 'Más', tipo: 'svg_fill', path: 'M 20 8 H 30 V 20 H 42 V 30 H 30 V 42 H 20 V 30 H 8 V 20 H 20 Z' },
    { id: 'menos', nombre: 'Menos', tipo: 'svg_fill', path: 'M 8 20 H 42 V 30 H 8 Z' },
    { id: 'equis', nombre: 'Equis', tipo: 'svg_fill', path: 'M 12 8 L 25 21 L 38 8 L 43 13 L 30 26 L 43 39 L 38 44 L 25 31 L 12 44 L 7 39 L 20 26 L 7 13 Z' },
    { id: 'corazon_svg', nombre: 'Corazón', tipo: 'svg_fill', path: 'M 25 44 C 25 44 5 28 5 15 C 5 8 11 5 17 5 C 21 5 24 8 25 11 C 26 8 29 5 33 5 C 39 5 45 8 45 15 C 45 28 25 44 25 44 Z' },
    { id: 'rayo', nombre: 'Rayo', tipo: 'svg_fill', path: 'M 30 4 L 12 27 H 24 L 20 46 L 38 22 H 26 Z' },
    { id: 'sol', nombre: 'Sol', tipo: 'svg_stroke', path: 'M 25 14 A 11 11 0 1 0 25 36 A 11 11 0 1 0 25 14 Z M 25 3 V 9 M 25 41 V 47 M 3 25 H 9 M 41 25 H 47 M 9 9 L 14 14 M 36 36 L 41 41 M 41 9 L 36 14 M 14 36 L 9 41' },
    { id: 'luna', nombre: 'Luna', tipo: 'svg_fill', path: 'M 36 36 A 16 16 0 1 1 24 8 A 13 13 0 0 0 36 36 Z' },
  ],
  diagrama: [
    { id: 'proceso', nombre: 'Proceso', tipo: 'svg_stroke', path: 'M 8 12 H 46 V 38 H 8 Z' },
    { id: 'redondeado', nombre: 'Terminal', tipo: 'svg_stroke', path: 'M 16 12 H 38 A 13 13 0 0 1 38 38 H 16 A 13 13 0 0 1 16 12 Z' },
    { id: 'decision', nombre: 'Decisión', tipo: 'svg_stroke', path: 'M 27 6 L 48 25 L 27 44 L 6 25 Z' },
    { id: 'datos', nombre: 'Datos', tipo: 'svg_stroke', path: 'M 15 12 H 48 L 39 38 H 6 Z' },
    { id: 'documento', nombre: 'Documento', tipo: 'svg_stroke', path: 'M 8 10 H 46 V 36 Q 36 30 27 36 T 8 36 Z' },
    { id: 'hexagono', nombre: 'Hexágono', tipo: 'svg_stroke', path: 'M 15 10 H 39 L 49 25 L 39 40 H 15 L 5 25 Z' },
  ],
};

const getHeartPath = () => "M 50 30 C 50 30 50 0 25 0 C 0 0 0 30 25 50 C 50 70 50 100 50 100 C 50 100 50 70 75 50 C 100 30 100 0 75 0 C 50 0 50 30 50 30 Z";

function escalarPathSvg(pathStr: string, factor: number): string {
  if (!pathStr || factor === 1) return pathStr;
  return pathStr.replace(/-?\d+(\.\d+)?/g, (numStr) => {
    const val = parseFloat(numStr) * factor;
    return String(Number(val.toFixed(2)));
  });
}

function generarTexturaNitida(tipoId: string, colorBase: string): HTMLImageElement | null {
  if (tipoId === 'none') return null;

  const scale = typeof window !== 'undefined' ? Math.max(1, window.devicePixelRatio || 1) : 1;
  const canvas = document.createElement('canvas');
  canvas.width = 500 * scale;
  canvas.height = 650 * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false;

  const base = colorBase && colorBase !== 'transparent' ? colorBase : '#ffffff';
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 500, 650);

  if (tipoId === 'puntos') {
    ctx.fillStyle = '#000000';
    for (let y = 16; y < 650; y += 22) {
      for (let x = 16; x < 500; x += 22) {
        ctx.beginPath();
        ctx.arc(x, y, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (tipoId === 'cuadricula') {
    ctx.strokeStyle = 'rgba(15, 23, 42, 0.25)';
    ctx.lineWidth = 1;
    for (let x = 0; x <= 500; x += 25) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 650);
      ctx.stroke();
    }
    for (let y = 0; y <= 650; y += 25) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(500, y);
      ctx.stroke();
    }
  } else if (tipoId === 'rayas') {
    ctx.strokeStyle = 'rgba(37, 99, 235, 0.28)';
    ctx.lineWidth = 1.2;
    for (let y = 32; y < 650; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(500, y);
      ctx.stroke();
    }
    ctx.strokeStyle = 'rgba(220, 38, 38, 0.35)';
    ctx.beginPath();
    ctx.moveTo(45, 0);
    ctx.lineTo(45, 650);
    ctx.stroke();
  } else if (tipoId === 'periodico') {
    ctx.fillStyle = '#f3ebd8';
    ctx.fillRect(0, 0, 500, 650);
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.28)';
    ctx.lineWidth = 1;
    for (let y = 24; y < 640; y += 16) {
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(476, y);
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(15, 23, 42, 0.38)';
    ctx.font = 'bold 14px Georgia, serif';
    ctx.fillText('EDICIÓN ESPECIAL • CRÓNICA & DISEÑO', 24, 18);
  } else if (tipoId === 'kraft') {
    ctx.fillStyle = '#d4b483';
    ctx.fillRect(0, 0, 500, 650);
    for (let i = 0; i < 3500; i++) {
      const x = (i * 89) % 500;
      const y = (i * 151) % 650;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(92, 58, 22, 0.25)' : 'rgba(255, 248, 220, 0.25)';
      ctx.fillRect(x, y, 2, 1.5);
    }
  } else if (tipoId === 'lisa') {
    const grad = ctx.createLinearGradient(0, 0, 500, 650);
    grad.addColorStop(0, '#e0f2fe');
    grad.addColorStop(0.5, '#ffffff');
    grad.addColorStop(1, '#bae6fd');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 500, 650);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.beginPath();
    ctx.moveTo(60, 0);
    ctx.lineTo(170, 0);
    ctx.lineTo(70, 650);
    ctx.lineTo(-40, 650);
    ctx.closePath();
    ctx.fill();
  } else if (tipoId === 'suave') {
    for (let y = 0; y < 650; y += 4) {
      ctx.strokeStyle = y % 8 === 0 ? 'rgba(244, 114, 182, 0.26)' : 'rgba(148, 163, 184, 0.28)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(160, y - 10, 340, y + 10, 500, y);
      ctx.stroke();
    }
  } else if (tipoId === 'aspera') {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 500, 650);
    for (let i = 0; i < 4500; i++) {
      const x = (i * 73) % 500;
      const y = (i * 137) % 650;
      ctx.fillStyle = i % 2 === 0 ? 'rgba(15, 23, 42, 0.45)' : 'rgba(255, 255, 255, 0.65)';
      ctx.fillRect(x, y, 2, 2);
    }
  } else if (tipoId === 'rugosa') {
    ctx.fillStyle = '#e7dcc8';
    ctx.fillRect(0, 0, 500, 650);
    ctx.strokeStyle = 'rgba(69, 39, 18, 0.45)';
    ctx.lineWidth = 2;
    for (let x = 0; x < 500; x += 18) {
      ctx.beginPath();
      for (let y = 0; y <= 650; y += 25) {
        const offset = Math.sin(y * 0.03 + x) * 6;
        if (y === 0) ctx.moveTo(x + offset, y);
        else ctx.lineTo(x + offset, y);
      }
      ctx.stroke();
    }
  } else if (tipoId === 'porosa') {
    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(0, 0, 500, 650);
    const altoFila = 32;
    const anchoLad = 64;
    ctx.strokeStyle = 'rgba(185, 28, 28, 0.45)';
    ctx.lineWidth = 2;
    for (let fila = 0; fila * altoFila < 650; fila++) {
      const y = fila * altoFila;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(500, y);
      ctx.stroke();
      const shift = (fila % 2) * (anchoLad / 2);
      for (let x = shift; x < 500; x += anchoLad) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + altoFila);
        ctx.stroke();
      }
    }
  } else if (tipoId === 'agrietada') {
    ctx.fillStyle = '#efe3cf';
    ctx.fillRect(0, 0, 500, 650);
    ctx.strokeStyle = 'rgba(92, 64, 34, 0.55)';
    ctx.lineWidth = 1.6;
    for (let gx = 40; gx < 500; gx += 85) {
      for (let gy = 40; gy < 650; gy += 85) {
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + 35, gy + 22);
        ctx.lineTo(gx + 15, gy + 58);
        ctx.lineTo(gx - 25, gy + 45);
        ctx.closePath();
        ctx.stroke();
      }
    }
  } else if (tipoId === 'brillante') {
    ctx.fillStyle = '#fdf2f8';
    ctx.fillRect(0, 0, 500, 650);
    const colores = ['#f43f5e', '#ec4899', '#a855f7', '#06b6d4', '#facc15', '#334155'];
    for (let i = 0; i < 650; i++) {
      const x = (i * 97) % 500;
      const y = (i * 193) % 650;
      ctx.fillStyle = colores[i % colores.length];
      ctx.beginPath();
      ctx.arc(x, y, i % 3 === 0 ? 2.4 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (tipoId === 'geometrica') {
    const tam = 50;
    const paleta = ['#e0f2fe', '#fef3c7', '#fce7f3', '#dcfce7', '#ede9fe'];
    for (let y = 0; y < 650; y += tam) {
      for (let x = 0; x < 500; x += tam) {
        const idx = ((x / tam) + (y / tam)) % paleta.length;
        ctx.fillStyle = paleta[idx];
        ctx.fillRect(x, y, tam, tam);

        ctx.strokeStyle = 'rgba(30, 41, 59, 0.35)';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, tam, tam);

        ctx.fillStyle = 'rgba(30, 41, 59, 0.18)';
        ctx.beginPath();
        ctx.moveTo(x + tam / 2, y);
        ctx.lineTo(x + tam, y + tam / 2);
        ctx.lineTo(x + tam / 2, y + tam);
        ctx.lineTo(x, y + tam / 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  } else if (tipoId === 'organica') {
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, 500, 650);
    ctx.strokeStyle = 'rgba(71, 85, 105, 0.38)';
    for (let i = 0; i < 16; i++) {
      ctx.lineWidth = i % 3 === 0 ? 2.5 : 1.3;
      ctx.beginPath();
      const startY = i * 42;
      ctx.moveTo(0, startY);
      ctx.bezierCurveTo(160, startY + 55, 320, startY - 55, 500, startY + 18);
      ctx.stroke();
    }
  }

  const img = new window.Image();
  img.src = canvas.toDataURL();
  return img;
}

export default function Editor() {
  const [texto, setTexto] = useState("mi cartel");
  const [colorTexto, setColorTexto] = useState("#0f172a");
  const [tamanoTexto, setTamanoTexto] = useState(40);
  const [fuenteTexto, setFuenteTexto] = useState("Arial");
  const [textoPos, setTextoPos] = useState({ x: 100, y: 300 });

  const [usarDegradado, setUsarDegradado] = useState(false);
  const [colorDegradado1, setColorDegradado1] = useState("#FF007F");
  const [colorDegradado2, setColorDegradado2] = useState("#00F0FF");

  const [colorContorno, setColorContorno] = useState("#ffffff");
  const [grosorContorno, setGrosorContorno] = useState(0);
  const [sombraColor, setSombraColor] = useState("#000000");
  const [sombraBlur, setSombraBlur] = useState(0);
  const [sombraOpacidad, setSombraOpacidad] = useState(0.5);

  const [formas, setFormas] = useState<any[]>([]);
  const [imagenes, setImagenes] = useState<any[]>([]);
  const [seleccionadoId, setSeleccionadoId] = useState<number | null>(null);
  const [colorFondo, setColorFondo] = useState("#ffffff");
  const [texturaFondo, setTexturaFondo] = useState("none");
  
  const [capas, setCapas] = useState<{id: number, tipo: 'texto'|'forma'|'imagen'}[]>([
    { id: 999, tipo: 'texto' }
  ]);
  
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [urlImagen, setUrlImagen] = useState("");
  
  const [fuentesPersonalizadas, setFuentesPersonalizadas] = useState<{id: string, nombre: string, url?: string}[]>([]);
  const [nuevaFuenteGoogle, setNuevaFuenteGoogle] = useState("");
  
  const [mensajeGuardado, setMensajeGuardado] = useState("");
  const [cargandoFondo, setCargandoFondo] = useState(false);
  const [subiendoFuente, setSubiendoFuente] = useState(false);
  const [cargandoUrl, setCargandoUrl] = useState(false);
  
  const [categoriaFormas, setCategoriaFormas] = useState<'basicas' | 'etiquetas' | 'lineas' | 'flechas' | 'llamadas' | 'simbolos' | 'diagrama'>('lineas');

  const [mostrarDisenos, setMostrarDisenos] = useState(false);
  const [disenosGuardados, setDisenosGuardados] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      Konva.pixelRatio = Math.max(1, window.devicePixelRatio || 1);
    }
    const versionActual = "v3"; 
    const versionGuardada = localStorage.getItem("versionFuentes");
    if (versionGuardada !== versionActual) {
      localStorage.removeItem('misFuentesLocales');
      localStorage.setItem("versionFuentes", versionActual);
      window.location.reload(); 
    }
    
    const guardados = JSON.parse(localStorage.getItem('misDiseños') || '[]');
    setDisenosGuardados(guardados);
  }, []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lobster&family=Pacifico&family=Dancing+Script:wght@700&family=Great+Vibes&family=Sacramento&family=Caveat:wght@700&family=Shadows+Into+Light&family=Permanent+Marker&family=Satisfy&family=Allura&family=Alex+Brush&family=Tangerine&family=Courgette&family=Kaushan+Script&family=Yellowtail&family=Bebas+Neue&family=Bungee&family=Monoton&family=Anton&family=Righteous&family=Oswald&family=Cinzel:wght@700&family=Playfair+Display&family=Abril+Fatface&family=Alfa+Slab+One&family=Fira+Code&family=Josefin+Sans&family=Quicksand&family=Raleway&family=Roboto&family=Ubuntu&family=Indie+Flower&family=Bangers&family=Fredoka+One&family=Press+Start+2P&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const cargarFuentesGuardadas = async () => {
      const fuentesLocales = JSON.parse(localStorage.getItem('misFuentesLocales') || '[]');
      for (const fuente of fuentesLocales) {
        try {
          if (fuente.url) {
            const fontFace = new FontFace(fuente.id, `url(${fuente.url})`);
            await fontFace.load();
            document.fonts.add(fontFace);
          }
          setFuentesPersonalizadas(prev => {
            if (!prev.find(f => f.id === fuente.id)) return [...prev, fuente];
            return prev;
          });
        } catch (err) {
          console.error("Error cargando fuente local:", err);
        }
      }
    };
    cargarFuentesGuardadas();
  }, []);

  useEffect(() => {
    const img = generarTexturaNitida(texturaFondo, colorFondo);
    if (!img) {
      setBgImage(null);
      return;
    }
    img.onload = () => setBgImage(img);
    if (img.complete) setBgImage(img);
  }, [texturaFondo, colorFondo]);

  useEffect(() => {
    if (seleccionadoId !== null && trRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#elem-${seleccionadoId}`);
      if (node) {
        trRef.current.nodes([node]);
        trRef.current.forceUpdate();
        trRef.current.getLayer()?.batchDraw();
      } else {
        trRef.current.nodes([]);
        trRef.current.getLayer()?.batchDraw();
      }
    } else if (trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
  }, [seleccionadoId, capas.length, formas.length, imagenes.length, textoPos.x, textoPos.y, tamanoTexto]);

  const registrarCapa = (id: number, tipo: 'texto'|'forma'|'imagen') => {
    setCapas(prev => {
      if (prev.some(c => c.id === id)) return prev;
      return [...prev, { id, tipo }];
    });
  };

  const agregarForma = (tipo: string, extra?: { path?: string; points?: number[]; estilo?: string }) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const colorInicial =
      tipo === 'circulo' ? '#3b82f6' :
      tipo === 'cuadrado' ? '#ef4444' :
      tipo === 'corazon' ? '#ec4899' :
      tipo === 'destello' ? '#06b6d4' :
      tipo === 'triangulo' ? '#8b5cf6' :
      tipo === 'rombo' ? '#f43f5e' :
      '#0f172a';

    const esTrazo = tipo === 'linea' || tipo === 'flecha' || tipo === 'flecha_doble' || extra?.estilo === 'svg_stroke';
    const escalaInicial = esTrazo ? 0.5 : 0.9;

    const nuevaForma = {
      id,
      tipo,
      x: 170,
      y: 180,
      fill: colorInicial,
      stroke: colorInicial,
      path: extra?.path ? escalarPathSvg(extra.path, escalaInicial) : undefined,
      points: extra?.points ? extra.points.map(p => Number((p * escalaInicial).toFixed(2))) : undefined,
      radius: tipo === 'circulo' ? 35 : tipo === 'triangulo' || tipo === 'rombo' ? 36 : undefined,
      width: tipo === 'cuadrado' ? 75 : undefined,
      height: tipo === 'cuadrado' ? 75 : undefined,
      estilo: extra?.estilo || 'relleno',
      strokeWidth: 3,
      escalaNivel: 1,
    };
    setFormas(prev => [...prev, nuevaForma]);
    registrarCapa(id, 'forma');
    setSeleccionadoId(id);
  };

  const subirImagenLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCargandoFondo(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      setTimeout(() => {
        crearObjetoImagen(src, true);
        setCargandoFondo(false);
      }, 1500);
    };
    reader.readAsDataURL(file);
  };

  const cargarImagenDesdeURL = () => {
    if (!urlImagen.trim()) return;
    
    setCargandoUrl(true);
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = urlImagen;

    img.onload = () => {
      const id = Date.now();
      const nuevaImagen = {
        id, 
        image: img, 
        x: 200, 
        y: 200,
        width: 200, 
        height: 200 * (img.height / img.width),
        opacity: 1, 
        filtro: 'none'
      };
      
      setImagenes(prev => [...prev, nuevaImagen]);
      registrarCapa(id, 'imagen');
      setSeleccionadoId(id);
      setUrlImagen("");
      setCargandoUrl(false);
    };

    img.onerror = () => {
      alert("No se pudo cargar la imagen. Verifica que la URL sea correcta y que la imagen no esté protegida.");
      setCargandoUrl(false);
    };
  };

  const crearObjetoImagen = (src: string, quitarFondo: boolean) => {
    const img = new window.Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const id = Date.now();
      const nuevaImagen = {
        id, image: img, x: 200, y: 200,
        width: 200, height: 200 * (img.height / img.width),
        opacity: 1, 
        filtro: quitarFondo ? 'removeBg' : 'none'
      };
      setImagenes(prev => [...prev, nuevaImagen]);
      registrarCapa(id, 'imagen');
      setSeleccionadoId(id);
    };
  };

  const subirFuente = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubiendoFuente(true);
    const idFuente = `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nombreLimpio = file.name.replace(/\.(ttf|otf)$/i, '');
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      
      try {
        const fontFace = new FontFace(idFuente, `url(${base64Data})`);
        await fontFace.load();
        document.fonts.add(fontFace);

        const nuevaFuente = { id: idFuente, nombre: nombreLimpio, url: base64Data };
        
        setFuentesPersonalizadas(prev => [...prev, nuevaFuente]);
        setFuenteTexto(idFuente);
        
        const fuentesGuardadas = JSON.parse(localStorage.getItem('misFuentesLocales') || '[]');
        fuentesGuardadas.push(nuevaFuente);
        localStorage.setItem('misFuentesLocales', JSON.stringify(fuentesGuardadas));
        
        alert("¡Fuente subida y guardada en tu navegador! 🎉");
      } catch (error) {
        alert("Error al cargar la fuente en el navegador.");
        console.error(error);
      } finally {
        setSubiendoFuente(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const agregarFuenteGoogle = () => {
    const nombreLimpio = nuevaFuenteGoogle.trim();
    if (!nombreLimpio) return;

    const familiaFormateada = nombreLimpio.replace(/\s+/g, '+');
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${familiaFormateada}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    const nueva = { id: nombreLimpio, nombre: nombreLimpio };
    setFuentesPersonalizadas(prev => {
      if (prev.some(f => f.id.toLowerCase() === nombreLimpio.toLowerCase())) return prev;
      return [...prev, nueva];
    });
    setFuenteTexto(nombreLimpio);
    setNuevaFuenteGoogle("");
  };

  const descargarGuiaFuentes = () => {
    const contenido = [
      "FUENTES DISPONIBLES EN MINI CANVA",
      "---------------------------------",
      "Fuentes incluidas:",
      ...FUENTES_BASE.map(f => `- ${f}`),
      "",
      "Para agregar más fuentes desde tu PC:",
      "1. Descarga un archivo .ttf o .otf (por ejemplo desde Google Fonts o DaFont).",
      "2. Haz clic en '+ Subir Fuente (.ttf / .otf)' en el editor.",
      "3. O escribe el nombre exacto de una fuente de Google Fonts (ej. Poppins, Montserrat, Nunito) y pulsa 'Agregar'."
    ].join("\n");

    const blob = new Blob([contenido], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "fuentes-mini-canva.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const borrarSeleccionado = () => {
    if (seleccionadoId === null) return;
    if (trRef.current) {
      trRef.current.nodes([]);
      trRef.current.getLayer()?.batchDraw();
    }
    if (seleccionadoId === 999) {
      setTexto("");
      setSeleccionadoId(null);
      return;
    }
    const idABorrar = seleccionadoId;
    setFormas(prev => prev.filter((f) => f.id !== idABorrar));
    setImagenes(prev => prev.filter((i) => i.id !== idABorrar));
    setCapas(prev => prev.filter((c) => c.id !== idABorrar));
    setSeleccionadoId(null);
  };

  const cambiarColorForma = (nuevoColor: string) => {
    if (seleccionadoId === null) return;
    setFormas(prev => prev.map(f => f.id === seleccionadoId ? { ...f, fill: nuevoColor, stroke: nuevoColor } : f));
  };

  const aplicarFactorAForma = (forma: any, factor: number, nuevaEscalaNivel?: number) => {
    const nivelFinal = nuevaEscalaNivel !== undefined
      ? nuevaEscalaNivel
      : Math.max(0.25, Math.min(3.5, Number(((forma.escalaNivel || 1) * factor).toFixed(2))));

    return {
      ...forma,
      escalaNivel: nivelFinal,
      points: Array.isArray(forma.points)
        ? forma.points.map((pt: number) => Number((pt * factor).toFixed(2)))
        : undefined,
      path: forma.path ? escalarPathSvg(forma.path, factor) : undefined,
      radius: typeof forma.radius === 'number' ? Math.max(8, Math.min(240, Number((forma.radius * factor).toFixed(2)))) : undefined,
      width: typeof forma.width === 'number' ? Math.max(12, Math.min(400, Number((forma.width * factor).toFixed(2)))) : undefined,
      height: typeof forma.height === 'number' ? Math.max(12, Math.min(400, Number((forma.height * factor).toFixed(2)))) : undefined,
    };
  };

  const ajustarEscalaSeleccionado = (factor: number) => {
    if (seleccionadoId === null) return;
    if (seleccionadoId === 999) {
      setTamanoTexto(prev => Math.max(12, Math.min(180, Math.round(prev * factor))));
      return;
    }
    const forma = formas.find(f => f.id === seleccionadoId);
    if (forma) {
      setFormas(prev => prev.map(f => f.id === seleccionadoId ? aplicarFactorAForma(f, factor) : f));
      return;
    }
    const img = imagenes.find(i => i.id === seleccionadoId);
    if (img) {
      setImagenes(prev => prev.map(i => {
        if (i.id !== seleccionadoId) return i;
        return {
          ...i,
          width: Math.max(20, Math.min(480, Math.round(i.width * factor))),
          height: Math.max(20, Math.min(620, Math.round(i.height * factor))),
        };
      }));
    }
  };

  const fijarEscalaExacta = (valorDeseado: number) => {
    if (seleccionadoId === null) return;
    const forma = formas.find(f => f.id === seleccionadoId);
    if (!forma) return;
    const nivelActual = forma.escalaNivel || 1;
    if (nivelActual <= 0) return;
    const factorRelativo = valorDeseado / nivelActual;
    setFormas(prev => prev.map(f => f.id === seleccionadoId ? aplicarFactorAForma(f, factorRelativo, valorDeseado) : f));
  };

  const cambiarOpacidadImagen = (nuevaOpacidad: number) => {
    setImagenes(prev => prev.map(i => i.id === seleccionadoId ? { ...i, opacity: nuevaOpacidad } : i));
  };

  const traerAlFrente = (id: number) => {
    setCapas(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const item = prev[idx];
      const sinItem = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      return [...sinItem, item];
    });
  };

  const enviarAlFondo = (id: number) => {
    setCapas(prev => {
      const idx = prev.findIndex(c => c.id === id);
      if (idx === -1) return prev;
      const item = prev[idx];
      const sinItem = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      return [item, ...sinItem];
    });
  };

  const guardarDiseño = () => {
    setMensajeGuardado("Guardando...");
    const diseño = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      nombre: `Cartel ${new Date().toLocaleDateString()}`,
      texto, colorTexto, tamanoTexto, fuenteTexto, textoPos,
      usarDegradado, colorDegradado1, colorDegradado2,
      colorContorno, grosorContorno, sombraColor, sombraBlur, sombraOpacidad,
      colorFondo, texturaFondo, formas, 
      imagenes: imagenes.map(i => ({...i, image: i.image.src })),
      capas: capas,
      fecha: new Date().toISOString()
    };

    try {
      const diseñosGuardados = JSON.parse(localStorage.getItem('misDiseños') || '[]');
      diseñosGuardados.push(diseño);
      localStorage.setItem('misDiseños', JSON.stringify(diseñosGuardados));
      setDisenosGuardados(diseñosGuardados);
      setMensajeGuardado("¡Cartel guardado localmente! 🎉");
      setTimeout(() => setMensajeGuardado(""), 3000);
    } catch (error) {
      setMensajeGuardado("Error al guardar.");
    }
  };

  const cargarDiseno = (diseno: any) => {
    setTexto(diseno.texto);
    setColorTexto(diseno.colorTexto);
    setTamanoTexto(diseno.tamanoTexto);
    setFuenteTexto(diseno.fuenteTexto);
    setTextoPos(diseno.textoPos ? { x: diseno.textoPos.x, y: diseno.textoPos.y } : { x: 100, y: 300 });
    setUsarDegradado(diseno.usarDegradado);
    setColorDegradado1(diseno.colorDegradado1);
    setColorDegradado2(diseno.colorDegradado2);
    setColorContorno(diseno.colorContorno);
    setGrosorContorno(diseno.grosorContorno);
    setSombraColor(diseno.sombraColor);
    setSombraBlur(diseno.sombraBlur);
    setSombraOpacidad(diseno.sombraOpacidad);
    setColorFondo(diseno.colorFondo || "#ffffff");
    setTexturaFondo(diseno.texturaFondo || "none");
    
    const imgsReconstruidas = (diseno.imagenes || []).map((i: any) => {
      const img = new window.Image();
      img.src = i.image;
      return { ...i, image: img };
    });
    
    setFormas(diseno.formas || []);
    setImagenes(imgsReconstruidas);
    setCapas(diseno.capas || [{ id: 999, tipo: 'texto' }]);
    setSeleccionadoId(null);
    setMostrarDisenos(false);
  };

  const eliminarDiseno = (id: number, index?: number) => {
    const nuevos = disenosGuardados.filter((d, i) =>
      id !== undefined && id !== null ? d.id !== id : i !== index
    );
    localStorage.setItem('misDiseños', JSON.stringify(nuevos));
    setDisenosGuardados(nuevos);
  };

  const descargarCartel = () => {
    if (stageRef.current) {
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement('a');
      link.download = 'mi-cartel.png';
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleTransformEnd = (e: any, id: number, tipo: 'forma' | 'imagen' | 'texto') => {
    const node = e.target;
    const scaleX = node.scaleX() || 1;
    const scaleY = node.scaleY() || 1;
    const factor = Math.max(scaleX, scaleY);

    node.scaleX(1);
    node.scaleY(1);

    if (tipo === 'texto') {
      const nuevoTamano = Math.max(10, Math.round(tamanoTexto * factor));
      setTamanoTexto(nuevoTamano);
      setTextoPos({ x: node.x(), y: node.y() });
      return;
    }

    if (tipo === 'forma') {
      setFormas(prev => prev.map(f => {
        if (f.id !== id) return f;
        const actualizado = aplicarFactorAForma(f, factor);
        return {
          ...actualizado,
          x: node.x(),
          y: node.y(),
        };
      }));
    } else if (tipo === 'imagen') {
      setImagenes(prev => prev.map(i => {
        if (i.id === id) {
          return { 
            ...i, 
            x: node.x(), 
            y: node.y(), 
            width: Math.max(16, i.width * scaleX), 
            height: Math.max(16, i.height * scaleY) 
          };
        }
        return i;
      }));
    }
  };

  const formaSeleccionada = formas.find(f => f.id === seleccionadoId);
  const imagenSeleccionada = imagenes.find(i => i.id === seleccionadoId);

  const fillProps = usarDegradado ? {
    fillLinearGradientStartPoint: { x: 0, y: 0 },
    fillLinearGradientEndPoint: { x: 200, y: 200 },
    fillLinearGradientColorStops: [0, colorDegradado1, 1, colorDegradado2],
  } : { fill: colorTexto };

  const renderElementos = () => {
    return capas.map(capa => {
      if (capa.tipo === 'texto') {
        return (
          <Text
            key="texto"
            id="elem-999"
            text={texto}
            fontSize={tamanoTexto}
            fontFamily={fuenteTexto}
            x={textoPos.x}
            y={textoPos.y}
            scaleX={1}
            scaleY={1}
            draggable
            onClick={(e) => {
              e.cancelBubble = true;
              setSeleccionadoId(999);
            }}
            onDragEnd={(e) => {
              setTextoPos({ x: e.target.x(), y: e.target.y() });
            }}
            onTransformEnd={(e) => handleTransformEnd(e, 999, 'texto')}
            {...fillProps}
            stroke={grosorContorno > 0 ? colorContorno : undefined}
            strokeWidth={grosorContorno}
            shadowColor={sombraColor}
            shadowBlur={sombraBlur}
            shadowOpacity={sombraOpacidad}
            shadowOffsetX={sombraBlur > 0 ? 5 : 0}
            shadowOffsetY={sombraBlur > 0 ? 5 : 0}
          />
        );
      }
      
      if (capa.tipo === 'forma') {
        const forma = formas.find(f => f.id === capa.id);
        if (!forma) return null;
        const trazoColor = forma.stroke || forma.fill || '#0f172a';
        const rellenoColor = forma.fill || '#0f172a';
        const onDrag = (e: any) => setFormas(prev => prev.map(f => f.id === forma.id ? {...f, x: e.target.x(), y: e.target.y()} : f));
        const onSelect = (e: any) => {
          e.cancelBubble = true;
          setSeleccionadoId(forma.id);
        };

        return (
          <React.Fragment key={forma.id}>
            {forma.tipo === 'circulo' && (
              <Circle id={`elem-${forma.id}`} x={forma.x} y={forma.y} fill={rellenoColor} draggable radius={forma.radius || 35} scaleX={1} scaleY={1} onClick={onSelect} onDragEnd={onDrag} onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')} />
            )}
            {forma.tipo === 'cuadrado' && (
              <Rect id={`elem-${forma.id}`} x={forma.x} y={forma.y} fill={rellenoColor} draggable width={forma.width || 75} height={forma.height || 75} scaleX={1} scaleY={1} onClick={onSelect} onDragEnd={onDrag} onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')} />
            )}
            {forma.tipo === 'estrella' && (
              <Star id={`elem-${forma.id}`} x={forma.x} y={forma.y} fill={rellenoColor} draggable numPoints={5} innerRadius={18 * (forma.escalaNivel || 1)} outerRadius={42 * (forma.escalaNivel || 1)} scaleX={1} scaleY={1} onClick={onSelect} onDragEnd={onDrag} onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')} />
            )}
            {forma.tipo === 'corazon' && (
              <Path id={`elem-${forma.id}`} data={escalarPathSvg(getHeartPath(), 0.7 * (forma.escalaNivel || 1))} x={forma.x} y={forma.y} fill={rellenoColor} draggable scaleX={1} scaleY={1} onClick={onSelect} onDragEnd={onDrag} onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')} />
            )}
            {forma.tipo === 'destello' && (
              <Star id={`elem-${forma.id}`} x={forma.x} y={forma.y} fill={rellenoColor} draggable numPoints={4} innerRadius={9 * (forma.escalaNivel || 1)} outerRadius={34 * (forma.escalaNivel || 1)} scaleX={1} scaleY={1} onClick={onSelect} onDragEnd={onDrag} onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')} />
            )}
            {forma.tipo === 'explosion' && (
              <Star id={`elem-${forma.id}`} x={forma.x} y={forma.y} fill={rellenoColor} draggable numPoints={12} innerRadius={18 * (forma.escalaNivel || 1)} outerRadius={42 * (forma.escalaNivel || 1)} scaleX={1} scaleY={1} onClick={onSelect} onDragEnd={onDrag} onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')} />
            )}
            {forma.tipo === 'triangulo' && (
              <RegularPolygon id={`elem-${forma.id}`} x={forma.x} y={forma.y} fill={rellenoColor} draggable sides={3} radius={forma.radius || 36} scaleX={1} scaleY={1} onClick={onSelect} onDragEnd={onDrag} onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')} />
            )}
            {forma.tipo === 'rombo' && (
              <RegularPolygon id={`elem-${forma.id}`} x={forma.x} y={forma.y} fill={rellenoColor} draggable sides={4} radius={forma.radius || 36} scaleX={1} scaleY={1} onClick={onSelect} onDragEnd={onDrag} onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')} />
            )}
            {forma.tipo === 'linea' && (
              <Line
                id={`elem-${forma.id}`}
                points={forma.points || [0, 0, 50, 50]}
                x={forma.x}
                y={forma.y}
                stroke={trazoColor}
                strokeWidth={forma.strokeWidth || 3}
                lineCap="round"
                lineJoin="round"
                hitStrokeWidth={18}
                draggable
                scaleX={1}
                scaleY={1}
                onClick={onSelect}
                onDragEnd={onDrag}
                onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')}
              />
            )}
            {forma.tipo === 'flecha' && (
              <Arrow
                id={`elem-${forma.id}`}
                points={forma.points || [0, 0, 50, 50]}
                x={forma.x}
                y={forma.y}
                stroke={trazoColor}
                fill={trazoColor}
                strokeWidth={forma.strokeWidth || 3}
                pointerLength={10}
                pointerWidth={10}
                hitStrokeWidth={18}
                draggable
                scaleX={1}
                scaleY={1}
                onClick={onSelect}
                onDragEnd={onDrag}
                onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')}
              />
            )}
            {forma.tipo === 'flecha_doble' && (
              <Arrow
                id={`elem-${forma.id}`}
                points={forma.points || [0, 0, 50, 50]}
                x={forma.x}
                y={forma.y}
                stroke={trazoColor}
                fill={trazoColor}
                strokeWidth={forma.strokeWidth || 3}
                pointerLength={10}
                pointerWidth={10}
                pointerAtBeginning
                hitStrokeWidth={18}
                draggable
                scaleX={1}
                scaleY={1}
                onClick={onSelect}
                onDragEnd={onDrag}
                onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')}
              />
            )}
            {forma.tipo === 'svg' && forma.path && (
              <Path 
                id={`elem-${forma.id}`}
                data={forma.path}
                x={forma.x}
                y={forma.y}
                fill={forma.estilo === 'svg_stroke' ? 'transparent' : rellenoColor}
                stroke={forma.estilo === 'svg_stroke' ? trazoColor : undefined}
                strokeWidth={forma.estilo === 'svg_stroke' ? (forma.strokeWidth || 3) : 0}
                lineCap="round"
                lineJoin="round"
                hitStrokeWidth={18}
                draggable 
                scaleX={1}
                scaleY={1}
                onClick={onSelect} 
                onDragEnd={onDrag} 
                onTransformEnd={(e) => handleTransformEnd(e, forma.id, 'forma')} 
              />
            )}
          </React.Fragment>
        );
      }

      if (capa.tipo === 'imagen') {
        const img = imagenes.find(i => i.id === capa.id);
        if (!img) return null;
        return (
          <KonvaImage 
            key={img.id} id={`elem-${img.id}`} image={img.image} 
            x={img.x} y={img.y} width={img.width} height={img.height} 
            draggable opacity={img.opacity}
            onClick={(e) => {
              e.cancelBubble = true;
              setSeleccionadoId(img.id);
            }} 
            onDragEnd={(e) => { setImagenes(prev => prev.map(i => i.id === img.id ? {...i, x: e.target.x(), y: e.target.y()} : i)); }} 
            onTransformEnd={(e) => handleTransformEnd(e, img.id, 'imagen')} 
            filters={img.filtro === 'removeBg' ? [Konva.Filters.RGB] : []}
            red={255} green={255} blue={255}
          />
        );
      }
      return null;
    });
  };

  const estiloBotonForma: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    color: '#e5e7eb',
    borderRadius: '6px',
    padding: '7px 4px',
    cursor: 'pointer',
    fontSize: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '3px',
  };

  const renderMiniaturaLinea = (item: any) => {
    if (item.id === 'linea_diag') {
      return (
        <svg width="34" height="28" viewBox="0 0 96 96" style={{ background: 'transparent' }}>
          <line x1="14" y1="14" x2="82" y2="82" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" />
        </svg>
      );
    }
    if (item.id === 'flecha_diag') {
      return (
        <svg width="34" height="28" viewBox="0 0 96 96" style={{ background: 'transparent' }}>
          <line x1="14" y1="14" x2="80" y2="80" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" />
          <polyline points="56,80 80,80 80,56" fill="none" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    if (item.id === 'flecha_doble_diag') {
      return (
        <svg width="34" height="28" viewBox="0 0 96 96" style={{ background: 'transparent' }}>
          <line x1="16" y1="16" x2="80" y2="80" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" />
          <polyline points="36,16 16,16 16,36" fill="none" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          <polyline points="60,80 80,80 80,60" fill="none" stroke="#e5e7eb" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    }
    return (
      <svg width="34" height="28" viewBox="0 0 96 96" style={{ background: 'transparent' }}>
        <path
          d={item.path}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  };

  return (
    <main className="app-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <Link href="/">← Volver al inicio</Link>
          <h2>Editor de Carteles 🎨</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {mensajeGuardado && <span style={{ fontSize: '12px', color: '#fbbf24' }}>{mensajeGuardado}</span>}
          <button onClick={() => setMostrarDisenos(!mostrarDisenos)} className="btn-descargar" style={{ background: '#8b5cf6' }}>📁 Mis Diseños</button>
          <button onClick={guardarDiseño} className="btn-descargar" style={{ background: '#3b82f6' }}>Guardar</button>
          <button onClick={descargarCartel} className="btn-descargar">Descargar</button>
        </div>
      </header>

      {mostrarDisenos && (
        <div style={{ position: 'absolute', top: '70px', right: '20px', width: '300px', maxHeight: '400px', overflowY: 'auto', background: '#1f2937', padding: '16px', borderRadius: '8px', zIndex: 100, boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, color: 'white' }}>Mis Diseños</h3>
            <button onClick={() => setMostrarDisenos(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '16px' }}>✖</button>
          </div>
          {disenosGuardados.length === 0 ? (
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No tienes diseños guardados aún.</p>
          ) : (
            disenosGuardados.map((diseno, index) => (
              <div
                key={diseno.id ? `${diseno.id}-${index}` : `diseno-${index}`}
                style={{ background: '#374151', padding: '8px', borderRadius: '4px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ color: 'white', fontSize: '14px', cursor: 'pointer' }} onClick={() => cargarDiseno(diseno)}>
                  {diseno.nombre || 'Cartel sin título'}
                </span>
                <button
                  onClick={() => eliminarDiseno(diseno.id, index)}
                  style={{ background: '#ef4444', border: 'none', color: 'white', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px' }}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      )}

      <div className="main-content">
        <aside className="sidebar" style={{ height: 'calc(100vh - 80px)', overflowY: 'auto', paddingBottom: '50px' }}>
          <div>
            <h3>Formas</h3>
            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', flexWrap: 'wrap' }}>
              {(
                [
                  ['lineas', 'Líneas'],
                  ['etiquetas', 'Etiquetas'],
                  ['basicas', 'Básicas'],
                  ['flechas', 'Flechas'],
                  ['llamadas', 'Llamadas'],
                  ['simbolos', 'Símbolos'],
                  ['diagrama', 'Diagrama'],
                ] as const
              ).map(([cat, label]) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaFormas(cat)}
                  style={{
                    flex: '1 1 30%',
                    padding: '4px 6px',
                    fontSize: '10px',
                    background: categoriaFormas === cat ? '#3b82f6' : 'rgba(255,255,255,0.06)',
                    color: 'white',
                    borderRadius: '4px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            
            <div className="tools-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '5px' }}>
              {categoriaFormas === 'basicas' && (
                <>
                  <button onClick={() => agregarForma('circulo')} style={estiloBotonForma}><span style={{color:'#3b82f6'}}>●</span> Círculo</button>
                  <button onClick={() => agregarForma('cuadrado')} style={estiloBotonForma}><span style={{color:'#ef4444'}}>■</span> Cuadro</button>
                  <button onClick={() => agregarForma('estrella')} style={estiloBotonForma}><span style={{color:'#eab308'}}>★</span> Estrella</button>
                  <button onClick={() => agregarForma('corazon')} style={estiloBotonForma}><span style={{color:'#ec4899'}}>♥</span> Corazón</button>
                  <button onClick={() => agregarForma('destello')} style={estiloBotonForma}><span style={{color:'#06b6d4'}}>✦</span> Destello</button>
                  <button onClick={() => agregarForma('explosion')} style={estiloBotonForma}><span style={{color:'#f97316'}}>✸</span> Explosión</button>
                  <button onClick={() => agregarForma('triangulo')} style={estiloBotonForma}><span style={{color:'#8b5cf6'}}>▲</span> Triángulo</button>
                  <button onClick={() => agregarForma('rombo')} style={estiloBotonForma}><span style={{color:'#f43f5e'}}>◆</span> Rombo</button>
                </>
              )}

              {categoriaFormas === 'lineas' && FORMAS_CATALOGO.lineas.map(item => (
                <button
                  key={item.id}
                  onClick={() =>
                    agregarForma(
                      'estilo' in item && item.estilo === 'svg_stroke' ? 'svg' : item.tipo,
                      {
                        path: 'path' in item ? item.path : undefined,
                        points: 'points' in item ? item.points : undefined,
                        estilo: 'estilo' in item ? item.estilo : item.tipo,
                      }
                    )
                  }
                  style={estiloBotonForma}
                  title={item.nombre}
                >
                  {renderMiniaturaLinea(item)}
                  <span>{item.nombre}</span>
                </button>
              ))}

              {categoriaFormas !== 'basicas' && categoriaFormas !== 'lineas' && FORMAS_CATALOGO[categoriaFormas].map(item => (
                <button
                  key={item.id}
                  onClick={() =>
                    agregarForma(
                      'estilo' in item && (item.estilo === 'svg_stroke' || item.estilo === 'svg_fill') ? 'svg' : item.tipo,
                      {
                        path: 'path' in item ? item.path : undefined,
                        points: 'points' in item ? item.points : undefined,
                        estilo: 'estilo' in item ? item.estilo : item.tipo,
                      }
                    )
                  }
                  style={estiloBotonForma}
                  title={item.nombre}
                >
                  {'path' in item && item.path ? (
                    <svg width="34" height="28" viewBox="0 0 54 50" style={{ background: 'transparent' }}>
                      <path
                        d={item.path}
                        fill={'estilo' in item && item.estilo === 'svg_stroke' ? 'none' : '#e5e7eb'}
                        stroke={'estilo' in item && item.estilo === 'svg_stroke' ? '#e5e7eb' : 'none'}
                        strokeWidth={'estilo' in item && item.estilo === 'svg_stroke' ? 3 : 0}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg width="34" height="28" viewBox="0 0 54 30" style={{ background: 'transparent' }}>
                      <line x1="4" y1="15" x2="48" y2="15" stroke="#e5e7eb" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                  )}
                  <span>{item.nombre}</span>
                </button>
              ))}
            </div>
          </div>

          <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
            <h3>Subir Imagen / Formas PNG</h3>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="tool-btn"
              style={{ width: '100%', marginBottom: '8px' }}
              disabled={cargandoFondo}
            >
              {cargandoFondo ? "Procesando..." : "📤 Subir desde PC"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={subirImagenLocal}
              style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                type="text"
                placeholder="Pegar URL de imagen..."
                value={urlImagen}
                onChange={(e) => setUrlImagen(e.target.value)}
                style={{ flex: 1, padding: '6px', borderRadius: '4px', background: '#1f2937', color: '#f9fafb', border: '1px solid #4b5563', fontSize: '12px' }}
              />
              <button
                onClick={cargarImagenDesdeURL}
                disabled={cargandoUrl}
                style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 10px', cursor: 'pointer', fontSize: '12px' }}
              >
                {cargandoUrl ? "..." : "Cargar"}
              </button>
            </div>
          </div>

          <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
            <h3>Fondo y Textura</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px' }}>Color base:</span>
              <input
                type="color"
                value={colorFondo}
                onChange={(e) => setColorFondo(e.target.value)}
              />
            </div>
            <select
              value={texturaFondo}
              onChange={(e) => setTexturaFondo(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', background: '#1f2937', color: '#f9fafb', border: '1px solid #4b5563', fontSize: '12px' }}
            >
              {TEXTURAS.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
            <h3>Texto y Fuentes</h3>
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', background: '#1f2937', color: '#f9fafb', border: '1px solid #4b5563', marginBottom: '8px' }}
            />

            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', display: 'block' }}>Tamaño: {tamanoTexto}px</label>
              <input
                type="range"
                min="12"
                max="140"
                value={tamanoTexto}
                onChange={(e) => setTamanoTexto(Number(e.target.value))}
                style={{ width: '100%' }}
              />
            </div>

            <select
              value={fuenteTexto}
              onChange={(e) => setFuenteTexto(e.target.value)}
              style={{ width: '100%', padding: '6px', borderRadius: '4px', background: '#1f2937', color: '#f9fafb', border: '1px solid #4b5563', marginBottom: '8px' }}
            >
              {FUENTES_BASE.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
              ))}
              {fuentesPersonalizadas.map((f) => (
                <option key={f.id} value={f.id}>{f.nombre} (Extra)</option>
              ))}
            </select>

            <button
              onClick={() => fontInputRef.current?.click()}
              disabled={subiendoFuente}
              className="tool-btn"
              style={{ width: '100%', marginBottom: '6px' }}
            >
              {subiendoFuente ? "Cargando fuente..." : "+ Subir Fuente (.ttf / .otf)"}
            </button>
            <input
              ref={fontInputRef}
              type="file"
              accept=".ttf,.otf"
              onChange={subirFuente}
              style={{ display: 'none' }}
            />

            <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
              <input
                type="text"
                placeholder="Fuente Google (ej. Poppins)"
                value={nuevaFuenteGoogle}
                onChange={(e) => setNuevaFuenteGoogle(e.target.value)}
                style={{ flex: 1, padding: '6px', borderRadius: '4px', background: '#1f2937', color: '#f9fafb', border: '1px solid #4b5563', fontSize: '12px' }}
              />
              <button
                onClick={agregarFuenteGoogle}
                style={{ background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 8px', cursor: 'pointer', fontSize: '11px' }}
              >
                Agregar
              </button>
            </div>

            <button
              onClick={descargarGuiaFuentes}
              style={{ width: '100%', background: '#4b5563', color: 'white', border: 'none', borderRadius: '4px', padding: '6px', cursor: 'pointer', fontSize: '11px', marginBottom: '10px' }}
            >
              ⬇️ Descargar Guía de Fuentes
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <input
                type="checkbox"
                checked={usarDegradado}
                onChange={(e) => setUsarDegradado(e.target.checked)}
              />
              <span style={{ fontSize: '12px' }}>Usar Degradado</span>
            </div>

            {usarDegradado ? (
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <input type="color" value={colorDegradado1} onChange={(e) => setColorDegradado1(e.target.value)} />
                <input type="color" value={colorDegradado2} onChange={(e) => setColorDegradado2(e.target.value)} />
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px' }}>Color:</span>
                <input type="color" value={colorTexto} onChange={(e) => setColorTexto(e.target.value)} />
              </div>
            )}

            <div style={{ marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', display: 'block' }}>Contorno: {grosorContorno}px</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={colorContorno} onChange={(e) => setColorContorno(e.target.value)} />
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={grosorContorno}
                  onChange={(e) => setGrosorContorno(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', display: 'block' }}>Sombra: {sombraBlur}px</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="color" value={sombraColor} onChange={(e) => setSombraColor(e.target.value)} />
                <input
                  type="range"
                  min="0"
                  max="30"
                  value={sombraBlur}
                  onChange={(e) => setSombraBlur(Number(e.target.value))}
                  style={{ flex: 1 }}
                />
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={sombraOpacidad}
                onChange={(e) => setSombraOpacidad(Number(e.target.value))}
                style={{ width: '100%', marginTop: '4px' }}
              />
            </div>
          </div>

          {seleccionadoId !== null && (
            <div style={{ background: '#374151', padding: '12px', borderRadius: '8px', marginTop: '16px' }}>
              <h3>Elemento Seleccionado</h3>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <button onClick={() => traerAlFrente(seleccionadoId)} className="tool-btn" style={{ flex: 1 }}>⬆️ Frente</button>
                <button onClick={() => enviarAlFondo(seleccionadoId)} className="tool-btn" style={{ flex: 1 }}>⬇️ Fondo</button>
              </div>

              <div style={{ marginBottom: '10px', background: 'rgba(15,23,42,0.45)', padding: '8px', borderRadius: '6px' }}>
                <label style={{ fontSize: '12px', display: 'block', marginBottom: '6px' }}>Tamaño del elemento:</label>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '6px' }}>
                  <button
                    onClick={() => ajustarEscalaSeleccionado(0.8)}
                    style={{ flex: 1, padding: '6px', background: '#475569', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    ➖ Pequeña
                  </button>
                  <button
                    onClick={() => ajustarEscalaSeleccionado(1.25)}
                    style={{ flex: 1, padding: '6px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    ➕ Grande
                  </button>
                </div>
                {formaSeleccionada && (
                  <div>
                    <span style={{ fontSize: '11px', color: '#cbd5e1' }}>
                      Escala: {Math.round((formaSeleccionada.escalaNivel || 1) * 100)}%
                    </span>
                    <input
                      type="range"
                      min="0.25"
                      max="3"
                      step="0.05"
                      value={formaSeleccionada.escalaNivel || 1}
                      onChange={(e) => fijarEscalaExacta(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                  </div>
                )}
              </div>

              {formaSeleccionada && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px' }}>Color:</span>
                  <input
                    type="color"
                    value={formaSeleccionada.stroke || formaSeleccionada.fill || '#0f172a'}
                    onChange={(e) => cambiarColorForma(e.target.value)}
                  />
                </div>
              )}

              {imagenSeleccionada && (
                <div style={{ marginBottom: '8px' }}>
                  <label style={{ fontSize: '12px', display: 'block' }}>
                    Opacidad: {Math.round(imagenSeleccionada.opacity * 100)}%
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={imagenSeleccionada.opacity}
                    onChange={(e) => cambiarOpacidadImagen(Number(e.target.value))}
                    style={{ width: '100%' }}
                  />
                </div>
              )}

              <button
                onClick={borrarSeleccionado}
                style={{ width: '100%', background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', padding: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
              >
                🗑️ Quitar / Borrar Elemento
              </button>
            </div>
          )}
        </aside>

        <section
          className="canvas-area"
          style={{
            backgroundImage: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: 500,
              height: 650,
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: colorFondo,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.45)',
            }}
          >
            <Stage
              ref={stageRef}
              width={500}
              height={650}
              onClick={(e) => {
                if (e.target === e.target.getStage()) {
                  setSeleccionadoId(null);
                }
              }}
            >
              <Layer>
                <Rect width={500} height={650} fill={colorFondo} listening={false} />
                {bgImage && (
                  <KonvaImage
                    image={bgImage}
                    width={500}
                    height={650}
                    opacity={1}
                    imageSmoothingEnabled={false}
                    listening={false}
                  />
                )}
                {renderElementos()}
                <Transformer
                  ref={trRef}
                  rotateEnabled={true}
                  enabledAnchors={['top-left', 'top-right', 'bottom-left', 'bottom-right', 'middle-left', 'middle-right', 'top-center', 'bottom-center']}
                />
              </Layer>
            </Stage>
          </div>
        </section>
      </div>
    </main>
  );
}