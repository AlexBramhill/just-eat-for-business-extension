export const getSod = (date: Date) =>
  new Date(new Date(date).setHours(0, 0, 0, 0));
export const getSodToday = () => getSod(new Date());
