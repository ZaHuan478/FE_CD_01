import { useCallback, useEffect, useRef, useState } from 'react'

type SimulationScenario = 'pass' | 'fail'

interface UseFlowSimulationOptions {
  initialStep: string
  stageSteps: Record<number, string>
  activeStageTab: number
  sequences: Record<SimulationScenario, string[]>
  delays: Record<SimulationScenario, number>
  completionDelay?: number
}

/**
 * Keeps the repeated flow-demo state and its timers in one place.
 * Timers are cleared when a flow is restarted or unmounted, preventing stale
 * animations from changing the selected step after navigation.
 */
export function useFlowSimulation({
  initialStep,
  stageSteps,
  activeStageTab,
  sequences,
  delays,
  completionDelay = 1500
}: UseFlowSimulationOptions) {
  const [selectedStep, setSelectedStep] = useState(initialStep)
  const [simulationScenario, setSimulationScenario] = useState<SimulationScenario | null>(null)
  const [simActiveStep, setSimActiveStep] = useState<string | null>(null)
  const timers = useRef<number[]>([])

  const clearSimulation = useCallback(() => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }, [])

  useEffect(() => {
    const step = stageSteps[activeStageTab]
    if (step) setSelectedStep(step)
  }, [activeStageTab, stageSteps])

  useEffect(() => clearSimulation, [clearSimulation])

  const runSimulation = useCallback((scenario: SimulationScenario) => {
    clearSimulation()
    setSimulationScenario(scenario)

    const sequence = sequences[scenario]
    sequence.forEach((step, index) => {
      timers.current.push(window.setTimeout(() => {
        setSimActiveStep(step)
        if (step.startsWith('EMP')) setSelectedStep(step)
        if (index === sequence.length - 1) {
          timers.current.push(window.setTimeout(() => setSimulationScenario(null), completionDelay))
        }
      }, index * delays[scenario]))
    })
  }, [clearSimulation, completionDelay, delays, sequences])

  return { selectedStep, setSelectedStep, simulationScenario, simActiveStep, runSimulation }
}
