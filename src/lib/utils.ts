export function formatDate(dateString: string) {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export const formatStringDate = (dateString: string) => {
   const cleaned = dateString.replace(/\D/g, '');

   let formatted = '';
   if (cleaned.length <= 2) {
     formatted = cleaned;
   } else if (cleaned.length <= 4) {
     formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
   } else {
     formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4, 8)}`;
   }

   return formatted;
}

export const formatStringDateToISO = (dateString: string) => {
  const cleaned = dateString.replace(/\D/g, '');

  if (cleaned.length === 8) {
    return `${cleaned.slice(4, 8)}-${cleaned.slice(2, 4)}-${cleaned.slice(0, 2)}`;
  }

  return dateString;
}