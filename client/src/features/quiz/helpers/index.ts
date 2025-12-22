export const getChipColor = (isCurrent: boolean, isAnswered: boolean) => {
  let chipColor: 'primary' | 'success' | 'default' = 'default';

  if (isCurrent) chipColor = 'primary';
  else if (isAnswered) chipColor = 'success';

  return chipColor;
};

export const formatQuizTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
