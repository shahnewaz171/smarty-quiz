import ConfirmationModal from '@/components/ui/ConfirmationModal';

interface MaxAttemptsModalProps {
  isOpen: boolean;
  attemptCount: number;
  onClose: () => void;
}

interface StartQuizModalProps {
  isOpen: boolean;
  quizTitle: string;
  questionCount: number;
  timeLimit: number;
  attemptsRemaining: number;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const MaxAttemptsModal = ({ isOpen, attemptCount, onClose }: MaxAttemptsModalProps) => (
  <ConfirmationModal
    isOpen={isOpen}
    title="Maximum Attempts Reached"
    subTitle={`You have already attempted this quiz ${attemptCount} times. You cannot take this quiz anymore.`}
    actionLabel="OK"
    closeLabel=""
    onConfirm={onClose}
    onClose={onClose}
  />
);

export const StartQuizModal = ({
  isOpen,
  quizTitle,
  questionCount,
  timeLimit,
  attemptsRemaining,
  isLoading = false,
  onClose,
  onConfirm
}: StartQuizModalProps) => (
  <ConfirmationModal
    isOpen={isOpen}
    title={`Start Quiz: ${quizTitle}`}
    subTitle={`This quiz contains ${questionCount} questions and has a time limit of ${timeLimit} minutes. You have ${attemptsRemaining} ${attemptsRemaining === 1 ? 'attempt' : 'attempts'} remaining. Once you start, the timer will begin and cannot be paused. Are you ready to begin?`}
    closeLabel="Cancel"
    actionLabel="Start Quiz"
    onClose={onClose}
    isLoading={isLoading}
    onConfirm={onConfirm}
  />
);
