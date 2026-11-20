"use client";

import Link from "next/link";

export default function Editor() {
  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Barra superior */}
      <header className="bg-gray-800 p-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-blue-400 hover:text-blue-300 font-bold">
            ← Volver al inicio
          </Link>
          <h2 className="text-xl font-bold">Editor de Carteles</h2>
        </div>
        <button className="bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-bold shadow">
          Descargar
        </button>
      </header>

      {/* Área de trabajo (El lienzo) */}
      <div className="flex-1 flex items-center justify-center bg-gray-700 p-8">
        <div className="w-[600px] h-[800px] bg-white shadow-2xl flex items-center justify-center text-gray-400">
          Aquí irá el lienzo mágico de Konva ✨
        </div>
      </div>
    </main>
  );
}