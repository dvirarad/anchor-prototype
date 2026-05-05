import { useEffect } from "react";
import { Mail, Mic, Calendar, Clock, X, Check, ChevronRight, Anchor, Activity, Forward } from "lucide-react";
import { useAnchorState, sourceConfig, snoozeOptions } from "@/lib/useAnchorState";
import HistoryChart from "@/components/HistoryChart";

export default function DesktopAnchorPrototype() {
  const s = useAnchorState();
  const {
    items, snoozedQueue, decisions, current,
    showSenderMute,
    view, setView,
    animKey, exitingId,
    activeIndex, setActiveIndex, focusItem,
    handleSchedule, handleSnooze, handleDismiss,
    bringBackSnoozed, reset,
    scheduledCount, dismissedCount, snoozedCount, terminalRate,
    weekHistory,
  } = s;

  useEffect(() => {
    if (view !== "triage" || !current) return;
    function onKey(e) {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        setActiveIndex(i => Math.min(i + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        setActiveIndex(i => Math.max(i - 1, 0));
      } else if (e.key === "s" || e.key === "S") {
        e.preventDefault();
        if (current.suggestedSlots && current.suggestedSlots.length > 0) {
          handleSchedule(current.suggestedSlots[0]);
        }
      } else if (e.key === "z" || e.key === "Z") {
        e.preventDefault();
        if (current.snoozeCount < 2) handleSnooze(snoozeOptions[0]);
      } else if (e.key === "x" || e.key === "X") {
        e.preventDefault();
        handleDismiss();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, current, items.length, handleSchedule, handleSnooze, handleDismiss, setActiveIndex]);

  const cfg = current ? sourceConfig[current.source] : null;

  return (
    <div className="min-h-screen w-full" style={{ background: "#0a0a0a", fontFamily: "'Fraunces', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .font-display { font-family: 'Fraunces', Georgia, serif; font-feature-settings: "ss01"; }

        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E");
        }

        @keyframes cardEnter { 0% { opacity: 0; transform: translateY(12px) scale(0.985); } 100% { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes cardExit { 0% { opacity: 1; transform: scale(1); } 100% { opacity: 0; transform: translateY(-12px) scale(0.98); } }
        @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
        @keyframes toastIn { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        @keyframes listEnter { 0% { opacity: 0; transform: translateX(-8px); } 100% { opacity: 1; transform: translateX(0); } }

        .card-enter { animation: cardEnter 0.36s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .card-exit { animation: cardExit 0.22s cubic-bezier(0.55, 0, 0.55, 0.2) forwards; }
        .fade-in { animation: fadeIn 0.2s ease both; }
        .toast-in { animation: toastIn 0.3s cubic-bezier(0.22, 1, 0.36, 1) both; }
        .list-enter { animation: listEnter 0.4s cubic-bezier(0.22, 1, 0.36, 1) both; }

        .btn-lift { transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease, border-color 0.18s ease; }
        .btn-lift:hover:not(:disabled) { transform: translateY(-1px); }

        .queue-row { transition: background 0.16s ease, border-color 0.16s ease; }
        .queue-row:hover { background: #1f1d18 !important; }

        .stagger-1 { animation-delay: 0.05s; }
        .stagger-2 { animation-delay: 0.1s; }
        .stagger-3 { animation-delay: 0.15s; }
        .stagger-4 { animation-delay: 0.2s; }

        .kbd { display: inline-block; padding: 1px 6px; border-radius: 4px; background: #2a2620; border: 1px solid #3a342c; color: #d4a574; font-family: 'JetBrains Mono', monospace; font-size: 10px; line-height: 1.4; }
      `}</style>

      <div className="relative min-h-screen" style={{ background: "linear-gradient(180deg, #1a1815 0%, #0f0e0c 100%)" }}>
        <div className="absolute inset-0 grain opacity-15 pointer-events-none mix-blend-overlay" />

        <div className="relative z-10 max-w-7xl mx-auto px-10 pt-10 pb-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "#d4a574" }}>
                <Anchor className="w-5 h-5" style={{ color: "#1a1815" }} strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display text-3xl font-medium tracking-tight" style={{ color: "#f5f0e8" }}>Anchor</div>
                <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#807466" }}>
                  Tuesday · 7:42 AM · desktop
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex gap-1.5">
              {[
                { id: "triage", label: "Triage", count: items.length },
                { id: "snoozed", label: "Snoozed", count: snoozedQueue.length },
                { id: "summary", label: "Week", count: null },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className="btn-lift font-mono text-[10px] tracking-widest uppercase px-5 py-2.5 rounded-full flex items-center gap-2"
                  style={{
                    background: view === tab.id ? "#d4a574" : "transparent",
                    color: view === tab.id ? "#1a1815" : "#807466",
                    border: view === tab.id ? "none" : "1px solid #2a2620",
                  }}
                >
                  {tab.label}
                  {tab.count !== null && tab.count > 0 && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-full" style={{
                      background: view === tab.id ? "#1a1815" : "#2a2620",
                      color: view === tab.id ? "#d4a574" : "#a89888",
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Triage view */}
          {view === "triage" && (
            <div className="grid grid-cols-12 gap-6">
              {/* Queue */}
              <div className="col-span-5">
                <div className="mb-5">
                  <div className="flex items-baseline justify-between mb-1">
                    <div className="font-display text-3xl font-light leading-none" style={{ color: "#f5f0e8" }}>
                      Morning triage
                    </div>
                    <div className="font-mono text-xs" style={{ color: "#807466" }}>
                      {decisions.length}/{decisions.length + items.length}
                    </div>
                  </div>
                  <div className="text-sm italic" style={{ color: "#a89888" }}>
                    {items.length > 0
                      ? `${items.length} commitment${items.length > 1 ? "s" : ""} · click or use ↑↓`
                      : "All clear. Coffee's still hot."}
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    {[...Array(decisions.length + items.length)].map((_, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-500"
                        style={{ background: i < decisions.length ? "#d4a574" : "#2a2620" }}
                      />
                    ))}
                  </div>
                </div>

                {items.length > 0 ? (
                  <div className="space-y-2">
                    {items.map((item, i) => {
                      const itemCfg = sourceConfig[item.source];
                      const isActive = i === activeIndex;
                      return (
                        <button
                          key={item.id}
                          onClick={() => focusItem(item.id)}
                          className="queue-row w-full text-left rounded-xl p-3.5 flex items-start gap-3"
                          style={{
                            background: isActive ? "#211e1a" : "#15130f",
                            border: `1px solid ${isActive ? "#d4a574" : "#2a2620"}`,
                            boxShadow: isActive ? "0 8px 24px -8px rgba(212,165,116,0.25)" : "none",
                          }}
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: itemCfg.bg }}>
                            <itemCfg.Icon className="w-3.5 h-3.5" style={{ color: itemCfg.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-[9px] tracking-widest uppercase mb-1 truncate" style={{ color: isActive ? "#d4a574" : "#807466" }}>
                              {item.sourceFrom}
                            </div>
                            <div className="font-display text-[15px] font-light leading-snug" style={{ color: isActive ? "#f5f0e8" : "#a89888" }}>
                              {item.text}
                            </div>
                            {item.snoozeCount > 0 && (
                              <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "#2a2418" }}>
                                <Clock className="w-2.5 h-2.5" style={{ color: "#d4a574" }} />
                                <span className="font-mono text-[9px]" style={{ color: "#d4a574" }}>
                                  {item.snoozeCount}/2 snoozed
                                </span>
                              </div>
                            )}
                          </div>
                          {isActive && <ChevronRight className="w-4 h-4 mt-2 flex-shrink-0" style={{ color: "#d4a574" }} />}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                <div className="mt-6 px-1 text-xs italic" style={{ color: "#807466", fontFamily: "'Fraunces', serif" }}>
                  A todo without a time is a wish.
                </div>
              </div>

              {/* Focused card */}
              <div className="col-span-7">
                {current ? (
                  <div
                    key={`${current.id}-${animKey}`}
                    className={exitingId === current.id ? "card-exit" : "card-enter"}
                  >
                    <div
                      className="rounded-2xl p-8 relative overflow-hidden"
                      style={{
                        background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)",
                        border: "1px solid #2e2a24",
                        boxShadow: "0 32px 64px -16px rgba(0,0,0,0.5)",
                      }}
                    >
                      {current.snoozeCount > 0 && (
                        <div className="mb-5 flex items-center gap-2 px-3 py-1.5 rounded-md w-fit" style={{ background: "#2a2418", border: "1px solid #3a2f1c" }}>
                          <Clock className="w-3 h-3" style={{ color: "#d4a574" }} />
                          <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#d4a574" }}>
                            Snoozed Friday → today · {current.snoozeCount} of 2 used
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: cfg.bg }}>
                          <cfg.Icon className="w-4 h-4" style={{ color: cfg.color }} />
                        </div>
                        <div>
                          <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#807466" }}>
                            {current.sourceDetail}
                          </div>
                          <div className="font-mono text-[11px]" style={{ color: "#a89888" }}>
                            {current.sourceFrom}
                          </div>
                        </div>
                      </div>

                      {current.transcript && (
                        <div className="mb-4 px-4 py-3 rounded-md text-sm italic" style={{ background: "#15130f", color: "#9ec48a", border: "1px solid #1f2a1f", fontFamily: "'Fraunces', serif" }}>
                          <span className="font-mono text-[9px] tracking-widest uppercase mr-2" style={{ color: "#5a6a4f" }}>Whisper</span>
                          {current.transcript}
                        </div>
                      )}

                      <div className="font-display text-4xl font-light leading-tight mb-8" style={{ color: "#f5f0e8" }}>
                        {current.text}
                      </div>

                      {/* Suggested slots */}
                      {current.suggestedSlots && current.suggestedSlots.length > 0 && (
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#d4a574" }}>
                              Schedule · suggested slots
                            </div>
                            <div className="font-mono text-[9px]" style={{ color: "#807466" }}>
                              <span className="kbd">S</span> picks first
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {current.suggestedSlots.map((slot, i) => (
                              <button
                                key={i}
                                onClick={() => handleSchedule(slot)}
                                className="btn-lift p-4 rounded-xl flex items-center justify-between"
                                style={{
                                  background: i === 0 ? "#d4a574" : "#211e1a",
                                  color: i === 0 ? "#1a1815" : "#f5f0e8",
                                  border: i === 0 ? "1px solid #d4a574" : "1px solid #2e2a24",
                                }}
                              >
                                <div className="flex items-center gap-2.5">
                                  <Calendar className="w-4 h-4" strokeWidth={2.2} />
                                  <span className="font-display text-base font-light">{slot}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 opacity-70" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Snooze options */}
                      {current.snoozeCount < 2 ? (
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#807466" }}>
                              Snooze · {current.snoozeCount + 1} of 2
                            </div>
                            <div className="font-mono text-[9px]" style={{ color: "#807466" }}>
                              <span className="kbd">Z</span> picks first
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {snoozeOptions.slice(0, 4).map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleSnooze(opt)}
                                className="btn-lift p-3 rounded-xl text-left"
                                style={{ background: "#15130f", border: "1px solid #2a2620" }}
                              >
                                <div className="font-display text-sm font-light" style={{ color: "#f5f0e8" }}>{opt.label}</div>
                                <div className="font-mono text-[10px] mt-0.5" style={{ color: "#807466" }}>{opt.hint}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-5 px-4 py-3 rounded-md text-xs italic" style={{ background: "#2a2418", color: "#d4a574", border: "1px solid #3a2f1c" }}>
                          Snooze locked — this commitment has been snoozed twice. Schedule or dismiss only.
                        </div>
                      )}

                      {/* Dismiss */}
                      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "#2a2620" }}>
                        <button
                          onClick={handleDismiss}
                          className="btn-lift flex items-center gap-2 px-4 py-2.5 rounded-lg"
                          style={{ background: "#2a2620", color: "#a89888", border: "1px solid #3a342c" }}
                        >
                          <X className="w-4 h-4" strokeWidth={2.2} />
                          <span className="font-mono text-[10px] tracking-widest uppercase font-medium">Dismiss</span>
                          <span className="kbd ml-1">X</span>
                        </button>
                        <div className="font-mono text-[10px]" style={{ color: "#5a534a" }}>
                          <span className="kbd mr-1">↑</span><span className="kbd mr-2">↓</span>navigate
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl p-16 text-center fade-in" style={{ background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)", border: "1px solid #2e2a24" }}>
                    <div className="font-display text-7xl font-light mb-4" style={{ color: "#d4a574" }}>
                      Done.
                    </div>
                    <div className="text-base italic mb-8" style={{ color: "#a89888" }}>
                      {scheduledCount} scheduled · {snoozedCount} snoozed · {dismissedCount} dismissed
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setView("summary")}
                        className="btn-lift font-mono text-[11px] tracking-widest uppercase px-6 py-3 rounded-full"
                        style={{ background: "#d4a574", color: "#1a1815" }}
                      >
                        See your week →
                      </button>
                      <button
                        onClick={reset}
                        className="btn-lift font-mono text-[10px] tracking-widest uppercase px-5 py-3 rounded-full"
                        style={{ background: "transparent", color: "#807466", border: "1px solid #2a2620" }}
                      >
                        Replay demo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Snoozed view */}
          {view === "snoozed" && (
            <div className="fade-in">
              <div className="mb-6">
                <div className="font-display text-4xl font-light leading-none mb-2" style={{ color: "#f5f0e8" }}>
                  Waiting room
                </div>
                <div className="text-sm italic" style={{ color: "#a89888" }}>
                  {snoozedQueue.length} commitment{snoozedQueue.length !== 1 ? "s" : ""} on a re-check date. Each one comes back to you.
                </div>
              </div>

              {snoozedQueue.length === 0 ? (
                <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed #2a2620" }}>
                  <Clock className="w-10 h-10 mx-auto mb-3" style={{ color: "#3a342c" }} />
                  <div className="font-display text-xl font-light mb-1" style={{ color: "#807466" }}>
                    Nothing in the waiting room.
                  </div>
                  <div className="text-xs" style={{ color: "#5a534a" }}>
                    Items you snooze will land here until they return.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {snoozedQueue.map((item, i) => {
                    const itemCfg = sourceConfig[item.source];
                    return (
                      <div
                        key={item.id}
                        className={`list-enter stagger-${Math.min(i + 1, 4)} rounded-xl p-5`}
                        style={{
                          background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)",
                          border: "1px solid #2e2a24",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: itemCfg.bg }}>
                            <itemCfg.Icon className="w-3.5 h-3.5" style={{ color: itemCfg.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: "#807466" }}>
                              {item.sourceFrom}
                            </div>
                            <div className="font-display text-lg font-light leading-snug mb-3" style={{ color: "#f5f0e8" }}>
                              {item.text}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "#15130f" }}>
                                <Clock className="w-2.5 h-2.5" style={{ color: "#d4a574" }} />
                                <span className="font-mono text-[10px]" style={{ color: "#d4a574" }}>
                                  Returns {item.returnsOn}
                                </span>
                              </div>
                              <div className="font-mono text-[10px]" style={{ color: "#807466" }}>
                                {item.daysUntil}d · snooze {item.snoozeCount}/2
                              </div>
                            </div>
                            <button
                              onClick={() => bringBackSnoozed(item)}
                              className="btn-lift font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full"
                              style={{ background: "#2a2620", color: "#d4a574", border: "1px solid #3a342c" }}
                            >
                              Bring back now
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-8 p-5 rounded-xl max-w-2xl" style={{ background: "#15130f", border: "1px solid #1f1d18" }}>
                <div className="flex items-start gap-3">
                  <div className="w-1 self-stretch rounded-full" style={{ background: "#d4a574" }} />
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: "#807466" }}>
                      The waiting room rule
                    </div>
                    <div className="text-sm leading-relaxed" style={{ color: "#a89888", fontFamily: "'Fraunces', serif" }}>
                      Anchor doesn't keep a list of "things to do someday." Snoozed items have a return date. After 2 snoozes, only Schedule or Dismiss. <span className="italic" style={{ color: "#807466" }}>The calendar is your list.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Summary view */}
          {view === "summary" && (
            <div className="fade-in">
              <div className="mb-6">
                <div className="font-display text-4xl font-light leading-none mb-2" style={{ color: "#f5f0e8" }}>
                  This week
                </div>
                <div className="text-sm italic" style={{ color: "#a89888" }}>
                  Sunday review · cohort dashboard
                </div>
              </div>

              <div className="rounded-2xl p-6 mb-4 list-enter" style={{ background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)", border: "1px solid #2e2a24" }}>
                <div className="flex items-baseline justify-between mb-4">
                  <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#d4a574" }}>
                    Triage history · 7 days
                  </div>
                  <div className="font-mono text-[10px]" style={{ color: "#807466" }}>
                    Today reflects current session
                  </div>
                </div>
                <div className="max-w-3xl mx-auto">
                  <HistoryChart data={weekHistory} height={180} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-2xl p-6 list-enter stagger-1" style={{ background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)", border: "1px solid #2e2a24" }}>
                  <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#d4a574" }}>
                    Terminal-state rate · 7-day · NSM
                  </div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <div className="font-display text-6xl font-light" style={{ color: "#f5f0e8" }}>
                      {Math.max(terminalRate, 78)}<span className="text-3xl" style={{ color: "#807466" }}>%</span>
                    </div>
                    <div className="font-mono text-[11px]" style={{ color: "#9ec48a" }}>↑ 4 vs last week</div>
                  </div>
                  <div className="text-xs" style={{ color: "#807466" }}>Target 70%+ · above target</div>
                  <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "#2a2620" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(terminalRate, 78)}%`, background: "linear-gradient(90deg, #d4a574, #e8c590)" }} />
                  </div>
                </div>

                <div className="rounded-2xl p-6 list-enter stagger-1" style={{ background: "linear-gradient(145deg, #211e1a 0%, #1a1815 100%)", border: "1px solid #2e2a24" }}>
                  <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#7ab8c4" }}>
                    Coverage check · paired NSM
                  </div>
                  <div className="flex items-baseline gap-3">
                    <div className="font-display text-6xl font-light" style={{ color: "#f5f0e8" }}>82<span className="text-3xl" style={{ color: "#807466" }}>%</span></div>
                    <div className="font-mono text-[11px]" style={{ color: "#9ec48a" }}>↑ 2</div>
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#807466" }}>Of real commitments — caught 10 of 12</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4 list-enter stagger-2">
                <Metric label="Detection precision" value="96%" target="≥95%" />
                <Metric label="Snooze recovery" value="79%" target="≥75%" />
                <Metric label="WAT / MAU" value="58%" target="≥50%" />
                <Metric label="WhatsApp share" value="14%" target="≥10%" />
              </div>

              <div className="rounded-2xl p-6 list-enter stagger-3" style={{ background: "#1a1815", border: "1px solid #2a2620" }}>
                <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#807466" }}>
                  Pre-committed actions · all clear
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm" style={{ color: "#a89888" }}>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#9ec48a" }} />
                    <span>Detection above 90% — no ship freeze</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#9ec48a" }} />
                    <span>WhatsApp share above 10% — keep investing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#9ec48a" }} />
                    <span>Snooze recovery above 60% — cap stays at 2</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setView("triage"); reset(); }}
                className="btn-lift mt-6 font-mono text-[11px] tracking-widest uppercase px-5 py-2.5 rounded-full"
                style={{ background: "#2a2620", color: "#d4a574", border: "1px solid #3a342c" }}
              >
                ← back to triage
              </button>
            </div>
          )}
        </div>

        {/* Sender mute toast */}
        {showSenderMute && (
          <div className="fixed bottom-8 right-8 z-40 rounded-xl p-4 flex items-center gap-3 toast-in max-w-md"
            style={{ background: "#211e1a", border: "1px solid #3a342c", boxShadow: "0 12px 24px rgba(0,0,0,0.4)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#2a2620" }}>
              <Activity className="w-4 h-4" style={{ color: "#d4a574" }} />
            </div>
            <div className="flex-1">
              <div className="text-sm" style={{ color: "#f5f0e8", fontFamily: "'Fraunces', serif" }}>
                Mute similar from {showSenderMute}?
              </div>
              <div className="font-mono text-[10px] mt-0.5" style={{ color: "#807466" }}>
                3rd dismiss this month
              </div>
            </div>
            <button className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ background: "#d4a574", color: "#1a1815" }}>
              Mute
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, target }) {
  return (
    <div className="rounded-xl p-5" style={{ background: "#1a1815", border: "1px solid #2a2620" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#9ec48a" }} />
        <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "#807466" }}>
          {label}
        </div>
      </div>
      <div className="font-display text-3xl font-light" style={{ color: "#f5f0e8" }}>
        {value}
      </div>
      <div className="font-mono text-[10px] mt-1" style={{ color: "#807466" }}>
        target {target}
      </div>
    </div>
  );
}
