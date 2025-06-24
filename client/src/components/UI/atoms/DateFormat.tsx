type Props = {
  date: string | Date
}

const DateFormat = ({ date }: Props) => {

  const createDate = new Date(date);
  const formattedDate = createDate.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  return (
    <>{formattedDate}</>
  );
}
 
export default DateFormat;