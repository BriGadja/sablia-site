
import { useEffect } from 'react';
import { useToast } from './use-toast';

export function usePersistentToast() {
  const { toast } = useToast();

  useEffect(() => {
    // Vérifier s'il y a un toast en attente dans le localStorage
    const pendingToast = localStorage.getItem('pendingToast');
    if (pendingToast) {
      // Afficher le toast
      try {
        const toastData = JSON.parse(pendingToast);
        toast(toastData);
      } catch (e) {
        console.error('Erreur lors du parsing du toast:', e);
      }
      // Supprimer le toast du localStorage
      localStorage.removeItem('pendingToast');
    }
  }, [toast]);

  // Fonction pour sauvegarder un toast pour qu'il soit affiché après la navigation
  const setPendingToast = (toastData: any) => {
    localStorage.setItem('pendingToast', JSON.stringify(toastData));
  };

  return { setPendingToast };
};
}
