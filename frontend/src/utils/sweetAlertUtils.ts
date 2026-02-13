import Swal from 'sweetalert2';

// Configuration par défaut
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

// ✅ Succès
export const showSuccess = (message: string, title = 'Succès !') => {
  return Toast.fire({
    icon: 'success',
    title: title,
    text: message,
  });
};

// ❌ Erreur
export const showError = (message: string, title = 'Erreur !') => {
  return Toast.fire({
    icon: 'error',
    title: title,
    text: message,
  });
};

// ⚠️ Avertissement
export const showWarning = (message: string, title = 'Attention !') => {
  return Toast.fire({
    icon: 'warning',
    title: title,
    text: message,
  });
};

// ℹ️ Information
export const showInfo = (message: string, title = 'Information') => {
  return Toast.fire({
    icon: 'info',
    title: title,
    text: message,
  });
};

// 🗑️ Confirmation de suppression
export const confirmDelete = async (
  title = 'Êtes-vous sûr ?',
  text = 'Cette action est irréversible !',
  confirmButtonText = 'Oui, supprimer',
  cancelButtonText = 'Annuler'
) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    reverseButtons: true,
  });
};

// ❓ Confirmation générique
export const confirmAction = async (
  title: string,
  text: string,
  confirmButtonText = 'Confirmer',
  cancelButtonText = 'Annuler',
  icon: 'question' | 'warning' | 'info' = 'question'
) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#6b7280',
    confirmButtonText: confirmButtonText,
    cancelButtonText: cancelButtonText,
    reverseButtons: true,
  });
};

// 📄 Alert avec plus de détails
export const showDetailedAlert = (
  title: string,
  html: string,
  icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info'
) => {
  return Swal.fire({
    title: title,
    html: html,
    icon: icon,
    confirmButtonColor: '#4f46e5',
    confirmButtonText: 'OK',
  });
};

// ⏳ Loading
export const showLoading = (title = 'Chargement...', text = 'Veuillez patienter') => {
  Swal.fire({
    title: title,
    text: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Fermer le loading
export const closeLoading = () => {
  Swal.close();
};