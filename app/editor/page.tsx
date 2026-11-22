"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Stage,
  Layer,
  Rect,
  Text,
  Circle,
  Star,
  Image as KonvaImage,
  Transformer,
  Path,
  RegularPolygon,
  Line,
  Arrow,
} from "react-konva";
import Konva from "konva";

const FUENTES_BASE = [
  "Arial", "Georgia", "Impact", "Courier New", "Comic Sans MS",
  "Lobster", "Pacifico", "Dancing Script", "Great Vibes", "Sacramento",
  "Caveat", "Shadows Into Light", "Permanent Marker", "Satisfy", "Allura",
  "Alex Brush", "Tangerine", "Courgette", "Kaushan Script", "Yellowtail",
  "Bebas Neue", "Bungee", "Monoton", "Anton", "Righteous", "Oswald",
  "Cinzel", "Playfair Display", "Abril Fatface", "Alfa Slab One",
  "Fira Code", "Josefin Sans", "Quicksand", "Raleway", "Roboto", "Ubuntu",
  "Indie Flower", "Bangers", "Fredoka One", "Press Start 2P",
];

const TEXTURAS = [
  { id: "none", nombre: "Ninguna" },
  { id: "puntos", nombre: "Hoja de Puntos (Negros)" },
  { id: "cuadricula", nombre: "Cuaderno Cuadriculado" },
  { id: "rayas", nombre: "Hoja Rayada" },
  { id: "periodico", nombre: "Papel Periódico" },
  { id: "kraft", nombre: "Papel Kraft" },
  { id: "lisa", nombre: "Vidrio / Brillo" },
  { id: "suave", nombre: "Ondas Suaves" },
  { id: "aspera", nombre: "Grano / Lija" },
  { id: "rugosa", nombre: "Madera / Corteza" },
  { id: "porosa", nombre: "Ladrillo" },
  { id: "agrietada", nombre: "Tierra Agrietada" },
  { id: "brillante", nombre: "Confeti / Glitter" },
  { id: "geometrica", nombre: "Mosaico Geométrico" },
  { id: "organica", nombre: "Mármol" },
];

const ETIQUETAS_ORNAMENTALES = [
  { id: "etq_vintage_1", nombre: "Etiqueta 1", estilo: "svg_fill", path: "M 10 12 Q 16 6 27 8 Q 38 6 44 12 Q 49 18 46 25 Q 49 32 44 38 Q 38 44 27 42 Q 16 44 10 38 Q 5 32 8 25 Q 5 18 10 12 Z" },
  { id: "etq_sello_2", nombre: "Sello 2", estilo: "svg_fill", path: "M 14 8 Q 20 3 27 7 Q 34 3 40 8 Q 46 11 45 18 Q 50 25 45 32 Q 46 39 40 42 Q 34 47 27 43 Q 20 47 14 42 Q 8 39 9 32 Q 4 25 9 18 Q 8 11 14 8 Z" },
  { id: "etq_escudo_3", nombre: "Escudo 3", estilo: "svg_fill", path: "M 10 7 H 44 V 23 C 44 35 27 45 27 45 C 27 45 10 35 10 23 Z" },
  { id: "etq_escudo_4", nombre: "Escudo 4", estilo: "svg_fill", path: "M 27 5 L 45 11 V 25 C 45 36 27 46 27 46 C 27 46 9 36 9 25 V 11 Z" },
  { id: "etq_placa_5", nombre: "Placa 5", estilo: "svg_fill", path: "M 12 12 L 20 8 H 34 L 42 12 L 48 18 V 32 L 42 38 L 34 42 H 20 L 12 38 L 6 32 V 18 Z" },
  { id: "etq_oval_6", nombre: "Óvalo 6", estilo: "svg_fill", path: "M 27 8 C 41 8 49 15 49 25 C 49 35 41 42 27 42 C 13 42 5 35 5 25 C 5 15 13 8 27 8 Z" },
  { id: "etq_marco_7", nombre: "Marco 7", estilo: "svg_fill", path: "M 8 14 C 14 14 14 8 20 8 H 34 C 40 8 40 14 46 14 V 36 C 40 36 40 42 34 42 H 20 C 14 42 14 36 8 36 Z" },
  { id: "etq_tag_8", nombre: "Tag 8", estilo: "svg_fill", path: "M 16 6 H 38 L 46 14 V 44 H 8 V 14 Z M 27 10 A 3 3 0 1 0 27 16 A 3 3 0 1 0 27 10 Z" },
  { id: "etq_nube_9", nombre: "Nube 9", estilo: "svg_fill", path: "M 14 38 H 40 A 9 9 0 0 0 42 20 A 11 11 0 0 0 21 13 A 10 10 0 0 0 12 22 A 8 8 0 0 0 14 38 Z" },
  { id: "etq_cinta_10", nombre: "Cinta 10", estilo: "svg_fill", path: "M 5 15 H 49 L 43 25 L 49 35 H 5 L 11 25 Z" },
  { id: "etq_hex_11", nombre: "Hexágono 11", estilo: "svg_fill", path: "M 15 9 H 39 L 49 25 L 39 41 H 15 L 5 25 Z" },
  { id: "etq_diam_12", nombre: "Rombo 12", estilo: "svg_fill", path: "M 27 5 L 48 25 L 27 45 L 6 25 Z" },
];

const FORMAS_BASICAS = [
  { id: "circulo", nombre: "Círculo", tipo: "circulo", estilo: "relleno" },
  { id: "cuadrado", nombre: "Cuadrado", tipo: "cuadrado", estilo: "relleno" },
  { id: "triangulo", nombre: "Triángulo", tipo: "triangulo", estilo: "relleno" },
  { id: "rombo", nombre: "Rombo", tipo: "rombo", estilo: "relleno" },
  { id: "estrella", nombre: "Estrella", tipo: "estrella", estilo: "relleno" },
  { id: "corazon", nombre: "Corazón", tipo: "corazon", estilo: "relleno" },
];

