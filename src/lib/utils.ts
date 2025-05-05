export function formatDate(dateString: string, weekDay?: boolean) {
  if (!dateString) return '-';
  const date = new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });

  if (weekDay) {
    const dateWithWeekday = new Date(dateString).toLocaleDateString('pt-BR', { timeZone: 'UTC', weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' });
    const weekDay = dateWithWeekday.split(',');

    return `${weekDay[1]} (${weekDay[0]})`;
  }

  return date;
}

export const getCurrentDateDDMMYYYY = () => {
  return new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

export const getCurrentDateYYYYMMDD = () => {
  return new Date().toDateString().split('T')[0];
}

export const daysBetween = (date1: string, date2: string): string => {
  const date1d = new Date(date1);
  const date2d = new Date(date2);
  const timeDiff = Math.abs(date2d.getTime() - date1d.getTime());
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  return `${daysDiff}`;
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