import React, { useState } from 'react';
import { Card, Button, Badge } from '../../components/ui';
import { apiClient } from '../../lib/api';
import {
  CheckCircle2,
  XCircle,
  Award,
  HelpCircle,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
  explanation?: string | null;
}

export interface QuizQuestion {
  id: string;
  prompt?: string;
  promptMarkdown?: string;
  explanation?: string | null;
  options: QuizOption[];
}

export interface QuizWidgetProps {
  topicId: string;
  topicTitle: string;
  questions: QuizQuestion[];
  onQuizCompleted?: (score: number, newMastery: string) => void;
}

export const QuizWidget: React.FC<QuizWidgetProps> = ({
  topicId,
  topicTitle,
  questions,
  onQuizCompleted,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{
    score: number;
    scorePercentage?: number;
    passed: boolean;
    correctCount: number;
    totalQuestions: number;
    previousMastery: string;
    newMastery: string;
    currentMastery?: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <Card className="p-8 bg-surface border-border text-center">
        <HelpCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-foreground">No Assessment Available</h4>
        <p className="text-xs text-slate-400 mt-1">Quiz questions for this topic will appear here once published.</p>
      </Card>
    );
  }

  const answeredCount = Object.keys(selectedAnswers).length;
  const totalCount = questions.length;
  const isAllAnswered = answeredCount === totalCount;

  const handleSelect = (questionId: string, optionId: string) => {
    if (submissionResult) return; // Locked after submission
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setErrorMsg(null);
  };

  const handleSubmit = async () => {
    if (!isAllAnswered) {
      setErrorMsg(`Please answer all ${totalCount} questions before submitting.`);
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const answersPayload = Object.entries(selectedAnswers).map(([questionId, selectedOptionId]) => ({
      questionId,
      selectedOptionId,
    }));

    const res = await apiClient.post<{
      score: number;
      passed: boolean;
      correctCount: number;
      totalQuestions: number;
      previousMastery: string;
      newMastery: string;
    }>('/progress/quiz', {
      topicId,
      answers: answersPayload,
    });

    setIsSubmitting(false);

    if (res.data) {
      setSubmissionResult(res.data);
      if (onQuizCompleted) {
        onQuizCompleted(res.data.score, res.data.newMastery);
      }
    } else {
      setErrorMsg(res.error?.detail || 'Failed to submit quiz. Please try again.');
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setSubmissionResult(null);
    setErrorMsg(null);
  };

  const optionLetters = ['A', 'B', 'C', 'D', 'E'];

  return (
    <Card className="p-6 sm:p-8 bg-surface/90 border-border shadow-xl space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-border/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
              <HelpCircle className="w-4 h-4" />
            </span>
            <h3 className="text-lg font-bold text-foreground">
              Knowledge Check: {topicTitle}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Demonstrate conceptual mastery with <span className="font-mono text-primary font-semibold">&ge; 80%</span> to elevate your mastery state.
          </p>
        </div>

        {/* Progress or Score Pill */}
        {!submissionResult ? (
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <div className="text-xs font-mono text-slate-400">
              Answered <span className="text-foreground font-bold">{answeredCount}</span> of {totalCount}
            </div>
            <div className="w-20 h-2 bg-surface-muted rounded-full overflow-hidden border border-border">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${(answeredCount / totalCount) * 100}%` }}
              />
            </div>
          </div>
        ) : (
          <Badge variant={submissionResult.passed ? 'success' : 'danger'} size="lg">
            {submissionResult.passed ? (
              <CheckCircle2 className="w-4 h-4 mr-1.5 text-emerald-400 inline" />
            ) : (
              <XCircle className="w-4 h-4 mr-1.5 text-rose-400 inline" />
            )}
            Score: {submissionResult.score ?? submissionResult.scorePercentage}%
            {submissionResult.totalQuestions ? ` (${submissionResult.correctCount}/${submissionResult.totalQuestions})` : ''}
          </Badge>
        )}
      </div>

      {/* Submission Result Feedback Banner */}
      {submissionResult && (
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
            submissionResult.passed
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/20 border-rose-500/40 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl border ${
                submissionResult.passed
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                  : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
              }`}
            >
              <Award className="w-7 h-7 shrink-0" />
            </div>
            <div>
              <div className="text-base font-bold text-foreground">
                {submissionResult.passed
                  ? 'Mastery Evidence Accepted!'
                  : 'Score Below Mastery Threshold (80%)'}
              </div>
              <div className="text-xs text-slate-300 mt-1 flex flex-wrap items-center gap-2">
                <span>Mastery Level:</span>
                <span className="font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded bg-surface border border-border">
                  {submissionResult.previousMastery}
                </span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-surface border border-border">
                  {submissionResult.newMastery || submissionResult.currentMastery}
                </span>
                {submissionResult.passed && (
                  <span className="text-slate-400">• Next spaced revision scheduled!</span>
                )}
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={handleRetake} className="self-end sm:self-auto">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Retake Quiz
          </Button>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-950/30 border border-rose-800/80 text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {questions.map((question, qIdx) => {
          const selectedOptId = selectedAnswers[question.id];

          return (
            <div
              key={question.id}
              className="p-5 rounded-2xl bg-surface-elevated/40 border border-border/80 space-y-4"
            >
              <div className="flex items-start gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 border border-primary/20 text-primary font-mono text-xs flex items-center justify-center font-bold">
                  {qIdx + 1}
                </span>
                <p className="text-sm font-semibold text-foreground pt-0.5 leading-relaxed">
                  {question.prompt || question.promptMarkdown}
                </p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5 pt-1 pl-10">
                {question.options.map((option, optIdx) => {
                  const isSelected = selectedOptId === option.id;

                  let optionStyle =
                    'border-border bg-surface hover:bg-surface-elevated hover:border-border text-slate-300';

                  if (isSelected && !submissionResult) {
                    optionStyle =
                      'border-primary bg-primary/10 text-foreground ring-1 ring-primary/40';
                  }

                  // Feedback states after submission
                  if (submissionResult) {
                    if (option.isCorrect) {
                      optionStyle =
                        'border-emerald-500/60 bg-emerald-950/25 text-emerald-200 ring-1 ring-emerald-500/40';
                    } else if (isSelected && !option.isCorrect) {
                      optionStyle =
                        'border-rose-500/60 bg-rose-950/25 text-rose-200 ring-1 ring-rose-500/40';
                    } else {
                      optionStyle = 'border-border/40 bg-surface/40 text-slate-500 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={option.id}
                      type="button"
                      disabled={!!submissionResult || isSubmitting}
                      onClick={() => handleSelect(question.id, option.id)}
                      className={`text-left px-4 py-3 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between gap-3 ${optionStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-md bg-surface-muted/60 border border-border/60 text-[11px] font-mono text-slate-400 flex items-center justify-center font-semibold">
                          {optionLetters[optIdx] || optIdx + 1}
                        </span>
                        <span>{option.text}</span>
                      </div>

                      {/* Icon indicator */}
                      {submissionResult ? (
                        option.isCorrect ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : isSelected && !option.isCorrect ? (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                        ) : null
                      ) : isSelected ? (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>

              {/* Conceptual Explanation when answered */}
              {submissionResult && question.explanation && (
                <div className="mt-3 ml-10 p-4 bg-surface rounded-xl border border-border/80 text-xs text-slate-300 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary" />
                    <span>Explanation</span>
                  </div>
                  <p className="leading-relaxed text-slate-400">{question.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button Bar */}
      {!submissionResult && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border/80">
          <div className="text-xs text-slate-400">
            {isAllAnswered ? (
              <span className="text-emerald-400 font-medium">All questions answered. Ready to submit!</span>
            ) : (
              <span>Answer all questions to proceed.</span>
            )}
          </div>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={!isAllAnswered || isSubmitting}
            className="w-full sm:w-auto"
          >
            Submit Answers
          </Button>
        </div>
      )}
    </Card>
  );
};
