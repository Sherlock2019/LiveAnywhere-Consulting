"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Check, CircleUserRound, Heart, Home, Landmark, Route, Sparkles, WalletCards } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { countryById } from "@/data/countries";
import { goals } from "@/data/content";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { defaultMoveSearch, type MoveSearchState } from "@/components/relocation-search";

const schema = z.object({
  ageRange: z.string().min(1),
  citizenship: z.string().min(2),
  maritalStatus: z.string(),
  profession: z.string(),
  education: z.string(),
  employment: z.string(),
  spouse: z.boolean(),
  spouseNationality: z.string(),
  children: z.coerce.number().min(0).max(8),
  parentsMoving: z.boolean(),
  pets: z.coerce.number().min(0).max(8),
  selectedGoals: z.array(z.string()).min(1),
  incomeBand: z.string(),
  savingsBand: z.string(),
  relocationBudget: z.coerce.number().min(5000),
  monthlyBudget: z.coerce.number().min(1000),
  needEmployment: z.boolean(),
  workMode: z.string(),
  businessGoal: z.string(),
  lifestyle: z.array(z.string()),
  housingType: z.string(),
  bedrooms: z.coerce.number().min(0).max(8),
  moveDate: z.string(),
});

type FormData = z.output<typeof schema>;
type FormInput = z.input<typeof schema>;
const steps = ["You", "Family", "Goal", "Money", "Work", "Business", "Lifestyle", "Housing", "Timeline"];

