"use client";
import { createContext, useContext, useState, useSyncExternalStore } from "react";
import type { Answers } from "../types/quiz";
import { readResult, removeProgress, removeResult, saveResult } from "../lib/browser/storage";

const subscribe = () => () => {};
export function useHydrated() { return useSyncExternalStore(subscribe, () => true, () => false); }
interface Session { answers: Answers | null; startImmediately: boolean; complete: (answers: Answers) => void; reset: (startImmediately?: boolean) => void }
const SessionContext = createContext<Session | null>(null);
export function QuizSession({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Answers | null>(readResult);
  const [startImmediately, setStartImmediately] = useState(false);
  function complete(value: Answers) { setAnswers(value); setStartImmediately(false); saveResult(value); removeProgress(); }
  function reset(start = false) { setAnswers(null); setStartImmediately(start); removeProgress(); removeResult(); }
  return <SessionContext value={{ answers, startImmediately, complete, reset }}>{children}</SessionContext>;
}
export function useQuizSession() {
  const session = useContext(SessionContext);
  if (!session) throw new Error("QuizSession is required");
  return session;
}
