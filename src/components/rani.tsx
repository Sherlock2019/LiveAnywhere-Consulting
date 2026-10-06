"use client";

import { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const prompts = [
  "Can I retire in Vietnam?",
  "Which city fits a $4,000 budget?",
  "What should I do next?",
];

const answers: Record<string, string> = {
  "Can I retire in Vietnam?": "Vietnam does not currently publish a general retirement-visa category in the official sources reviewed for this demo. I can organize possible family, business, work or exploratory routes for professional review.",
  "Which city fits a $4,000 budget?": "Da Nang, Ho Chi Minh City and Hanoi all fit the illustrative lifestyle budget shown in this demo. Da Nang leaves the largest buffer; HCMC offers the broadest job market.",
  "What should I do next?": "Confirm your goal and household, then request a professional route review before booking a move or making financial commitments.",
};

export function RaniAssistant() {
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState("I can explain general relocation information and organize your next steps. I do not provide legal advice.");

  return (
    <>
      <button className="rani-launch" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="rani-panel">
        <MessageCircle aria-hidden="true" />
        <span>Ask RANI</span>
      </button>
      {open ? (
        <aside className="rani-panel" id="rani-panel" aria-label="RANI relocation assistant">
          <div className="rani-panel__head">
            <span className="rani-panel__icon"><Bot aria-hidden="true" /></span>
            <div><strong>RANI</strong><span>Relocation information assistant</span></div>
            <button onClick={() => setOpen(false)} aria-label="Close RANI"><X /></button>
          </div>
          <div className="rani-panel__body" aria-live="polite">
            <p>{answer}</p>
            <div className="rani-prompts">
              {prompts.map((prompt) => <button key={prompt} onClick={() => setAnswer(answers[prompt])}>{prompt}</button>)}
            </div>
          </div>
          <div className="rani-panel__foot">
            <input aria-label="Message RANI" placeholder="Ask about your move" />
            <Button size="icon" aria-label="Send message" onClick={() => setAnswer("This demo can answer the suggested questions. Connect a production AI service before launch.")}><Send /></Button>
          </div>
        </aside>
      ) : null}
    </>
  );
}
