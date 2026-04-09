import { Suspense, lazy, useEffect, useMemo, useRef, useState } from "react";
import { missions } from "./data/missions";
import { reagentMap } from "./data/reagents";
import { createInitialLabSession, resolveReactionOutcome } from "./lib/reactionEngine";
import { LabLogEntry, LabSessionState, MissionDefinition, ProgressState } from "./types";

type Screen = "home" | "missions" | "lab";

const STORAGE_KEY = "chemistry-practice-progress";
const LabScene3D = lazy(() => import("./components/LabScene3D"));
const PHASE_TIMINGS = {
  pouring: 350,
  mixing: 700,
  reacting: 1200
};

function readProgress(): ProgressState {
  if (typeof window === "undefined") {
    return { completedMissionIds: [], lastMissionId: null };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { completedMissionIds: [], lastMissionId: null };
  }

  try {
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      completedMissionIds: parsed.completedMissionIds ?? [],
      lastMissionId: parsed.lastMissionId ?? null
    };
  } catch {
    return { completedMissionIds: [], lastMissionId: null };
  }
}

function persistProgress(progress: ProgressState) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function makeLogEntry(message: string): LabLogEntry {
  return {
    id: `${Date.now()}-${message}`,
    message
  };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [progress, setProgress] = useState<ProgressState>(() => readProgress());
  const [activeMissionId, setActiveMissionId] = useState<string | null>(progress.lastMissionId);
  const [labSession, setLabSession] = useState<LabSessionState>(() => createInitialLabSession(progress.lastMissionId));
  const timeoutsRef = useRef<number[]>([]);

  const activeMission = useMemo(
    () => missions.find((mission) => mission.id === activeMissionId) ?? null,
    [activeMissionId]
  );

  useEffect(() => {
    persistProgress(progress);
  }, [progress]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    };
  }, []);

  function schedule(callback: () => void, delay: number) {
    const timeout = window.setTimeout(callback, delay);
    timeoutsRef.current.push(timeout);
  }

  function clearPendingTimers() {
    timeoutsRef.current.forEach((timeout) => window.clearTimeout(timeout));
    timeoutsRef.current = [];
  }

  function startMission(mission: MissionDefinition) {
    clearPendingTimers();
    setActiveMissionId(mission.id);
    setLabSession(createInitialLabSession(mission.id));
    setProgress((current) => ({ ...current, lastMissionId: mission.id }));
    setScreen("lab");
  }

  function resetLab() {
    clearPendingTimers();
    setLabSession(createInitialLabSession(activeMissionId));
  }

  function leaveLab() {
    clearPendingTimers();
    setLabSession(createInitialLabSession(activeMissionId));
    setScreen("missions");
  }

  function completeMissionIfNeeded(matchedReactionId: string | null) {
    if (!activeMission || matchedReactionId !== activeMission.successReactionId) {
      return false;
    }

    setProgress((current) => {
      if (current.completedMissionIds.includes(activeMission.id)) {
        return current;
      }

      return {
        ...current,
        completedMissionIds: [...current.completedMissionIds, activeMission.id]
      };
    });

    return true;
  }

  function addReagent(reagentId: string) {
    if (!activeMission) {
      return;
    }

    if (!activeMission.allowedReagents.includes(reagentId)) {
      return;
    }

    clearPendingTimers();

    const nextContents = [...labSession.contents, reagentId].slice(-2);
    const updatedLog = [...labSession.logEntries, makeLogEntry(`Added ${reagentMap[reagentId].name}.`)];

    setLabSession((current) => ({
      ...current,
      contents: nextContents,
      phase: "pouring",
      resultMessage: `${reagentMap[reagentId].name} is pouring into the beaker...`,
      logEntries: updatedLog
    }));

    if (nextContents.length < 2) {
      schedule(() => {
        setLabSession((current) => ({
          ...current,
          phase: "idle",
          resultMessage: "Add one more reagent to see what happens."
        }));
      }, PHASE_TIMINGS.pouring);
      return;
    }

    schedule(() => {
      setLabSession((current) => ({
        ...current,
        phase: "mixing",
        resultMessage: "The liquids are swirling together..."
      }));
    }, PHASE_TIMINGS.pouring);

    schedule(() => {
      const outcome = resolveReactionOutcome(nextContents);

      setLabSession((current) => ({
        ...current,
        phase: "reacting",
        visibleEffects: outcome.visibleEffects,
        resultMessage: "The reaction is starting to show..."
      }));

      schedule(() => {
        const success = completeMissionIfNeeded(outcome.matchedReactionId);

        setLabSession((current) => ({
          ...current,
          phase: "result",
          matchedReactionId: outcome.matchedReactionId,
          resultMessage: outcome.resultMessage,
          safetyNote: outcome.safetyNote,
          visibleEffects: outcome.visibleEffects,
          missionResult: success ? "success" : "try-again",
          logEntries: [
            ...current.logEntries,
            makeLogEntry(success ? "Mission completed successfully." : "Observed result and recorded notes.")
          ]
        }));
      }, PHASE_TIMINGS.reacting);
    }, PHASE_TIMINGS.mixing);
  }

  const completedCount = progress.completedMissionIds.length;

  return (
    <div className="app-shell">
      <div className="backdrop backdrop-one" />
      <div className="backdrop backdrop-two" />

      {screen === "home" ? (
        <section className="home-panel">
          <div className="eyebrow">Chemistry Practice Lab</div>
          <h1>Mix, observe, and learn like a young scientist.</h1>
          <p>
            Explore color changes, fizzing beakers, and guided lab missions that help school students understand
            chemical reactions safely.
          </p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => setScreen("missions")}>
              Start Practicing
            </button>
            <div className="hero-stat">
              <strong>{completedCount}</strong>
              <span>Missions completed</span>
            </div>
          </div>
          <div className="feature-grid">
            <article>
              <h2>Guided missions</h2>
              <p>Each challenge points students toward a science idea like gas formation or indicator colors.</p>
            </article>
            <article>
              <h2>Visual reactions</h2>
              <p>Animated bubbles, foam, swirls, and liquid colors make each result easier to remember.</p>
            </article>
            <article>
              <h2>Local progress</h2>
              <p>Your browser remembers which missions were completed, so students can return later.</p>
            </article>
          </div>
        </section>
      ) : null}

      {screen === "missions" ? (
        <section className="mission-screen">
          <header className="section-header">
            <div>
              <div className="eyebrow">Mission Board</div>
              <h1>Choose a chemistry challenge</h1>
            </div>
            <button className="secondary-button" onClick={() => setScreen("home")}>
              Home
            </button>
          </header>

          <div className="mission-grid">
            {missions.map((mission) => {
              const completed = progress.completedMissionIds.includes(mission.id);

              return (
                <article key={mission.id} className="mission-card">
                  <div className="mission-meta">
                    <span className={`status-pill ${completed ? "status-complete" : "status-open"}`}>
                      {completed ? "Completed" : "Open"}
                    </span>
                    <span>{mission.allowedReagents.length} reagents</span>
                  </div>
                  <h2>{mission.title}</h2>
                  <p>{mission.objective}</p>
                  <small>{mission.takeaway}</small>
                  <button className="primary-button" onClick={() => startMission(mission)}>
                    Open Lab
                  </button>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}

      {screen === "lab" && activeMission ? (
        <section className="lab-screen">
          <header className="section-header">
            <div>
              <div className="eyebrow">Virtual Lab</div>
              <h1>{activeMission.title}</h1>
              <p>{activeMission.instructions}</p>
            </div>
            <div className="header-actions">
              <button className="secondary-button" onClick={leaveLab}>
                Missions
              </button>
              <button className="secondary-button" onClick={resetLab}>
                Reset Lab
              </button>
            </div>
          </header>

          <div className="lab-layout">
            <aside className="mission-panel">
              <h2>Mission goal</h2>
              <p>{activeMission.objective}</p>
              <div className="hint-card">
                <strong>Hint</strong>
                <p>{activeMission.hint}</p>
              </div>
              <div className="mission-progress">
                <span className={`status-pill ${labSession.missionResult === "success" ? "status-complete" : "status-open"}`}>
                  {labSession.missionResult === "success" ? "Mission complete" : "In progress"}
                </span>
              </div>
            </aside>

            <main className="bench-panel">
              <section className="shelf-panel">
                <div className="panel-heading">
                  <h2>Chemical shelf</h2>
                  <span>Select up to two reagents</span>
                </div>
                <div className="reagent-grid">
                  {activeMission.allowedReagents.map((reagentId) => {
                    const reagent = reagentMap[reagentId];

                    return (
                      <button
                        key={reagent.id}
                        className="reagent-card"
                        onClick={() => addReagent(reagent.id)}
                        disabled={labSession.phase !== "idle" && labSession.phase !== "result"}
                      >
                        <div className="bottle-neck" />
                        <div className="bottle-body" style={{ background: reagent.bottleColor }}>
                          <span>{reagent.icon}</span>
                        </div>
                        <strong>{reagent.name}</strong>
                        <small>{reagent.description}</small>
                      </button>
                    );
                  })}
                </div>
              </section>

              <section className="lab-bench">
                <div className="bench-top" />
                <div className={`beaker-scene phase-${labSession.phase}`}>
                  <Suspense fallback={<div className="lab-scene-loading">Loading 3D lab...</div>}>
                    <LabScene3D
                      effects={labSession.visibleEffects}
                      phase={labSession.phase}
                      contentsLabel={
                        labSession.contents.length
                          ? labSession.contents.map((item) => reagentMap[item].name).join(" + ")
                          : "Empty beaker"
                      }
                    />
                  </Suspense>
                </div>
                <div className="bench-readout">
                  <span>Current contents</span>
                  <strong>
                    {labSession.contents.length
                      ? labSession.contents.map((item) => reagentMap[item].name).join(" + ")
                      : "Empty beaker"}
                  </strong>
                </div>
              </section>
            </main>

            <aside className="output-panel">
              <h2>Observation notes</h2>
              <div className="result-card">
                <span className="result-phase">{labSession.phase.toUpperCase()}</span>
                <p>{labSession.resultMessage}</p>
                <small>{labSession.safetyNote}</small>
              </div>

              <div className="takeaway-card">
                <strong>Learning takeaway</strong>
                <p>{activeMission.takeaway}</p>
              </div>

              <div className="log-panel">
                <div className="panel-heading">
                  <h3>Step log</h3>
                </div>
                <ul>
                  {labSession.logEntries.length ? (
                    labSession.logEntries.map((entry) => <li key={entry.id}>{entry.message}</li>)
                  ) : (
                    <li>Waiting for the first reagent.</li>
                  )}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      ) : null}
    </div>
  );
}