const FORMAS_CATALOGO: Record<string, any[]> = {
  basicas: FORMAS_BASICAS,
  etiquetas: ETIQUETAS_ORNAMENTALES,
  lineas: [
    { id: "linea_diag", nombre: "Diagonal", tipo: "linea", points: [8, 8, 88, 88], estilo: "svg_stroke" },
    { id: "flecha_diag", nombre: "Flecha diag.", tipo: "flecha", points: [8, 8, 88, 88], estilo: "svg_stroke" },
    { id: "flecha_doble_diag", nombre: "Doble flecha", tipo: "flecha_doble", points: [10, 10, 86, 86], estilo: "svg_stroke" },
    { id: "paso_codo", nombre: "Paso codo", tipo: "svg_stroke", path: "M 8 14 H 46 V 76 H 86", estilo: "svg_stroke" },
    { id: "paso_flecha", nombre: "Paso flecha", tipo: "svg_stroke", path: "M 8 14 H 46 V 76 H 84 M 76 68 L 84 76 L 76 84", estilo: "svg_stroke" },
    { id: "paso_doble_flecha", nombre: "Paso doble", tipo: "svg_stroke", path: "M 14 14 H 46 V 76 H 84 M 22 6 L 14 14 L 22 22 M 76 68 L 84 76 L 76 84", estilo: "svg_stroke" },
    { id: "curva_s", nombre: "Curva S", tipo: "svg_stroke", path: "M 24 18 H 64 C 76 18 76 44 64 44 H 34 C 22 44 22 72 34 72 H 74", estilo: "svg_stroke" },
    { id: "curva_s_flecha", nombre: "S flecha", tipo: "svg_stroke", path: "M 24 18 H 64 C 76 18 76 44 64 44 H 34 C 22 44 22 72 34 72 H 76 M 68 64 L 76 72 L 68 80", estilo: "svg_stroke" },
    { id: "curva_s_doble", nombre: "S doble", tipo: "svg_stroke", path: "M 26 18 H 64 C 76 18 76 44 64 44 H 34 C 22 44 22 72 34 72 H 76 M 34 10 L 26 18 L 34 26 M 68 64 L 76 72 L 68 80", estilo: "svg_stroke" },
    { id: "onda_suave", nombre: "Onda", tipo: "svg_stroke", path: "M 10 56 C 24 22 44 22 52 50 C 60 78 78 74 90 42", estilo: "svg_stroke" },
    { id: "codo_llamada", nombre: "Gancho", tipo: "svg_stroke", path: "M 12 72 H 58 C 70 72 74 62 66 54 C 58 46 48 54 54 62 C 60 70 78 62 78 38 C 78 24 66 18 54 24", estilo: "svg_stroke" },
    { id: "lazo_libre", nombre: "Lazo", tipo: "svg_stroke", path: "M 14 28 C 28 14 42 48 28 54 C 16 58 24 34 44 42 C 62 50 56 80 72 76 C 84 72 82 54 90 48", estilo: "svg_stroke" },
    { id: "arco_cuarto", nombre: "Arco", tipo: "svg_stroke", path: "M 12 22 C 54 22 82 50 82 86", estilo: "svg_stroke" },
    { id: "corchetes_abiertos", nombre: "[ ]", tipo: "svg_stroke", path: "M 26 18 H 14 V 80 H 26 M 70 18 H 82 V 80 H 70", estilo: "svg_stroke" },
    { id: "llaves_abiertas", nombre: "{ }", tipo: "svg_stroke", path: "M 32 18 C 22 18 22 44 12 49 C 22 54 22 80 32 80 M 64 18 C 74 18 74 44 84 49 C 74 54 74 80 64 80", estilo: "svg_stroke" },
    { id: "corchete_izq", nombre: "[", tipo: "svg_stroke", path: "M 28 18 H 16 V 80 H 28", estilo: "svg_stroke" },
    { id: "corchete_der", nombre: "]", tipo: "svg_stroke", path: "M 68 18 H 80 V 80 H 68", estilo: "svg_stroke" },
    { id: "llave_izq_sola", nombre: "{", tipo: "svg_stroke", path: "M 34 18 C 24 18 24 44 14 49 C 24 54 24 80 34 80", estilo: "svg_stroke" },
    { id: "llave_der_sola", nombre: "}", tipo: "svg_stroke", path: "M 62 18 C 72 18 72 44 82 49 C 72 54 72 80 62 80", estilo: "svg_stroke" },
  ],
  flechas: [
    { id: "arrow_right", nombre: "Derecha", tipo: "svg_fill", path: "M 5 18 L 35 18 L 35 8 L 55 25 L 35 42 L 35 32 L 5 32 Z", estilo: "svg_fill" },
    { id: "arrow_left", nombre: "Izquierda", tipo: "svg_fill", path: "M 55 18 L 25 18 L 25 8 L 5 25 L 25 42 L 25 32 L 55 32 Z", estilo: "svg_fill" },
    { id: "arrow_up", nombre: "Arriba", tipo: "svg_fill", path: "M 22 45 L 22 22 L 10 22 L 28 5 L 46 22 L 34 22 L 34 45 Z", estilo: "svg_fill" },
    { id: "arrow_down", nombre: "Abajo", tipo: "svg_fill", path: "M 22 5 L 22 28 L 10 28 L 28 45 L 46 28 L 34 28 L 34 5 Z", estilo: "svg_fill" },
    { id: "arrow_curved", nombre: "Curva", tipo: "svg_fill", path: "M 8 40 Q 22 10 44 18 L 40 8 L 55 22 L 38 32 L 42 23 Q 22 18 8 40 Z", estilo: "svg_fill" },
  ],
  llamadas: [
    { id: "bocadillo_rect", nombre: "Bocadillo", tipo: "svg_fill", path: "M 6 6 H 48 V 34 H 24 L 14 46 V 34 H 6 Z", estilo: "svg_fill" },
    { id: "bocadillo_oval", nombre: "Óvalo", tipo: "svg_fill", path: "M 28 6 C 14 6 5 14 5 23 C 5 29 9 34 15 36 L 10 46 L 22 38 C 24 38 26 39 28 39 C 42 39 51 31 51 23 C 51 14 42 6 28 6 Z", estilo: "svg_fill" },
    { id: "nube_pensar", nombre: "Pensar", tipo: "svg_fill", path: "M 16 32 A 9 9 0 1 1 19 15 A 12 12 0 0 1 41 16 A 9 9 0 1 1 38 33 Z M 12 40 A 4 4 0 1 0 12 41 M 7 45 A 2.5 2.5 0 1 0 7 46", estilo: "svg_fill" },
    { id: "nota_esquina", nombre: "Nota", tipo: "svg_fill", path: "M 8 6 H 38 L 48 16 V 44 H 8 Z M 38 6 V 16 H 48", estilo: "svg_fill" },
  ],
  simbolos: [
    { id: "mas", nombre: "Más", tipo: "svg_fill", path: "M 20 8 H 30 V 20 H 42 V 30 H 30 V 42 H 20 V 30 H 8 V 20 H 20 Z", estilo: "svg_fill" },
    { id: "menos", nombre: "Menos", tipo: "svg_fill", path: "M 8 20 H 42 V 30 H 8 Z", estilo: "svg_fill" },
    { id: "equis", nombre: "Equis", tipo: "svg_fill", path: "M 12 8 L 25 21 L 38 8 L 43 13 L 30 26 L 43 39 L 38 44 L 25 31 L 12 44 L 7 39 L 20 26 L 7 13 Z", estilo: "svg_fill" },
    { id: "corazon_svg", nombre: "Corazón", tipo: "svg_fill", path: "M 25 44 C 25 44 5 28 5 15 C 5 8 11 5 17 5 C 21 5 24 8 25 11 C 26 8 29 5 33 5 C 39 5 45 8 45 15 C 45 28 25 44 25 44 Z", estilo: "svg_fill" },
    { id: "rayo", nombre: "Rayo", tipo: "svg_fill", path: "M 30 4 L 12 27 H 24 L 20 46 L 38 22 H 26 Z", estilo: "svg_fill" },
    { id: "sol", nombre: "Sol", tipo: "svg_stroke", path: "M 25 14 A 11 11 0 1 0 25 36 A 11 11 0 1 0 25 14 Z M 25 3 V 9 M 25 41 V 47 M 3 25 H 9 M 41 25 H 47 M 9 9 L 14 14 M 36 36 L 41 41 M 41 9 L 36 14 M 14 36 L 9 41", estilo: "svg_stroke" },
    { id: "luna", nombre: "Luna", tipo: "svg_fill", path: "M 36 36 A 16 16 0 1 1 24 8 A 13 13 0 0 0 36 36 Z", estilo: "svg_fill" },
  ],
  diagrama: [
    { id: "proceso", nombre: "Proceso", tipo: "svg_stroke", path: "M 8 12 H 46 V 38 H 8 Z", estilo: "svg_stroke" },
    { id: "redondeado", nombre: "Terminal", tipo: "svg_stroke", path: "M 16 12 H 38 A 13 13 0 0 1 38 38 H 16 A 13 13 0 0 1 16 12 Z", estilo: "svg_stroke" },
    { id: "decision", nombre: "Decisión", tipo: "svg_stroke", path: "M 27 6 L 48 25 L 27 44 L 6 25 Z", estilo: "svg_stroke" },
    { id: "datos", nombre: "Datos", tipo: "svg_stroke", path: "M 15 12 H 48 L 39 38 H 6 Z", estilo: "svg_stroke" },
    { id: "documento", nombre: "Documento", tipo: "svg_stroke", path: "M 8 10 H 46 V 36 Q 36 30 27 36 T 8 36 Z", estilo: "svg_stroke" },
    { id: "hexagono", nombre: "Hexágono", tipo: "svg_stroke", path: "M 15 10 H 39 L 49 25 L 39 40 H 15 L 5 25 Z", estilo: "svg_stroke" },
  ],
};

