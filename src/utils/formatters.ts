export const formatDate = (date: string | number) =>
  new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(
    new Date(date),
  );
export const localInputDate = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};
export const sameDay = (date: string, today = new Date()) =>
  new Date(date).toDateString() === today.toDateString();
