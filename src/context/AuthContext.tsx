
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { AppLogo } from '@/components/shared/AppLogo'; 

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  isProUser: boolean; 
  refreshProStatus: () => void; // Adicionado para forçar reavaliação
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProUser, setIsProUser] = useState(false); 

  const checkProStatus = (currentUser: FirebaseUser | null) => {
    if (currentUser) {
      let newIsProUser = false;
      // Condição 1: Email específico (admin/dev)
      if (currentUser.email === "pro@memetrade.com") {
          newIsProUser = true;
      } else {
        // Condição 2: Verificação do localStorage para simulação de upgrade
        try {
          if (localStorage.getItem('memetrade_user_is_pro_simulated') === 'true') {
            newIsProUser = true;
          }
        } catch (error) {
            console.warn("Não foi possível acessar o localStorage para verificar o status Pro simulado:", error);
            // Mantém newIsProUser como false se o localStorage falhar
        }
      }
      setIsProUser(newIsProUser);
      console.log("[AuthContext] User identified. Email:", currentUser.email, "isProUser set to:", newIsProUser);
    } else {
      setIsProUser(false);
      console.log("[AuthContext] No user. isProUser set to false.");
    }
  };

  // Função para ser chamada para re-checar o status Pro
  const refreshProStatus = () => {
    if (user) { // Re-checa baseado no usuário atual
        checkProStatus(user);
    }
  };


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("[AuthContext] Auth state changed. Current user email:", currentUser?.email);
      setUser(currentUser);
      setLoading(false);
      checkProStatus(currentUser); // Chama a função de verificação
    });

    // Listener para mudanças no localStorage (opcional, mas bom para consistência entre abas)
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'memetrade_user_is_pro_simulated' && user) {
        console.log("[AuthContext] localStorage 'memetrade_user_is_pro_simulated' changed. Re-checking Pro status.");
        checkProStatus(user); // Re-avalia o status Pro se o item do localStorage mudar
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorageChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Adicionar user como dependência para re-executar quando user mudar externamente

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <AppLogo />
            <div className="mt-8 flex items-center space-x-2">
                <svg className="animate-spin h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg text-muted-foreground">Carregando sessão...</p>
            </div>
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, isProUser, refreshProStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
