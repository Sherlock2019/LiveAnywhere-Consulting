import { CalendarDays, CheckCircle2, CircleDollarSign, FileText, House, MessageSquareText } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const cards = [
  { name: "Immigration", detail: "6 of 10 documents ready", icon: FileText, pct: 60 },
  { name: "Housing", detail: "8 saved properties", icon: House, pct: 45 },
  { name: "Move budget", detail: "$18,400 of $32,000 planned", icon: CircleDollarSign, pct: 58 },
  { name: "Messages", detail: "2 updates from your team", icon: MessageSquareText, pct: 80 },
];

export function DashboardPreview() {
  return (
    <div className="dashboard-preview">
      <aside className="dashboard-preview__side">
        <span className="dashboard-preview__logo">RAN</span>
        {["Overview", "My plan", "Tasks", "Documents", "Housing", "Messages"].map((item, index) => <span className={index === 0 ? "is-active" : ""} key={item}>{item}</span>)}
      </aside>
      <div className="dashboard-preview__main">
        <header><div><span className="eyebrow">My move</span><h3>USA → Vietnam</h3></div><div className="dashboard-date"><CalendarDays /><span>15 March 2027<small>Target move date</small></span></div></header>
        <div className="dashboard-readiness"><div><strong>42%</strong><span>Move ready</span></div><Progress value={42} /><p><CheckCircle2 /> Your next milestone is the professional immigration assessment.</p></div>
        <div className="dashboard-cards">{cards.map((card) => <article key={card.name}><card.icon /><h4>{card.name}</h4><p>{card.detail}</p><Progress value={card.pct} /></article>)}</div>
      </div>
    </div>
  );
}
