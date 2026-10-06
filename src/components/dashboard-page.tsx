"use client";

import { useState } from "react";
import { Bell, CalendarDays, Check, ChevronRight, CircleDollarSign, FileText, FolderLock, Home, LayoutDashboard, MessageSquareText, Settings, UserRound } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const tabs = [
  ["Overview", LayoutDashboard], ["Timeline", CalendarDays], ["Documents", FolderLock], ["Housing", Home], ["Budget", CircleDollarSign], ["Messages", MessageSquareText],
] as const;

export function DashboardPage() {
  const [active, setActive] = useState("Overview");
  const [tasks, setTasks] = useState([true, true, false, false]);
  const ready = 34 + tasks.filter(Boolean).length * 8;

  return <div className="dashboard-page"><aside className="dashboard-sidebar"><div className="dashboard-user"><span>DN</span><div><strong>Demo customer</strong><small>USA → Vietnam</small></div></div><nav>{tabs.map(([label, Icon]) => <button key={label} onClick={() => setActive(label)} className={active === label ? "is-active" : ""}><Icon />{label}</button>)}</nav><button><Settings /> Settings</button></aside><div className="dashboard-content"><header><div><p className="eyebrow">My move</p><h1>{active}</h1><p>USA → Vietnam · Target 15 March 2027</p></div><button aria-label="Notifications"><Bell /><span>2</span></button></header>{active === "Overview" ? <><div className="dashboard-overview"><article className="dashboard-progress-card"><div><span>Relocation readiness</span><strong>{ready}%</strong></div><Progress value={ready} /><p>Next milestone: professional immigration assessment</p></article><article className="next-appointment"><CalendarDays /><div><span>Next appointment</span><strong>Immigration consultation</strong><small>18 October 2026 · 09:00 ICT</small></div><ChevronRight /></article></div><div className="dashboard-live-grid"><section><div className="panel-head"><div><h2>Next tasks</h2><p>What moves the plan forward</p></div><Badge variant="possible">{tasks.filter(Boolean).length}/4 ready</Badge></div><div className="task-list">{["Review route summary", "Confirm household passports", "Upload marriage certificate metadata", "Shortlist two Da Nang neighborhoods"].map((task, index) => <label key={task} className={tasks[index] ? "is-done" : ""}><button onClick={() => setTasks((current) => current.map((value, item) => item === index ? !value : value))} aria-label={`Mark ${task} ${tasks[index] ? "not complete" : "complete"}`}>{tasks[index] ? <Check /> : null}</button><span>{task}<small>{index < 2 ? "Immigration" : index === 2 ? "Documents" : "Housing"}</small></span></label>)}</div></section><section><div className="panel-head"><div><h2>Document vault</h2><p>Metadata only in this demo</p></div><FolderLock /></div><div className="document-list">{["Passport", "Marriage certificate", "Degree", "Bank statement"].map((document, index) => <div key={document}><FileText /><span>{document}<small>{index < 2 ? "Recorded" : "Still needed"}</small></span><Badge variant={index < 2 ? "available" : "review"}>{index < 2 ? "Ready" : "Needed"}</Badge></div>)}</div><p className="secure-note">Production storage requires encryption, audit trails, secure URLs, malware scanning, MFA and retention controls.</p></section></div></> : <DashboardTab name={active} />}</div><nav className="dashboard-mobile-nav">{[["Home", LayoutDashboard], ["Plan", CalendarDays], ["Tasks", Check], ["Messages", MessageSquareText], ["Profile", UserRound]].map(([label, Icon]) => <button key={label as string}><Icon /><span>{label as string}</span></button>)}</nav></div>;
}

function DashboardTab({ name }: { name: string }) {
  const copy: Record<string, [string, string]> = {
    Timeline: ["Your complete move sequence", "Milestones from professional review through arrival and settling."],
    Documents: ["Secure document organization", "This demo stores placeholder metadata only—never real sensitive documents."],
    Housing: ["Saved homes and agent updates", "Eight illustrative properties are organized against your housing brief."],
    Budget: ["Planned, actual and remaining", "$18,400 planned against a $100,000 relocation and investment budget."],
    Messages: ["Your relocation team", "Two demo updates are waiting from the relocation manager and housing desk."],
  };
  const [title, description] = copy[name] ?? [name, "Demo module"];
  return <div className="dashboard-module"><span><LayoutDashboard /></span><Badge variant="review">Demo state</Badge><h2>{title}</h2><p>{description}</p><Button variant="secondary">Open {name.toLowerCase()} workspace</Button></div>;
}
