import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const ProcessContext = createContext();

export function ProcessProvider({ children }) {
  const [process, setProcess] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Debug effect
  useEffect(() => {
    console.log('Candidates updated:', candidates);
  }, [candidates]);

  useEffect(() => {
    const { id } = router.query;
    if (id && (!process || process.id !== id)) {
      // Aquí deberías cargar los datos del proceso usando el ID
      // Por ahora, solo estableceremos el ID
      setProcess({ id });
    }
  }, [router.query, process]);

  return (
    <ProcessContext.Provider value={{ 
      process, 
      setProcess, 
      candidates, 
      setCandidates, 
      loading, 
      setLoading 
    }}>
      {children}
    </ProcessContext.Provider>
  );
}

export function useProcess() {
  return useContext(ProcessContext);
}
