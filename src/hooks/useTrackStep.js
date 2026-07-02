import { useEffect } from 'react';
import { api } from '../services/api';

/**
 * Call this hook at the top of any page to record that the user has reached that step.
 * maxStep only increases — never decreases.
 *
 * Steps:
 *  1 = PDPA       (/pdpa)
 *  2 = Login      (/login)
 *  3 = Tutorial   (/tutorial)
 *  4 = Survey     (/survey/:formSet)
 *  5 = Prompt     (/agentic)
 *  6 = Result     (/result/:id)
 */
export function useTrackStep(step) {
  useEffect(() => {
    const token = localStorage.getItem('backend_token');
    if (!token || typeof step !== 'number') return;
    api.updateMaxStep(token, step).catch(() => {});
  }, [step]);
}
