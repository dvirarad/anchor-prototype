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
    <div className="min-h-screen w-full" style={{ background: "#F8F4F0", fontFamily: "'Source Serif 4', Georgia, serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:opsz,wght@8..60,300;8..60,400;8..60,500;8..60,600;8..60,700&family=JetBrains+Mono:wght@400;500&display=swap');
        .font-mono { font-family: 'JetBrains Mono', ui-monospace, monospace; }
        .font-display { font-family: 'Source Serif 4', Georgia, serif; }

        .grain {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.16'/%3E%3C/svg%3E");
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
        .queue-row:hover { background: #ffffff !important; }

        .stagger-1 { animation-delay: 0.05s; }
        .stagger-2 { animation-delay: 0.1s; }
        .stagger-3 { animation-delay: 0.15s; }
        .stagger-4 { animation-delay: 0.2s; }

        .kbd { display: inline-block; padding: 1px 6px; border-radius: 4px; background: #E4DED8; border: 1px solid #bdb5ad; color: #136342; font-family: 'JetBrains Mono', monospace; font-size: 10px; line-height: 1.4; }
      `}</style>

      <div className="relative min-h-screen" style={{ background: "#F8F4F0" }}>
        <div className="absolute inset-0 grain opacity-50 pointer-events-none mix-blend-multiply" />

        <div className="relative z-10 max-w-7xl mx-auto px-10 pt-10 pb-16">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: "#136342" }}>
                <Anchor className="w-5 h-5" style={{ color: "#FCF9F7" }} strokeWidth={2.5} />
              </div>
              <div>
                <div className="font-display text-4xl font-semibold tracking-tight" style={{ color: "#051714" }}>Anchor</div>
                <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#757575" }}>
                  Tuesday Edition · 7:42 AM · Desktop
                </div>
              </div>
            </div>

            {/* Tab bar — newspaper section heads */}
            <div className="flex gap-7 border-b" style={{ borderColor: "#bdb5ad" }}>
              {[
                { id: "triage", label: "Triage", count: items.length },
                { id: "snoozed", label: "Snoozed", count: snoozedQueue.length },
                { id: "summary", label: "Week", count: null },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setView(tab.id)}
                  className="font-mono text-[11px] tracking-widest uppercase pb-3 pt-1 transition-all flex items-center gap-2"
                  style={{
                    color: view === tab.id ? "#051714" : "#757575",
                    borderBottom: view === tab.id ? "2px solid #136342" : "2px solid transparent",
                    marginBottom: "-1px",
                  }}
                >
                  {tab.label}
                  {tab.count !== null && tab.count > 0 && (
                    <span className="font-mono text-[9px] px-1.5 py-0.5 rounded-sm" style={{
                      background: view === tab.id ? "#136342" : "#E4DED8",
                      color: view === tab.id ? "#FCF9F7" : "#343434",
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
                    <div className="font-display text-3xl font-light leading-none" style={{ color: "#051714" }}>
                      Morning triage
                    </div>
                    <div className="font-mono text-xs" style={{ color: "#757575" }}>
                      {decisions.length}/{decisions.length + items.length}
                    </div>
                  </div>
                  <div className="text-sm italic" style={{ color: "#343434" }}>
                    {items.length > 0
                      ? `${items.length} commitment${items.length > 1 ? "s" : ""} · click or use ↑↓`
                      : "All clear. Coffee's still hot."}
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    {[...Array(decisions.length + items.length)].map((_, i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-500"
                        style={{ background: i < decisions.length ? "#136342" : "#E4DED8" }}
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
                            background: isActive ? "#FCF9F7" : "#ffffff",
                            border: `1px solid ${isActive ? "#136342" : "#E4DED8"}`,
                            boxShadow: isActive ? "0 8px 24px -8px rgba(19,99,66,0.18)" : "none",
                          }}
                        >
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: itemCfg.bg }}>
                            <itemCfg.Icon className="w-3.5 h-3.5" style={{ color: itemCfg.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-[9px] tracking-widest uppercase mb-1 truncate" style={{ color: isActive ? "#136342" : "#757575" }}>
                              {item.sourceFrom}
                            </div>
                            <div className="font-display text-[15px] font-light leading-snug" style={{ color: isActive ? "#051714" : "#343434" }}>
                              {item.text}
                            </div>
                            {item.snoozeCount > 0 && (
                              <div className="mt-1.5 inline-flex items-center gap-1 px-1.5 py-0.5 rounded" style={{ background: "#dcefe5" }}>
                                <Clock className="w-2.5 h-2.5" style={{ color: "#136342" }} />
                                <span className="font-mono text-[9px]" style={{ color: "#136342" }}>
                                  {item.snoozeCount}/2 snoozed
                                </span>
                              </div>
                            )}
                          </div>
                          {isActive && <ChevronRight className="w-4 h-4 mt-2 flex-shrink-0" style={{ color: "#136342" }} />}
                        </button>
                      );
                    })}
                  </div>
                ) : null}

                <div className="mt-6 px-1 text-xs italic" style={{ color: "#757575", fontFamily: "'Source Serif 4', serif" }}>
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
                        background: "#FCF9F7",
                        border: "1px solid #E4DED8",
                        boxShadow: "0 1px 2px rgba(5,23,20,0.06), 0 12px 32px rgba(5,23,20,0.08)",
                      }}
                    >
                      {current.snoozeCount > 0 && (
                        <div className="mb-5 flex items-center gap-2 px-3 py-1.5 rounded-md w-fit" style={{ background: "#dcefe5", border: "1px solid #136342" }}>
                          <Clock className="w-3 h-3" style={{ color: "#136342" }} />
                          <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#136342" }}>
                            Snoozed Friday → today · {current.snoozeCount} of 2 used
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: cfg.bg }}>
                          <cfg.Icon className="w-4 h-4" style={{ color: cfg.color }} />
                        </div>
                        <div>
                          <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#757575" }}>
                            {current.sourceDetail}
                          </div>
                          <div className="font-mono text-[11px]" style={{ color: "#343434" }}>
                            {current.sourceFrom}
                          </div>
                        </div>
                      </div>

                      {current.transcript && (
                        <div className="mb-4 px-4 py-3 rounded-md text-sm italic" style={{ background: "#eef0e3", color: "#136342", border: "1px solid #a8d4be", fontFamily: "'Source Serif 4', serif" }}>
                          <span className="font-mono text-[9px] tracking-widest uppercase mr-2" style={{ color: "#15715f" }}>Whisper</span>
                          {current.transcript}
                        </div>
                      )}

                      <div className="font-display text-4xl font-light leading-tight mb-8" style={{ color: "#051714" }}>
                        {current.text}
                      </div>

                      {/* Suggested slots */}
                      {current.suggestedSlots && current.suggestedSlots.length > 0 && (
                        <div className="mb-5">
                          <div className="flex items-center justify-between mb-2.5">
                            <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#136342" }}>
                              Schedule · suggested slots
                            </div>
                            <div className="font-mono text-[9px]" style={{ color: "#757575" }}>
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
                                  background: i === 0 ? "#136342" : "#FCF9F7",
                                  color: i === 0 ? "#FCF9F7" : "#051714",
                                  border: i === 0 ? "1px solid #136342" : "1px solid #E4DED8",
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
                            <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#757575" }}>
                              Snooze · {current.snoozeCount + 1} of 2
                            </div>
                            <div className="font-mono text-[9px]" style={{ color: "#757575" }}>
                              <span className="kbd">Z</span> picks first
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            {snoozeOptions.slice(0, 4).map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleSnooze(opt)}
                                className="btn-lift p-3 rounded-xl text-left"
                                style={{ background: "#ffffff", border: "1px solid #E4DED8" }}
                              >
                                <div className="font-display text-sm font-light" style={{ color: "#051714" }}>{opt.label}</div>
                                <div className="font-mono text-[10px] mt-0.5" style={{ color: "#757575" }}>{opt.hint}</div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="mb-5 px-4 py-3 rounded-md text-xs italic" style={{ background: "#dcefe5", color: "#136342", border: "1px solid #136342" }}>
                          Snooze locked — this commitment has been snoozed twice. Schedule or dismiss only.
                        </div>
                      )}

                      {/* Dismiss */}
                      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: "#E4DED8" }}>
                        <button
                          onClick={handleDismiss}
                          className="btn-lift flex items-center gap-2 px-4 py-2.5 rounded-lg"
                          style={{ background: "#E4DED8", color: "#343434", border: "1px solid #bdb5ad" }}
                        >
                          <X className="w-4 h-4" strokeWidth={2.2} />
                          <span className="font-mono text-[10px] tracking-widest uppercase font-medium">Dismiss</span>
                          <span className="kbd ml-1">X</span>
                        </button>
                        <div className="font-mono text-[10px]" style={{ color: "#757575" }}>
                          <span className="kbd mr-1">↑</span><span className="kbd mr-2">↓</span>navigate
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl p-16 text-center fade-in" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
                    <div className="font-display text-7xl font-light mb-4" style={{ color: "#136342" }}>
                      Done.
                    </div>
                    <div className="text-base italic mb-8" style={{ color: "#343434" }}>
                      {scheduledCount} scheduled · {snoozedCount} snoozed · {dismissedCount} dismissed
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button
                        onClick={() => setView("summary")}
                        className="btn-lift font-mono text-[11px] tracking-widest uppercase px-6 py-3 rounded-full"
                        style={{ background: "#136342", color: "#FCF9F7" }}
                      >
                        See your week →
                      </button>
                      <button
                        onClick={reset}
                        className="btn-lift font-mono text-[10px] tracking-widest uppercase px-5 py-3 rounded-full"
                        style={{ background: "transparent", color: "#757575", border: "1px solid #E4DED8" }}
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
                <div className="font-display text-4xl font-light leading-none mb-2" style={{ color: "#051714" }}>
                  Waiting room
                </div>
                <div className="text-sm italic" style={{ color: "#343434" }}>
                  {snoozedQueue.length} commitment{snoozedQueue.length !== 1 ? "s" : ""} on a re-check date. Each one comes back to you.
                </div>
              </div>

              {snoozedQueue.length === 0 ? (
                <div className="text-center py-16 rounded-2xl" style={{ border: "1px dashed #E4DED8" }}>
                  <Clock className="w-10 h-10 mx-auto mb-3" style={{ color: "#bdb5ad" }} />
                  <div className="font-display text-xl font-light mb-1" style={{ color: "#757575" }}>
                    Nothing in the waiting room.
                  </div>
                  <div className="text-xs" style={{ color: "#757575" }}>
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
                          background: "#FCF9F7",
                          border: "1px solid #E4DED8",
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: itemCfg.bg }}>
                            <itemCfg.Icon className="w-3.5 h-3.5" style={{ color: itemCfg.color }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-[10px] tracking-widest uppercase mb-1" style={{ color: "#757575" }}>
                              {item.sourceFrom}
                            </div>
                            <div className="font-display text-lg font-light leading-snug mb-3" style={{ color: "#051714" }}>
                              {item.text}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mb-3">
                              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ background: "#ffffff" }}>
                                <Clock className="w-2.5 h-2.5" style={{ color: "#136342" }} />
                                <span className="font-mono text-[10px]" style={{ color: "#136342" }}>
                                  Returns {item.returnsOn}
                                </span>
                              </div>
                              <div className="font-mono text-[10px]" style={{ color: "#757575" }}>
                                {item.daysUntil}d · snooze {item.snoozeCount}/2
                              </div>
                            </div>
                            <button
                              onClick={() => bringBackSnoozed(item)}
                              className="btn-lift font-mono text-[9px] tracking-widest uppercase px-3 py-1.5 rounded-full"
                              style={{ background: "#E4DED8", color: "#136342", border: "1px solid #bdb5ad" }}
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

              <div className="mt-8 p-5 rounded-xl max-w-2xl" style={{ background: "#ffffff", border: "1px solid #ffffff" }}>
                <div className="flex items-start gap-3">
                  <div className="w-1 self-stretch rounded-full" style={{ background: "#136342" }} />
                  <div>
                    <div className="font-mono text-[10px] tracking-widest uppercase mb-1.5" style={{ color: "#757575" }}>
                      The waiting room rule
                    </div>
                    <div className="text-sm leading-relaxed" style={{ color: "#343434", fontFamily: "'Source Serif 4', serif" }}>
                      Anchor doesn't keep a list of "things to do someday." Snoozed items have a return date. After 2 snoozes, only Schedule or Dismiss. <span className="italic" style={{ color: "#757575" }}>The calendar is your list.</span>
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
                <div className="font-display text-4xl font-light leading-none mb-2" style={{ color: "#051714" }}>
                  This week
                </div>
                <div className="text-sm italic" style={{ color: "#343434" }}>
                  Sunday review · cohort dashboard
                </div>
              </div>

              <div className="rounded-2xl p-6 mb-4 list-enter" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
                <div className="flex items-baseline justify-between mb-4">
                  <div className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "#136342" }}>
                    Triage history · 7 days
                  </div>
                  <div className="font-mono text-[10px]" style={{ color: "#757575" }}>
                    Today reflects current session
                  </div>
                </div>
                <div className="max-w-3xl mx-auto">
                  <HistoryChart data={weekHistory} height={180} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-2xl p-6 list-enter stagger-1" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
                  <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#136342" }}>
                    Terminal-state rate · 7-day · NSM
                  </div>
                  <div className="flex items-baseline gap-3 mb-1">
                    <div className="font-display text-6xl font-light" style={{ color: "#051714" }}>
                      {Math.max(terminalRate, 78)}<span className="text-3xl" style={{ color: "#757575" }}>%</span>
                    </div>
                    <div className="font-mono text-[11px]" style={{ color: "#15715f" }}>↑ 4 vs last week</div>
                  </div>
                  <div className="text-xs" style={{ color: "#757575" }}>Target 70%+ · above target</div>
                  <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: "#E4DED8" }}>
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(terminalRate, 78)}%`, background: "linear-gradient(90deg, #136342, #57B98E)" }} />
                  </div>
                </div>

                <div className="rounded-2xl p-6 list-enter stagger-1" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
                  <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#136342" }}>
                    Coverage check · paired NSM
                  </div>
                  <div className="flex items-baseline gap-3">
                    <div className="font-display text-6xl font-light" style={{ color: "#051714" }}>82<span className="text-3xl" style={{ color: "#757575" }}>%</span></div>
                    <div className="font-mono text-[11px]" style={{ color: "#15715f" }}>↑ 2</div>
                  </div>
                  <div className="text-xs mt-1" style={{ color: "#757575" }}>Of real commitments — caught 10 of 12</div>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4 list-enter stagger-2">
                <Metric label="Detection precision" value="96%" target="≥95%" />
                <Metric label="Snooze recovery" value="79%" target="≥75%" />
                <Metric label="WAT / MAU" value="58%" target="≥50%" />
                <Metric label="WhatsApp share" value="14%" target="≥10%" />
              </div>

              <div className="rounded-2xl p-6 list-enter stagger-3" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
                <div className="font-mono text-[10px] tracking-widest uppercase mb-3" style={{ color: "#757575" }}>
                  Pre-committed actions · all clear
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm" style={{ color: "#343434" }}>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#15715f" }} />
                    <span>Detection above 90% — no ship freeze</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#15715f" }} />
                    <span>WhatsApp share above 10% — keep investing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Check className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" style={{ color: "#15715f" }} />
                    <span>Snooze recovery above 60% — cap stays at 2</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => { setView("triage"); reset(); }}
                className="btn-lift mt-6 font-mono text-[11px] tracking-widest uppercase px-5 py-2.5 rounded-full"
                style={{ background: "#E4DED8", color: "#136342", border: "1px solid #bdb5ad" }}
              >
                ← back to triage
              </button>
            </div>
          )}
        </div>

        {/* Sender mute toast */}
        {showSenderMute && (
          <div className="fixed bottom-8 right-8 z-40 rounded-xl p-4 flex items-center gap-3 toast-in max-w-md"
            style={{ background: "#FCF9F7", border: "1px solid #bdb5ad", boxShadow: "0 1px 2px rgba(5,23,20,0.06), 0 8px 20px rgba(5,23,20,0.1)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "#E4DED8" }}>
              <Activity className="w-4 h-4" style={{ color: "#136342" }} />
            </div>
            <div className="flex-1">
              <div className="text-sm" style={{ color: "#051714", fontFamily: "'Source Serif 4', serif" }}>
                Mute similar from {showSenderMute}?
              </div>
              <div className="font-mono text-[10px] mt-0.5" style={{ color: "#757575" }}>
                3rd dismiss this month
              </div>
            </div>
            <button className="font-mono text-[10px] tracking-widest uppercase px-3 py-1.5 rounded-full" style={{ background: "#136342", color: "#FCF9F7" }}>
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
    <div className="rounded-xl p-5" style={{ background: "#FCF9F7", border: "1px solid #E4DED8" }}>
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#15715f" }} />
        <div className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "#757575" }}>
          {label}
        </div>
      </div>
      <div className="font-display text-3xl font-light" style={{ color: "#051714" }}>
        {value}
      </div>
      <div className="font-mono text-[10px] mt-1" style={{ color: "#757575" }}>
        target {target}
      </div>
    </div>
  );
}