export function AssessmentWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [move, setMove] = useState<MoveSearchState>(defaultMoveSearch);
  const { register, handleSubmit, watch, getValues, setValue, trigger, formState: { errors } } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ageRange: "55-69", citizenship: "United States", maritalStatus: "Married", profession: "", education: "Bachelor's degree", employment: "Retired",
      spouse: true, spouseNationality: "United States", children: 0, parentsMoving: false, pets: 0, selectedGoals: ["retire"], incomeBand: "$5,000–$10,000/month",
      savingsBand: "$250,000–$1,000,000", relocationBudget: 100000, monthlyBudget: 4000, needEmployment: false, workMode: "Flexible",
      businessGoal: "No business activity", lifestyle: ["Beach", "Healthcare", "Low cost"], housingType: "Rent", bedrooms: 2, moveDate: "2027-03-15",
    },
  });

  useEffect(() => {
    const saved = localStorage.getItem("ran-move");
    if (!saved) return;
    try {
      const parsed = { ...defaultMoveSearch, ...JSON.parse(saved) } as MoveSearchState;
      setMove(parsed);
      setValue("monthlyBudget", parsed.monthlyBudget);
      setValue("relocationBudget", parsed.relocationBudget);
      setValue("pets", parsed.pets);
      setValue("children", parsed.children);
      setValue("selectedGoals", [parsed.goal]);
    } catch { /* preserve defaults */ }
  }, [setValue]);

  const selectedGoals = watch("selectedGoals");
  const lifestyles = watch("lifestyle");
  const next = async () => {
    const valid = await trigger();
    if (valid) setStep((value) => Math.min(steps.length - 1, value + 1));
  };
  const toggleArray = (field: "selectedGoals" | "lifestyle", item: string) => {
    const current = getValues(field);
    setValue(field, current.includes(item) ? current.filter((value) => value !== item) : [...current, item], { shouldValidate: true });
  };
  const submit = (data: FormData) => {
    const completedMove = { ...move, goal: data.selectedGoals[0], children: data.children, pets: data.pets, monthlyBudget: data.monthlyBudget, relocationBudget: data.relocationBudget, moveDate: data.moveDate };
    localStorage.setItem("ran-move", JSON.stringify(completedMove));
    localStorage.setItem("ran-assessment", JSON.stringify(data));
    const params = new URLSearchParams({ origin: completedMove.originCountry, destination: completedMove.destinationCountry, goal: completedMove.goal, people: String(completedMove.adults + completedMove.children), monthlyBudget: String(data.monthlyBudget), relocationBudget: String(data.relocationBudget), timeframe: data.moveDate, duration: completedMove.duration, assessed: "true" });
    router.push(`/results?${params.toString()}`);
  };

  return (
    <div className="assessment-shell">
      <header className="assessment-head">
        <div><p className="eyebrow">Your move</p><h1>{countryById(move.originCountry).flag} {countryById(move.originCountry).shortName} <ArrowRight /> {countryById(move.destinationCountry).flag} {countryById(move.destinationCountry).shortName}</h1><p>Step {step + 1} of {steps.length} · {steps[step]}</p></div>
        <div className="assessment-head__progress"><span>{Math.round(((step + 1) / steps.length) * 100)}% complete</span><Progress value={((step + 1) / steps.length) * 100} /></div>
      </header>
      <div className="assessment-layout">
        <ol className="assessment-steps" aria-label="Assessment progress">{steps.map((name, index) => <li className={index === step ? "is-active" : index < step ? "is-complete" : ""} key={name}><span>{index < step ? <Check /> : index + 1}</span>{name}</li>)}</ol>
        <form onSubmit={handleSubmit(submit)} className="assessment-card">
          {step === 0 ? <Step icon={<CircleUserRound />} title="Tell us about you" description="Ranges are enough for this first assessment."><div className="form-grid"><label><span>Age range</span><select {...register("ageRange")}><option>18-30</option><option>31-44</option><option>45-54</option><option>55-69</option><option>70+</option></select></label><label><span>Citizenship</span><input {...register("citizenship")} /></label><label><span>Marital status</span><select {...register("maritalStatus")}><option>Single</option><option>Married</option><option>Partnered</option><option>Other / prefer not to say</option></select></label><label><span>Profession</span><input {...register("profession")} placeholder="Software engineer, teacher…" /></label><label><span>Education</span><select {...register("education")}><option>Secondary school</option><option>Vocational qualification</option><option>Bachelor&apos;s degree</option><option>Master&apos;s degree</option><option>Doctorate</option></select></label><label><span>Current employment</span><select {...register("employment")}><option>Employed</option><option>Self-employed</option><option>Remote worker</option><option>Retired</option><option>Not currently working</option></select></label></div></Step> : null}
          {step === 1 ? <Step icon={<Heart />} title="Who is moving with you?" description="This shapes the document, school, pet and housing plan."><div className="form-grid"><Toggle label="Spouse or partner moving" checked={watch("spouse")} onChange={(value) => setValue("spouse", value)} /><label><span>Spouse nationality</span><input {...register("spouseNationality")} /></label><label><span>Children</span><input type="number" {...register("children")} /></label><Toggle label="Parents moving" checked={watch("parentsMoving")} onChange={(value) => setValue("parentsMoving", value)} /><label><span>Pets</span><input type="number" {...register("pets")} /></label></div></Step> : null}
          {step === 2 ? <Step icon={<Sparkles />} title="What do you want your next life to include?" description="Choose every goal that matters."><div className="choice-grid">{goals.map((goal) => <button type="button" key={goal.id} className={selectedGoals.includes(goal.id) ? "is-selected" : ""} onClick={() => toggleArray("selectedGoals", goal.id)}><span>{goal.icon}</span>{goal.label}</button>)}</div>{errors.selectedGoals ? <p className="form-error">Choose at least one goal.</p> : null}</Step> : null}
          {step === 3 ? <Step icon={<WalletCards />} title="Give us planning ranges" description="Exact account balances are not needed."><div className="form-grid"><label><span>Monthly income</span><select {...register("incomeBand")}><option>Under $2,500/month</option><option>$2,500–$5,000/month</option><option>$5,000–$10,000/month</option><option>$10,000+/month</option></select></label><label><span>Savings and assets</span><select {...register("savingsBand")}><option>Under $50,000</option><option>$50,000–$250,000</option><option>$250,000–$1,000,000</option><option>$1,000,000+</option></select></label><label><span>Monthly life budget</span><input type="number" step="250" {...register("monthlyBudget")} /></label><label><span>Relocation / investment budget</span><input type="number" step="5000" {...register("relocationBudget")} /></label></div></Step> : null}
          {step === 4 ? <Step icon={<Route />} title="Will work be part of the move?" description="We use this to organize job and sponsorship review—not promise a job or visa."><div className="form-grid"><Toggle label="I need employment" checked={watch("needEmployment")} onChange={(value) => setValue("needEmployment", value)} /><label><span>Preferred work mode</span><select {...register("workMode")}><option>On-site</option><option>Hybrid</option><option>Remote</option><option>Flexible</option></select></label><label className="full"><span>Profession or target role</span><input {...register("profession")} placeholder="Tell us the role you want" /></label></div></Step> : null}
          {step === 5 ? <Step icon={<Landmark />} title="Any business or investment plans?" description="This determines whether specialist business and immigration review is useful."><div className="radio-stack">{["Establish a company", "Buy a company", "Invest", "Become self-employed", "Open a representative office", "No business activity"].map((item) => <label key={item}><input type="radio" value={item} {...register("businessGoal")} /><span>{item}</span></label>)}</div></Step> : null}
          {step === 6 ? <Step icon={<Sparkles />} title="What should daily life feel like?" description="Select your strongest destination priorities."><div className="choice-grid choice-grid--text">{["Beach", "Big city", "Quiet", "Low cost", "Healthcare", "Schools", "Nightlife", "Business opportunities", "International community", "Climate", "Public transport", "Safety"].map((item) => <button type="button" key={item} className={lifestyles.includes(item) ? "is-selected" : ""} onClick={() => toggleArray("lifestyle", item)}>{item}</button>)}</div></Step> : null}
          {step === 7 ? <Step icon={<Home />} title="What kind of home do you need?" description="We’ll match the budget and destination shortlist to your housing brief."><div className="form-grid"><label><span>Rent, buy or temporary</span><select {...register("housingType")}><option>Rent</option><option>Buy</option><option>Temporary first</option><option>Not sure</option></select></label><label><span>Bedrooms</span><input type="number" {...register("bedrooms")} /></label></div></Step> : null}
          {step === 8 ? <Step icon={<Route />} title="When should the plan lead to departure?" description="We’ll work backward from this date."><label className="date-field"><span>Target move date</span><input type="date" {...register("moveDate")} /></label><div className="assessment-ready"><Check /><div><h3>Your first relocation plan is ready to build.</h3><p>It will include route categories, budget ranges, recommended cities and your next professional-review step.</p></div></div></Step> : null}

          <div className="assessment-actions">
            <Button type="button" variant="secondary" onClick={() => setStep((value) => Math.max(0, value - 1))} disabled={step === 0}><ArrowLeft /> Back</Button>
            {step < steps.length - 1 ? <Button type="button" onClick={next}>Continue <ArrowRight /></Button> : <Button type="submit">Build my personal plan</Button>}
          </div>
        </form>
        <aside className="assessment-glance"><p className="eyebrow">At a glance</p><h2>Your move</h2><dl><div><dt>Route</dt><dd>{countryById(move.originCountry).shortName} → {countryById(move.destinationCountry).shortName}</dd></div><div><dt>Household</dt><dd>{move.adults + Number(watch("children") || 0)} people</dd></div><div><dt>Goals</dt><dd>{selectedGoals.map((goal) => goals.find((item) => item.id === goal)?.label).filter(Boolean).join(", ")}</dd></div><div><dt>Monthly budget</dt><dd>${Number(watch("monthlyBudget") || 0).toLocaleString()}</dd></div></dl><p className="legal-note">This assessment is informational and is not a legal eligibility score.</p></aside>
      </div>
    </div>
  );
}

function Step({ icon, title, description, children }: { icon: React.ReactNode; title: string; description: string; children: React.ReactNode }) {
  return <section className="assessment-step"><div className="assessment-step__title"><span>{icon}</span><div><p className="eyebrow">Assessment</p><h2>{title}</h2><p>{description}</p></div></div>{children}</section>;
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="toggle-field"><span>{label}</span><button type="button" role="switch" aria-checked={checked} className={checked ? "is-on" : ""} onClick={() => onChange(!checked)}><span /></button></label>;
}
