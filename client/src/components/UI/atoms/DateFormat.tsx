type Props = {
  date: string | Date
}

const DateFormat = ({ date }: Props) => {

  const inputDate = new Date(date);
  const currentDate = new Date();

  const sameDay = inputDate.toDateString() === currentDate.toDateString();

  const yesterdaysDate = new Date();
  yesterdaysDate.setDate(currentDate.getDate() - 1)
  const isYesterday = inputDate.toDateString() === yesterdaysDate.toDateString();

  const time = inputDate.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  let formattedDate = '';

  if(sameDay){
    formattedDate = `Today at ${time}`;
  } else if(isYesterday){
    formattedDate = `Yesterday at ${time}`;
  } else{
    const date = inputDate.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }); 
    formattedDate = `${date} at ${time}`;
  };

  return (
    <>{formattedDate}</>
  );
}
 
export default DateFormat;