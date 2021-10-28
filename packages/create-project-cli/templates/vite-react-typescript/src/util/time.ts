import moment from 'moment';

export const timeFormat = (value: string) => {
  if (!value) {
    return value;
  }
  return moment(value).format('YYYY-MM-DD HH:mm:ss');
};
