const formatScore = (rawScore: number): string => {
  if(rawScore >= 1000){
    return `${(rawScore / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  };
  if(rawScore <= -1000){
    return `${(rawScore / 1000).toFixed(1).replace(/\.0$/, '')}k`;
  };
  return rawScore.toString();
};

const formatDate = (date: string | Date): string => {
  const currentDate = new Date();
  const inputDate = new Date(date);
  // seconds between now and input date
  const differenceSec = Math.floor((currentDate.getTime() - inputDate.getTime()) / 1000);
  const differenceMin = Math.floor(differenceSec / 60);
  const differenceHours = Math.floor(differenceMin / 60);
  const differenceDays = Math.floor(differenceHours / 24);
  const differenceMonths = Math.floor(differenceDays / 30);
  const differenceYears = Math.floor(differenceMonths / 12);

  if(differenceSec < 60){
    return `${differenceSec} second${differenceSec !== 1 ? 's' : ''} ago`;
  } else if(differenceMin < 60){
    return `${differenceMin} minute${differenceMin !== 1 ? 's' : ''} ago`;
  } else if(differenceHours < 24){
    return `${differenceHours} hour${differenceHours !== 1 ? 's' : ''} ago`;
  } else if(differenceDays < 30){
    return `${differenceDays} day${differenceDays !== 1 ? 's' : ''} ago`;
  } else if(differenceMonths < 12){
    return `${differenceMonths} month${differenceMonths !== 1 ? 's' : ''} ago`;
  } else {
    return `${differenceYears} year${differenceYears !== 1 ? 's' : ''} ago`;
  };
};

export { formatScore, formatDate };