const getHeartPath = () =>
  "M 50 30 C 50 30 50 0 25 0 C 0 0 0 30 25 50 C 50 70 50 100 50 100 C 50 100 50 70 75 50 C 100 30 100 0 75 0 C 50 0 50 30 50 30 Z";

function escalarPathSvg(pathStr: string, factor: number): string {
  if (!pathStr || factor === 1) return pathStr;
  return pathStr.replace(/-?\d+(\.\d+)?/g, (numStr) => {
    const val = parseFloat(numStr) * factor;
    return String(Number(val.toFixed(2)));
  });
}

function generarTexturaNitida(tipoId: string, colorBase: string): HTMLImageElement | null {
  if (tipoId === "none") return null;

  const scale = typeof window !== "undefined" ? Math.max(1, window.devicePixelRatio || 1) : 1;
  const canvas = document.createElement("canvas");
  canvas.width = 500 * scale;
  canvas.height = 650 * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.scale(scale, scale);
  ctx.imageSmoothingEnabled = false;

  const base = colorBase && colorBase !== "transparent" ? colorBase : "#ffffff";
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 500, 650);

  if (tipoId === "puntos") {
    ctx.fillStyle = "#000000";
    for (let y = 16; y < 650; y += 22) {
      for (let x = 16; x < 500; x += 22) {
        ctx.beginPath();
        ctx.arc(x, y, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (tipoId === "cuadricula") {
    ctx.strokeStyle = "rgba(15, 23, 42, 0.25)";
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
  } else if (tipoId === "rayas") {
    ctx.strokeStyle = "rgba(37, 99, 235, 0.28)";
    ctx.lineWidth = 1.2;
    for (let y = 32; y < 650; y += 28) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(500, y);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(220, 38, 38, 0.35)";
    ctx.beginPath();
    ctx.moveTo(45, 0);
    ctx.lineTo(45, 650);
    ctx.stroke();
  } else if (tipoId === "periodico") {
    ctx.fillStyle = "#f3ebd8";
    ctx.fillRect(0, 0, 500, 650);
    ctx.strokeStyle = "rgba(30, 41, 59, 0.28)";
    ctx.lineWidth = 1;
    for (let y = 24; y < 640; y += 16) {
      ctx.beginPath();
      ctx.moveTo(24, y);
      ctx.lineTo(476, y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(15, 23, 42, 0.38)";
    ctx.font = "bold 14px Georgia, serif";
    ctx.fillText("EDICIÓN ESPECIAL • CRÓNICA & DISEÑO", 24, 18);
  } else if (tipoId === "kraft") {
    ctx.fillStyle = "#d4b483";
    ctx.fillRect(0, 0, 500, 650);
    for (let i = 0; i < 3500; i++) {
      const x = (i * 89) % 500;
      const y = (i * 151) % 650;
      ctx.fillStyle = i % 2 === 0 ? "rgba(92, 58, 22, 0.25)" : "rgba(255, 248, 220, 0.25)";
      ctx.fillRect(x, y, 2, 1.5);
    }
  } else if (tipoId === "lisa") {
    const grad = ctx.createLinearGradient(0, 0, 500, 650);
    grad.addColorStop(0, "#e0f2fe");
    grad.addColorStop(0.5, "#ffffff");
    grad.addColorStop(1, "#bae6fd");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 500, 650);
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.moveTo(60, 0);
    ctx.lineTo(170, 0);
    ctx.lineTo(70, 650);
    ctx.lineTo(-40, 650);
    ctx.closePath();
    ctx.fill();
  } else if (tipoId === "suave") {
    for (let y = 0; y < 650; y += 4) {
      ctx.strokeStyle = y % 8 === 0 ? "rgba(244, 114, 182, 0.26)" : "rgba(148, 163, 184, 0.28)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(160, y - 10, 340, y + 10, 500, y);
      ctx.stroke();
    }
  } else if (tipoId === "aspera") {
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(0, 0, 500, 650);
    for (let i = 0; i < 4500; i++) {
      const x = (i * 73) % 500;
      const y = (i * 137) % 650;
      ctx.fillStyle = i % 2 === 0 ? "rgba(15, 23, 42, 0.45)" : "rgba(255, 255, 255, 0.65)";
      ctx.fillRect(x, y, 2, 2);
    }
  } else if (tipoId === "rugosa") {
    ctx.fillStyle = "#e7dcc8";
    ctx.fillRect(0, 0, 500, 650);
    ctx.strokeStyle = "rgba(69, 39, 18, 0.45)";
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
  } else if (tipoId === "porosa") {
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, 0, 500, 650);
    const altoFila = 32;
    const anchoLad = 64;
    ctx.strokeStyle = "rgba(185, 28, 28, 0.45)";
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
  } else if (tipoId === "agrietada") {
    ctx.fillStyle = "#efe3cf";
    ctx.fillRect(0, 0, 500, 650);
    ctx.strokeStyle = "rgba(92, 64, 34, 0.55)";
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
  } else if (tipoId === "brillante") {
    ctx.fillStyle = "#fdf2f8";
    ctx.fillRect(0, 0, 500, 650);
    const colores = ["#f43f5e", "#ec4899", "#a855f7", "#06b6d4", "#facc15", "#334155"];
    for (let i = 0; i < 650; i++) {
      const x = (i * 97) % 500;
      const y = (i * 193) % 650;
      ctx.fillStyle = colores[i % colores.length];
      ctx.beginPath();
      ctx.arc(x, y, i % 3 === 0 ? 2.4 : 1.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (tipoId === "geometrica") {
    const tam = 50;
    const paleta = ["#e0f2fe", "#fef3c7", "#fce7f3", "#dcfce7", "#ede9fe"];
    for (let y = 0; y < 650; y += tam) {
      for (let x = 0; x < 500; x += tam) {
        const idx = ((x / tam) + (y / tam)) % paleta.length;
        ctx.fillStyle = paleta[idx];
        ctx.fillRect(x, y, tam, tam);

        ctx.strokeStyle = "rgba(30, 41, 59, 0.35)";
        ctx.lineWidth = 1.5;
        ctx.strokeRect(x, y, tam, tam);

        ctx.fillStyle = "rgba(30, 41, 59, 0.18)";
        ctx.beginPath();
        ctx.moveTo(x + tam / 2, y);
        ctx.lineTo(x + tam, y + tam / 2);
        ctx.lineTo(x + tam / 2, y + tam);
        ctx.lineTo(x, y + tam / 2);
        ctx.closePath();
        ctx.fill();
      }
    }
  } else if (tipoId === "organica") {
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, 500, 650);
    ctx.strokeStyle = "rgba(71, 85, 105, 0.38)";
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

  const [capas, setCapas] = useState<{ id: number; tipo: "texto" | "forma" | "imagen" }[]>([
    { id: 999, tipo: "texto" },
  ]);

  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);
  const [urlImagen, setUrlImagen] = useState("");

  const [fuentesPersonalizadas, setFuentesPersonalizadas] = useState<{ id: string; nombre: string; url?: string }[]>([]);
  const [nuevaFuenteGoogle, setNuevaFuenteGoogle] = useState("");

  const [mensajeGuardado, setMensajeGuardado] = useState("");
  const [cargandoFondo, setCargandoFondo] = useState(false);
  const [subiendoFuente, setSubiendoFuente] = useState(false);
  const [cargandoUrl, setCargandoUrl] = useState(false);

  const [categoriaFormas, setCategoriaFormas] = useState<
    "basicas" | "etiquetas" | "lineas" | "flechas" | "llamadas" | "simbolos" | "diagrama"
  >("lineas");

  const [mostrarDisenos, setMostrarDisenos] = useState(false);
  const [disenosGuardados, setDisenosGuardados] = useState<any[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fontInputRef = useRef<HTMLInputElement>(null);
  const trRef = useRef<any>(null);
  const stageRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Konva.pixelRatio = Math.max(1, window.devicePixelRatio || 1);
    }
    const versionActual = "v3";
    const versionGuardada = localStorage.getItem("versionFuentes");
    if (versionGuardada !== versionActual) {
      localStorage.removeItem("misFuentesLocales");
      localStorage.setItem("versionFuentes", versionActual);
      window.location.reload();
    }

    const guardados = JSON.parse(localStorage.getItem("misDiseños") || "[]");
    setDisenosGuardados(guardados);
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Lobster&family=Pacifico&family=Dancing+Script:wght@700&family=Great+Vibes&family=Sacramento&family=Caveat:wght@700&family=Shadows+Into+Light&family=Permanent+Marker&family=Satisfy&family=Allura&family=Alex+Brush&family=Tangerine&family=Courgette&family=Kaushan+Script&family=Yellowtail&family=Bebas+Neue&family=Bungee&family=Monoton&family=Anton&family=Righteous&family=Oswald&family=Cinzel:wght@700&family=Playfair+Display&family=Abril+Fatface&family=Alfa+Slab+One&family=Fira+Code&family=Josefin+Sans&family=Quicksand&family=Raleway&family=Roboto&family=Ubuntu&family=Indie+Flower&family=Bangers&family=Fredoka+One&family=Press+Start+2P&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  useEffect(() => {
    const cargarFuentesGuardadas = async () => {
      const fuentesLocales = JSON.parse(localStorage.getItem("misFuentesLocales") || "[]");
      for (const fuente of fuentesLocales) {
        try {
          if (fuente.url) {
            const fontFace = new FontFace(fuente.id, `url(${fuente.url})`);
            await fontFace.load();
            document.fonts.add(fontFace);
          }
          setFuentesPersonalizadas((prev) => {
            if (!prev.find((f) => f.id === fuente.id)) return [...prev, fuente];
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
  }, [seleccionadoId, capas, formas, imagenes, textoPos.x, textoPos.y, tamanoTexto, texto]);

  const registrarCapa = (id: number, tipo: "texto" | "forma" | "imagen") => {
    setCapas((prev) => {
      if (prev.some((c) => c.id === id)) return prev;
      return [...prev, { id, tipo }];
    });
  };

  const agregarForma = (tipo: string, extra?: { path?: string; points?: number[]; estilo?: string }) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const estiloFinal =
      extra?.estilo ||
      (tipo === "linea" || tipo === "flecha" || tipo === "flecha_doble" ? "svg_stroke" : "relleno");

    const colorInicial =
      estiloFinal === "svg_stroke"
        ? "#0f172a"
        : tipo === "circulo"
        ? "#3b82f6"
        : tipo === "cuadrado"
        ? "#ef4444"
        : tipo === "corazon" || tipo === "corazon_svg"
        ? "#ec4899"
        : tipo === "destello"
        ? "#06b6d4"
        : tipo === "triangulo"
        ? "#8b5cf6"
        : tipo === "rombo"
        ? "#f43f5e"
        : tipo === "estrella"
        ? "#f59e0b"
        : "#0f172a";

    const escalaInicial = estiloFinal === "svg_stroke" ? 1.1 : 1.4;

    const nuevaForma = {
      id,
      tipo,
      x: 160,
      y: 170,
      fill: estiloFinal === "svg_stroke" ? "transparent" : colorInicial,
      stroke: colorInicial,
      path: extra?.path ? escalarPathSvg(extra.path, escalaInicial) : undefined,
      points: Array.isArray(extra?.points)
        ? extra.points.map((p) => Number((p * escalaInicial).toFixed(2)))
        : undefined,
      radius: tipo === "circulo" ? 38 : tipo === "triangulo" || tipo === "rombo" ? 40 : undefined,
      width: tipo === "cuadrado" ? 80 : undefined,
      height: tipo === "cuadrado" ? 80 : undefined,
      estilo: estiloFinal,
      strokeWidth: estiloFinal === "svg_stroke" ? 3.5 : 2,
      escalaNivel: 1,
    };

    setFormas((prev) => [...prev, nuevaForma]);
    registrarCapa(id, "forma");
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
    e.target.value = "";
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
        filtro: "none",
      };

      setImagenes((prev) => [...prev, nuevaImagen]);
      registrarCapa(id, "imagen");
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
        id,
        image: img,
        x: 200,
        y: 200,
        width: 200,
        height: 200 * (img.height / img.width),
        opacity: 1,
        filtro: quitarFondo ? "removeBg" : "none",
      };
      setImagenes((prev) => [...prev, nuevaImagen]);
      registrarCapa(id, "imagen");
      setSeleccionadoId(id);
    };
  };

  const subirFuente = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (/\.zip$/i.test(file.name)) {
      alert("El archivo es un .zip. Extrae primero la carpeta y selecciona el archivo .ttf o .otf.");
      e.target.value = "";
      return;
    }

    setSubiendoFuente(true);
    const idFuente = `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const nombreArchivo = file.name.replace(/\.(ttf|otf|woff2|woff)$/i, "");
    const nombreLimpio = nuevaFuenteGoogle.trim() || nombreArchivo;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;

      try {
        const fontFace = new FontFace(idFuente, `url(${base64Data})`);
        await fontFace.load();
        document.fonts.add(fontFace);

        const nuevaFuente = { id: idFuente, nombre: nombreLimpio, url: base64Data };

        setFuentesPersonalizadas((prev) => [...prev, nuevaFuente]);
        setFuenteTexto(idFuente);
        setNuevaFuenteGoogle("");

        const fuentesGuardadas = JSON.parse(localStorage.getItem("misFuentesLocales") || "[]");
        fuentesGuardadas.push(nuevaFuente);
        localStorage.setItem("misFuentesLocales", JSON.stringify(fuentesGuardadas));

        alert(`¡Fuente "${nombreLimpio}" lista y guardada en tu navegador! 🎉`);
      } catch (error) {
        alert("No se pudo cargar la fuente. Asegúrate de elegir un archivo .ttf, .otf, .woff o .woff2 válido.");
        console.error(error);
      } finally {
        setSubiendoFuente(false);
        e.target.value = "";
      }
    };
    reader.readAsDataURL(file);
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
    setFormas((prev) => prev.filter((f) => f.id !== idABorrar));
    setImagenes((prev) => prev.filter((i) => i.id !== idABorrar));
    setCapas((prev) => prev.filter((c) => c.id !== idABorrar));
    setSeleccionadoId(null);
  };

  const cambiarColorForma = (nuevoColor: string) => {
    if (seleccionadoId === null) return;
    setFormas((prev) =>
      prev.map((f) => {
        if (f.id !== seleccionadoId) return f;
        return {
          ...f,
          fill: f.estilo === "svg_stroke" ? "transparent" : nuevoColor,
          stroke: nuevoColor,
        };
      })
    );
  };

  const aplicarFactorAForma = (forma: any, factor: number, nuevaEscalaNivel?: number) => {
    const nivelFinal =
      nuevaEscalaNivel !== undefined
        ? nuevaEscalaNivel
        : Math.max(0.25, Math.min(3.5, Number(((forma.escalaNivel || 1) * factor).toFixed(2))));

    return {
      ...forma,
      escalaNivel: nivelFinal,
      points: Array.isArray(forma.points)
        ? forma.points.map((pt: number) => Number((pt * factor).toFixed(2)))
        : undefined,
      path: forma.path ? escalarPathSvg(forma.path, factor) : undefined,
      radius:
        typeof forma.radius === "number"
          ? Math.max(8, Math.min(240, Number((forma.radius * factor).toFixed(2))))
          : undefined,
      width:
        typeof forma.width === "number"
          ? Math.max(12, Math.min(400, Number((forma.width * factor).toFixed(2))))
          : undefined,
      height:
        typeof forma.height === "number"
          ? Math.max(12, Math.min(400, Number((forma.height * factor).toFixed(2))))
          : undefined,
    };
  };

  const ajustarEscalaSeleccionado = (factor: number) => {
    if (seleccionadoId === null) return;
    if (seleccionadoId === 999) {
      setTamanoTexto((prev) => Math.max(12, Math.min(180, Math.round(prev * factor))));
      return;
    }
    const forma = formas.find((f) => f.id === seleccionadoId);
    if (forma) {
      setFormas((prev) => prev.map((f) => (f.id === seleccionadoId ? aplicarFactorAForma(f, factor) : f)));
      return;
    }
    const img = imagenes.find((i) => i.id === seleccionadoId);
    if (img) {
      setImagenes((prev) =>
        prev.map((i) => {
          if (i.id !== seleccionadoId) return i;
          return {
            ...i,
            width: Math.max(20, Math.min(480, Math.round(i.width * factor))),
            height: Math.max(20, Math.min(620, Math.round(i.height * factor))),
          };
        })
      );
    }
  };

  const cambiarOpacidadImagen = (nuevaOpacidad: number) => {
    setImagenes((prev) => prev.map((i) => (i.id === seleccionadoId ? { ...i, opacity: nuevaOpacidad } : i)));
  };

  const traerAlFrente = (id: number) => {
    setCapas((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
      if (idx === -1) return prev;
      const item = prev[idx];
      const sinItem = [...prev.slice(0, idx), ...prev.slice(idx + 1)];
      return [...sinItem, item];
    });
  };

  const enviarAlFondo = (id: number) => {
    setCapas((prev) => {
      const idx = prev.findIndex((c) => c.id === id);
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
      nombre: `Cartel ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      texto,
      colorTexto,
      tamanoTexto,
      fuenteTexto,
      textoPos,
      usarDegradado,
      colorDegradado1,
      colorDegradado2,
      colorContorno,
      grosorContorno,
      sombraColor,
      sombraBlur,
      sombraOpacidad,
      colorFondo,
      texturaFondo,
      formas: formas.map((f) => ({
        ...f,
        points: Array.isArray(f.points) ? [...f.points] : undefined,
      })),
      capas: [...capas],
    };

    const guardados = JSON.parse(localStorage.getItem("misDiseños") || "[]");
    const actualizados = [diseño, ...guardados];
    localStorage.setItem("misDiseños", JSON.stringify(actualizados));
    setDisenosGuardados(actualizados);

    setTimeout(() => {
      setMensajeGuardado("¡Guardado en tu navegador! ✅");
      setTimeout(() => setMensajeGuardado(""), 2000);
    }, 400);
  };

  const cargarDiseñoGuardado = (diseno: any) => {
    if (!diseno) return;
    setTexto(diseno.texto ?? "mi cartel");
    setColorTexto(diseno.colorTexto ?? "#0f172a");
    setTamanoTexto(diseno.tamanoTexto ?? 40);
    setFuenteTexto(diseno.fuenteTexto ?? "Arial");
    setTextoPos(diseno.textoPos ?? { x: 100, y: 300 });
    setUsarDegradado(Boolean(diseno.usarDegradado));
    setColorDegradado1(diseno.colorDegradado1 ?? "#FF007F");
    setColorDegradado2(diseno.colorDegradado2 ?? "#00F0FF");
    setColorContorno(diseno.colorContorno ?? "#ffffff");
    setGrosorContorno(diseno.grosorContorno ?? 0);
    setSombraColor(diseno.sombraColor ?? "#000000");
    setSombraBlur(diseno.sombraBlur ?? 0);
    setSombraOpacidad(diseno.sombraOpacidad ?? 0.5);
    setColorFondo(diseno.colorFondo ?? "#ffffff");
    setTexturaFondo(diseno.texturaFondo ?? "none");
    setFormas(Array.isArray(diseno.formas) ? diseno.formas : []);
    setCapas(Array.isArray(diseno.capas) ? diseno.capas : [{ id: 999, tipo: "texto" }]);
    setSeleccionadoId(null);
    setMostrarDisenos(false);
  };

  const eliminarDisenoGuardado = (id: number) => {
    const filtrados = disenosGuardados.filter((d) => d.id !== id);
    localStorage.setItem("misDiseños", JSON.stringify(filtrados));
    setDisenosGuardados(filtrados);
  };

  const descargarImagen = () => {
    if (!stageRef.current) return;
    const prevSel = seleccionadoId;
    setSeleccionadoId(null);
    setTimeout(() => {
      if (!stageRef.current) return;
      const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
      const link = document.createElement("a");
      link.download = `mini-canva-${Date.now()}.png`;
      link.href = uri;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      if (prevSel !== null) setSeleccionadoId(prevSel);
    }, 80);
  };

  const manejarTransformForma = (e: any, forma: any) => {
  const node = e.target;
  const rawScaleX = node.scaleX() || 1;
  const rawScaleY = node.scaleY() || 1;
  const nx = node.x();
  const ny = node.y();

  if (forma.tipo === "circulo") {
    const factor = Math.max(0.15, Math.min(8, Number(((Math.abs(rawScaleX) + Math.abs(rawScaleY)) / 2).toFixed(3))));
    node.scaleX(1);
    node.scaleY(1);
    setFormas((prev) =>
      prev.map((f) => {
        if (f.id !== forma.id) return f;
        return {
          ...f,
          x: nx,
          y: ny,
          radius: Math.max(8, Math.min(400, Number(((f.radius || 38) * factor).toFixed(2)))),
          escalaNivel: Math.max(0.15, Math.min(8, Number(((f.escalaNivel || 1) * factor).toFixed(2)))),
        };
      })
    );
    return;
  }

  if (forma.tipo === "cuadrado") {
    const baseW = forma.width || 80;
    const baseH = forma.height || 80;
    const signoX = rawScaleX < 0 ? -1 : 1;
    const signoY = rawScaleY < 0 ? -1 : 1;
    node.scaleX(1);
    node.scaleY(1);
    setFormas((prev) =>
      prev.map((f) => {
        if (f.id !== forma.id) return f;
        return {
          ...f,
          x: nx,
          y: ny,
          width: Math.max(12, Math.min(800, Number((baseW * Math.abs(rawScaleX)).toFixed(2)))),
          height: Math.max(12, Math.min(800, Number((baseH * Math.abs(rawScaleY)).toFixed(2)))),
          scaleX: signoX,
          scaleY: signoY,
        };
      })
    );
    return;
  }

  if (forma.tipo === "triangulo" || forma.tipo === "rombo") {
    const factor = Math.max(0.15, Math.min(8, Number(((Math.abs(rawScaleX) + Math.abs(rawScaleY)) / 2).toFixed(3))));
    node.scaleX(1);
    node.scaleY(1);
    setFormas((prev) =>
      prev.map((f) => {
        if (f.id !== forma.id) return f;
        return {
          ...f,
          x: nx,
          y: ny,
          radius: Math.max(8, Math.min(400, Number(((f.radius || 40) * factor).toFixed(2)))),
          escalaNivel: Math.max(0.15, Math.min(8, Number(((f.escalaNivel || 1) * factor).toFixed(2)))),
        };
      })
    );
    return;
  }

  const nextScaleX = Number(rawScaleX.toFixed(4));
  const nextScaleY = Number(rawScaleY.toFixed(4));

  setFormas((prev) =>
    prev.map((f) => {
      if (f.id !== forma.id) return f;
      return {
        ...f,
        x: nx,
        y: ny,
        scaleX: nextScaleX,
        scaleY: nextScaleY,
        escalaNivel: Number(((Math.abs(nextScaleX) + Math.abs(nextScaleY)) / 2).toFixed(2)),
      };
    })
  );
};

const renderFormaEnLienzo = (forma: any) => {
  const usaEscalaDirecta =
    forma.tipo === "corazon" ||
    forma.tipo === "estrella" ||
    forma.tipo === "linea" ||
    forma.tipo === "flecha" ||
    forma.tipo === "flecha_doble" ||
    Boolean(forma.path);

  const commonProps = {
    id: `elem-${forma.id}`,
    x: forma.x,
    y: forma.y,
    ...(usaEscalaDirecta
      ? {
          scaleX: forma.scaleX || 1,
          scaleY: forma.scaleY || 1,
        }
      : {
          scaleX: forma.scaleX || 1,
          scaleY: forma.scaleY || 1,
        }),
    draggable: true,
    onClick: () => setSeleccionadoId(forma.id),
    onTap: () => setSeleccionadoId(forma.id),
    onDragEnd: (e: any) => {
      const nx = e.target.x();
      const ny = e.target.y();
      setFormas((prev) => prev.map((f) => (f.id === forma.id ? { ...f, x: nx, y: ny } : f)));
    },
    onTransformEnd: (e: any) => manejarTransformForma(e, forma),
  };

  if (forma.tipo === "circulo") {
    return <Circle {...commonProps} radius={forma.radius || 38} fill={forma.fill} stroke={forma.stroke} strokeWidth={forma.strokeWidth || 2} />;
  }
  if (forma.tipo === "cuadrado") {
    return <Rect {...commonProps} width={forma.width || 80} height={forma.height || 80} fill={forma.fill} stroke={forma.stroke} strokeWidth={forma.strokeWidth || 2} cornerRadius={6} />;
  }
  if (forma.tipo === "triangulo") {
    return <RegularPolygon {...commonProps} sides={3} radius={forma.radius || 40} fill={forma.fill} stroke={forma.stroke} strokeWidth={forma.strokeWidth || 2} />;
  }
  if (forma.tipo === "rombo") {
    return <RegularPolygon {...commonProps} sides={4} radius={forma.radius || 40} fill={forma.fill} stroke={forma.stroke} strokeWidth={forma.strokeWidth || 2} />;
  }
  if (forma.tipo === "estrella") {
    return <Star {...commonProps} numPoints={5} innerRadius={22} outerRadius={44} fill={forma.fill} stroke={forma.stroke} strokeWidth={forma.strokeWidth || 2} />;
  }
  if (forma.tipo === "corazon") {
    return <Path key={forma.id} {...commonProps} data={escalarPathSvg(getHeartPath(), 0.75)} fill={forma.fill} stroke={forma.stroke} strokeWidth={forma.strokeWidth || 2} />;
  }
  if (forma.tipo === "linea" && Array.isArray(forma.points)) {
    return <Line {...commonProps} points={forma.points} stroke={forma.stroke || "#0f172a"} strokeWidth={forma.strokeWidth || 4} lineCap="round" lineJoin="round" />;
  }
  if ((forma.tipo === "flecha" || forma.tipo === "flecha_doble") && Array.isArray(forma.points)) {
    return <Arrow {...commonProps} points={forma.points} fill={forma.stroke || "#0f172a"} stroke={forma.stroke || "#0f172a"} strokeWidth={forma.strokeWidth || 4} pointerLength={12} pointerWidth={12} pointerAtBeginning={forma.tipo === "flecha_doble"} pointerAtEnding={true} />;
  }
  if (forma.path) {
    const esTrazo = forma.estilo === "svg_stroke";
    return <Path key={forma.id} {...commonProps} data={forma.path} fill={esTrazo ? "transparent" : forma.fill || "#0f172a"} stroke={forma.stroke || "#0f172a"} strokeWidth={forma.strokeWidth || (esTrazo ? 3.5 : 2)} lineCap="round" lineJoin="round" />;
  }
  return null;
};


  const formaSeleccionada = formas.find((f) => f.id === seleccionadoId);
  const imagenSeleccionada = imagenes.find((i) => i.id === seleccionadoId);
  const formasDeCategoria = FORMAS_CATALOGO[categoriaFormas] || [];

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <header className="bg-slate-800 border-b border-slate-700 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-slate-300 hover:text-white">
            ← Volver al inicio
          </Link>
          <h1 className="text-lg font-bold">Editor de Carteles 🎨</h1>
          {mensajeGuardado && (
            <span className="text-xs bg-emerald-600/30 border border-emerald-400 text-emerald-200 px-2.5 py-1 rounded-full">
              {mensajeGuardado}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              const guardados = JSON.parse(localStorage.getItem("misDiseños") || "[]");
              setDisenosGuardados(guardados);
              setMostrarDisenos((prev) => !prev);
            }}
            className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition"
          >
            📁 Mis Diseños ({disenosGuardados.length})
          </button>
          <button
            type="button"
            onClick={guardarDiseño}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition"
          >
            Guardar
          </button>
          <button
            type="button"
            onClick={descargarImagen}
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-3.5 py-2 rounded-lg transition"
          >
            Descargar
          </button>
        </div>
      </header>

      {mostrarDisenos && (
        <div className="bg-slate-800/95 border-b border-slate-700 px-4 py-3">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-purple-300">
                Diseños guardados en este navegador (localStorage)
              </h2>
              <button
                type="button"
                onClick={() => setMostrarDisenos(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cerrar ✕
              </button>
            </div>
            {disenosGuardados.length === 0 ? (
              <p className="text-xs text-slate-400">
                Aún no has guardado carteles aquí. Pulsa "Guardar" para conservar un borrador editable.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {disenosGuardados.map((d) => (
                  <div
                    key={d.id}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-semibold truncate">{d.nombre || "Cartel sin nombre"}</p>
                      <p className="text-[11px] text-slate-400 truncate">Texto: "{d.texto || ""}"</p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => cargarDiseñoGuardado(d)}
                        className="bg-purple-600 hover:bg-purple-500 text-xs px-2.5 py-1 rounded"
                      >
                        Abrir
                      </button>
                      <button
                        type="button"
                        onClick={() => eliminarDisenoGuardado(d.id)}
                        className="bg-rose-700/80 hover:bg-rose-600 text-xs px-2 py-1 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-7xl w-full mx-auto">
        <aside className="lg:col-span-4 bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-5 overflow-y-auto max-h-[85vh]">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">FORMAS</h2>
            <div className="grid grid-cols-3 gap-1.5 mb-3">
              {(
                [
                  ["lineas", "Líneas"],
                  ["etiquetas", "Etiquetas"],
                  ["basicas", "Básicas"],
                  ["flechas", "Flechas"],
                  ["llamadas", "Llamadas"],
                  ["simbolos", "Símbolos"],
                  ["diagrama", "Diagrama"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setCategoriaFormas(key)}
                  className={`text-xs py-1.5 px-2 rounded-md border transition ${
                    categoriaFormas === key
                      ? "bg-blue-600 border-blue-400 text-white font-semibold"
                      : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {formasDeCategoria.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    agregarForma(item.tipo, {
                      path: item.path,
                      points: item.points,
                      estilo: item.estilo,
                    })
                  }
                  className="bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-lg p-2 flex flex-col items-center justify-center gap-1 transition"
                >
                  <svg viewBox="0 0 96 96" className="w-8 h-8">
                    {item.tipo === "circulo" && (
                      <circle cx="48" cy="48" r="34" fill="#3b82f6" />
                    )}
                    {item.tipo === "cuadrado" && (
                      <rect x="16" y="16" width="64" height="64" rx="6" fill="#ef4444" />
                    )}
                    {item.tipo === "triangulo" && (
                      <polygon points="48,14 84,78 12,78" fill="#8b5cf6" />
                    )}
                    {item.tipo === "rombo" && (
                      <polygon points="48,12 84,48 48,84 12,48" fill="#f43f5e" />
                    )}
                    {item.tipo === "estrella" && (
                      <polygon
                        points="48,10 59,34 86,37 66,55 72,82 48,68 24,82 30,55 10,37 37,34"
                        fill="#f59e0b"
                      />
                    )}
                    {item.tipo === "corazon" && (
                      <path
                        d="M 48 80 C 48 80 14 55 14 32 C 14 20 23 14 32 14 C 40 14 45 19 48 25 C 51 19 56 14 64 14 C 73 14 82 20 82 32 C 82 55 48 80 48 80 Z"
                        fill="#ec4899"
                      />
                    )}
                    {item.tipo === "linea" && Array.isArray(item.points) && (
                      <line
                        x1={item.points[0]}
                        y1={item.points[1]}
                        x2={item.points[2]}
                        y2={item.points[3]}
                        stroke="#e2e8f0"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    )}
                    {(item.tipo === "flecha" || item.tipo === "flecha_doble") && Array.isArray(item.points) && (
                      <line
                        x1={item.points[0]}
                        y1={item.points[1]}
                        x2={item.points[2]}
                        y2={item.points[3]}
                        stroke="#38bdf8"
                        strokeWidth="4"
                        strokeLinecap="round"
                      />
                    )}
                    {item.path && (
                      <path
                        d={item.path}
                        fill={item.estilo === "svg_stroke" ? "none" : "#e2e8f0"}
                        stroke={item.estilo === "svg_stroke" ? "#e2e8f0" : "none"}
                        strokeWidth={item.estilo === "svg_stroke" ? "4" : "0"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    )}
                  </svg>
                  <span className="text-[11px] text-slate-300 text-center leading-tight">
                    {item.nombre}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">TEXTO</h2>
            <input
              type="text"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu texto..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Color texto</label>
                <input
                  type="color"
                  value={colorTexto}
                  onChange={(e) => setColorTexto(e.target.value)}
                  className="w-full h-9 bg-slate-900 border border-slate-700 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Tamaño ({tamanoTexto}px)</label>
                <input
                  type="range"
                  min={14}
                  max={120}
                  value={tamanoTexto}
                  onChange={(e) => setTamanoTexto(Number(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>

            <div className="bg-slate-900/70 border border-slate-700/80 rounded-lg p-2.5 space-y-2">
              <label className="flex items-center gap-2 text-xs text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usarDegradado}
                  onChange={(e) => setUsarDegradado(e.target.checked)}
                  className="rounded"
                />
                <span>Degradado en letras</span>
              </label>
              {usarDegradado && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Color 1</span>
                    <input
                      type="color"
                      value={colorDegradado1}
                      onChange={(e) => setColorDegradado1(e.target.value)}
                      className="w-full h-8 bg-slate-900 border border-slate-700 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block mb-1">Color 2</span>
                    <input
                      type="color"
                      value={colorDegradado2}
                      onChange={(e) => setColorDegradado2(e.target.value)}
                      className="w-full h-8 bg-slate-900 border border-slate-700 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}

              <div className="pt-1 border-t border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-300">Sombra en letras</span>
                  <input
                    type="color"
                    value={sombraColor}
                    onChange={(e) => setSombraColor(e.target.value)}
                    className="h-7 w-12 bg-slate-900 border border-slate-700 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">
                    Desenfoque sombra ({sombraBlur}px)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={30}
                    value={sombraBlur}
                    onChange={(e) => setSombraBlur(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block">
                    Opacidad sombra ({Math.round(sombraOpacidad * 100)}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    value={sombraOpacidad}
                    onChange={(e) => setSombraOpacidad(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Fuente</label>
              <select
                value={fuenteTexto}
                onChange={(e) => setFuenteTexto(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-2 text-sm text-white"
              >
                {FUENTES_BASE.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
                {fuentesPersonalizadas.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.nombre} (Personalizada)
                  </option>
                ))}
              </select>
              <div className="mt-2 space-y-1.5">
                <div className="flex items-center justify-between gap-1.5">
                  <span className="text-[11px] text-slate-400">Nombre para la fuente:</span>
                  <a
                    href="https://fonts.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-sky-400 hover:text-sky-300 underline"
                  >
                    Buscar fuentes en internet
                  </a>
                </div>
                <input
                  type="text"
                  value={nuevaFuenteGoogle}
                  onChange={(e) => setNuevaFuenteGoogle(e.target.value)}
                  placeholder="Ej. Mi Fuente Bonita"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  disabled={subiendoFuente}
                  onClick={() => fontInputRef.current?.click()}
                  className="w-full py-1.5 px-2.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white cursor-pointer"
                >
                  {subiendoFuente ? "Cargando fuente..." : "Seleccionar archivo de fuente (.ttf / .otf)"}
                </button>
                <input
                  ref={fontInputRef}
                  type="file"
                  accept=".ttf,.otf,.woff,.woff2,.zip"
                  onChange={subirFuente}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-4 space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">FONDO Y TEXTURA</h2>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Color base</label>
                <input
                  type="color"
                  value={colorFondo}
                  onChange={(e) => setColorFondo(e.target.value)}
                  className="w-full h-9 bg-slate-900 border border-slate-700 rounded cursor-pointer"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Textura</label>
                <select
                  value={texturaFondo}
                  onChange={(e) => setTexturaFondo(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-2 text-xs text-white"
                >
                  {TEXTURAS.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-1 space-y-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-slate-900 hover:bg-slate-700 border border-slate-700 rounded-lg py-2 text-xs font-semibold"
              >
                {cargandoFondo ? "Cargando imagen..." : "🖼️ Subir imagen desde PC"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={subirImagenLocal}
                className="hidden"
              />

              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={urlImagen}
                  onChange={(e) => setUrlImagen(e.target.value)}
                  placeholder="Pegar URL de imagen..."
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={cargarImagenDesdeURL}
                  className="bg-blue-600 hover:bg-blue-500 text-xs font-semibold px-3 py-1.5 rounded-lg"
                >
                  {cargandoUrl ? "..." : "Cargar"}
                </button>
              </div>
            </div>
          </div>

          {seleccionadoId !== null && (
            <div className="border-t border-slate-700 pt-4 space-y-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                ELEMENTO SELECCIONADO
              </h2>
              {formaSeleccionada && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-300">Color de forma:</span>
                  <input
                    type="color"
                    value={
                      formaSeleccionada.estilo === "svg_stroke"
                        ? formaSeleccionada.stroke || "#0f172a"
                        : formaSeleccionada.fill || "#0f172a"
                    }
                    onChange={(e) => cambiarColorForma(e.target.value)}
                    className="h-8 w-16 bg-slate-900 border border-slate-700 rounded cursor-pointer"
                  />
                </div>
              )}
              {imagenSeleccionada && (
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">
                    Opacidad ({Math.round((imagenSeleccionada.opacity ?? 1) * 100)}%)
                  </label>
                  <input
                    type="range"
                    min={0.1}
                    max={1}
                    step={0.05}
                    value={imagenSeleccionada.opacity ?? 1}
                    onChange={(e) => cambiarOpacidadImagen(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => ajustarEscalaSeleccionado(1.2)}
                  className="bg-slate-700 hover:bg-slate-600 text-xs px-2.5 py-1 rounded"
                >
                  + Agrandar
                </button>
                <button
                  type="button"
                  onClick={() => ajustarEscalaSeleccionado(0.8)}
                  className="bg-slate-700 hover:bg-slate-600 text-xs px-2.5 py-1 rounded"
                >
                  - Achicar
                </button>
                {seleccionadoId !== 999 && (
                  <>
                    <button
                      type="button"
                      onClick={() => traerAlFrente(seleccionadoId)}
                      className="bg-slate-700 hover:bg-slate-600 text-xs px-2.5 py-1 rounded"
                    >
                      Al frente
                    </button>
                    <button
                      type="button"
                      onClick={() => enviarAlFondo(seleccionadoId)}
                      className="bg-slate-700 hover:bg-slate-600 text-xs px-2.5 py-1 rounded"
                    >
                      Al fondo
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={borrarSeleccionado}
                  className="bg-rose-600 hover:bg-rose-500 text-xs font-semibold px-2.5 py-1 rounded"
                >
                  Borrar
                </button>
              </div>
            </div>
          )}
        </aside>

        <main className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center justify-center overflow-auto">
          <div className="shadow-2xl border border-slate-700 bg-white">
            <Stage
              ref={stageRef}
              width={500}
              height={650}
              onMouseDown={(e) => {
                if (e.target === e.target.getStage()) {
                  setSeleccionadoId(null);
                }
              }}
              onTouchStart={(e) => {
                if (e.target === e.target.getStage()) {
                  setSeleccionadoId(null);
                }
              }}
            >
              <Layer>
                <Rect x={0} y={0} width={500} height={650} fill={colorFondo} />
                {bgImage && <KonvaImage image={bgImage} x={0} y={0} width={500} height={650} listening={false} />}

                {capas.map((capa) => {
                  if (capa.tipo === "texto") {
                    return renderTextoEnLienzo();
                  }
                  if (capa.tipo === "forma") {
                    const forma = formas.find((f) => f.id === capa.id);
                    return forma ? renderFormaEnLienzo(forma) : null;
                  }
                  if (capa.tipo === "imagen") {
                    const img = imagenes.find((i) => i.id === capa.id);
                    return img ? renderImagenEnLienzo(img) : null;
                  }
                  return null;
                })}

                <Transformer
                  ref={trRef}
                  rotateEnabled={true}
                  enabledAnchors={[
                    "top-left",
                    "top-center",
                    "top-right",
                    "middle-left",
                    "middle-right",
                    "bottom-left",
                    "bottom-center",
                    "bottom-right",
                  ]}
                  boundBoxFunc={(oldBox, newBox) => {
                    if (Math.abs(newBox.width) < 15 || Math.abs(newBox.height) < 15) {
                      return oldBox;
                    }
                    return newBox;
                  }}
                />
              </Layer>
            </Stage>
          </div>
        </main>
      </div>
    </div>
  );
}






