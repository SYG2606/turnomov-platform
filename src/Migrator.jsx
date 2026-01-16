import React, { useState } from 'react';
import { collection, getDocs, writeBatch, doc } from 'firebase/firestore';

export default function Migrator({ db }) {
  const [status, setStatus] = useState('idle');
  const [log, setLog] = useState([]);

  const migrate = async () => {
    if (!confirm("¿Estás seguro de copiar los datos viejos al tenant 'demo'?")) return;
    
    setStatus('migrating');
    setLog([]);
    const addLog = (msg) => setLog(prev => [...prev, msg]);

    try {
      const batch = writeBatch(db);
      // ID donde estaban tus datos antes
      const OLD_APP_ID = "mi-taller-bici"; 
      
      addLog("🚀 Iniciando migración a 'tenants/demo'...");

      // 1. Mover Turnos
      addLog("📦 Leyendo Turnos antiguos...");
      const oldTurnosRef = collection(db, 'artifacts', OLD_APP_ID, 'public', 'data', 'turnos');
      const oldTurnosSnap = await getDocs(oldTurnosRef);
      
      let turnosCount = 0;
      oldTurnosSnap.forEach((docSnap) => {
        // Copia exacta al nuevo path
        const newRef = doc(db, 'tenants', 'demo', 'turnos', docSnap.id);
        batch.set(newRef, docSnap.data());
        turnosCount++;
      });
      addLog(`✅ ${turnosCount} turnos preparados.`);

      // 2. Mover Clientes
      addLog("👥 Leyendo Clientes antiguos...");
      const oldClientsRef = collection(db, 'artifacts', OLD_APP_ID, 'public', 'data', 'clients');
      const oldClientsSnap = await getDocs(oldClientsRef);
      
      let clientsCount = 0;
      oldClientsSnap.forEach((docSnap) => {
        const newRef = doc(db, 'tenants', 'demo', 'clients', docSnap.id);
        batch.set(newRef, docSnap.data());
        clientsCount++;
      });
      addLog(`✅ ${clientsCount} clientes preparados.`);

      // 3. Mover Configuración
      const demoConfigRef = doc(db, 'tenants', 'demo', 'config', 'main');
      batch.set(demoConfigRef, { 
        shopName: "Taller Demo (Migrado)", 
        workDays: [1,2,3,4,5],
        maxPerDay: 8
      }, { merge: true });

      // 4. Ejecutar
      if (turnosCount > 0 || clientsCount > 0) {
          addLog("💾 Escribiendo en base de datos...");
          await batch.commit();
          addLog("✨ ¡MIGRACIÓN COMPLETADA CON ÉXITO!");
          setStatus('done');
      } else {
          addLog("⚠️ No se encontraron datos antiguos para migrar.");
          setStatus('error');
      }

    } catch (e) {
      console.error(e);
      addLog("❌ ERROR CRÍTICO: " + e.message);
      setStatus('error');
    }
  };

  if (status === 'done') return <div className="fixed bottom-4 right-4 z-[100] p-4 bg-green-600 text-white rounded-xl shadow-2xl animate-bounce">¡Datos Migrados! Recarga la página.</div>;

  return (
    <div className="fixed bottom-4 right-4 z-[100] p-6 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-sm animate-in slide-in-from-bottom-10">
      <h3 className="text-white font-bold mb-2 flex items-center gap-2">⚡ Migrador de Datos</h3>
      <p className="text-slate-400 text-xs mb-4">
        Transfiere tus datos de prueba antiguos al nuevo entorno <strong>demo</strong>.
      </p>
      
      <div className="bg-black/50 p-2 rounded mb-4 h-32 overflow-y-auto font-mono text-[10px] text-green-400 border border-slate-800">
        {log.length === 0 ? <span className="opacity-50">&gt; Esperando inicio...</span> : log.map((l, i) => <div key={i}>&gt; {l}</div>)}
      </div>

      <button 
        onClick={migrate} 
        disabled={status === 'migrating'}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition disabled:opacity-50 text-sm shadow-lg shadow-blue-900/20"
      >
        {status === 'migrating' ? 'Procesando...' : 'Iniciar Migración'}
      </button>
    </div>
  );
}