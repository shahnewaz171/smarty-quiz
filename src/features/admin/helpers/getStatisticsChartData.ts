interface QuizzesByDifficulty {
  easy?: number;
  medium?: number;
  hard?: number;
}

interface QuizzesByCategory {
  [category: string]: number;
}

const getStatisticsChartData = (
  quizzesByDifficulty: QuizzesByDifficulty,
  quizzesByCategory: QuizzesByCategory
) => {
  const { easy = 0, medium = 0, hard = 0 } = quizzesByDifficulty || {};

  const difficultyPieChartData = [
    { id: 0, value: easy, label: 'Easy' },
    { id: 1, value: medium, label: 'Medium' },
    { id: 2, value: hard, label: 'Hard' }
  ];
  const categoryData = Object.entries(quizzesByCategory || {}).map(([name, value]) => ({
    category: name,
    quizzes: value as number
  }));

  return {
    difficultyPieChartData: difficultyPieChartData.filter((item) => Boolean(item.value)),
    categoryData
  };
};

export default getStatisticsChartData;
