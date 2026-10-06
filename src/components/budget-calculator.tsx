"use client";

import { useMemo, useState } from "react";
import { Calculator, PiggyBank, WalletCards } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export function BudgetCalculator() {
  const [city, setCity] = useState("da-nang");
  const [household, setHousehold] = useState(2);
  const [rent, setRent] = useState(1200);
  const [shipping, setShipping] = useState(6500);

  const result = useMemo(() => {
    const cityFactor = city === "hcmc" ? 1.22 : city === "hanoi" ? 1.12 : 1;
    const monthly = Math.round((rent + 950 + household * 420) * cityFactor / 50) * 50;
    const cash = Math.round((shipping + household * 950 + rent * 3 + 4200) / 100) * 100;
    return { monthly, cash };
  }, [city, household, rent, shipping]);

  return (
    <div className="calculator-card">
      <div className="calculator-card__inputs">
        <div className="calculator-card__title"><Calculator /><div><Badge variant="review">Illustrative estimate</Badge><h3>Smart move budget</h3></div></div>
        <label><span>Destination city</span><select value={city} onChange={(event) => setCity(event.target.value)}><option value="da-nang">Da Nang</option><option value="hcmc">Ho Chi Minh City</option><option value="hanoi">Hanoi</option></select></label>
        <label><span>Household size <strong>{household}</strong></span><input type="range" min="1" max="6" value={household} onChange={(event) => setHousehold(Number(event.target.value))} /></label>
        <label><span>Target monthly rent <strong>{money.format(rent)}</strong></span><input type="range" min="500" max="4000" step="100" value={rent} onChange={(event) => setRent(Number(event.target.value))} /></label>
        <label><span>Shipping allowance <strong>{money.format(shipping)}</strong></span><input type="range" min="1000" max="30000" step="500" value={shipping} onChange={(event) => setShipping(Number(event.target.value))} /></label>
      </div>
      <div className="calculator-results">
        <div><span className="calculator-results__icon"><PiggyBank /></span><p>Cash needed to move</p><strong>{money.format(result.cash)}</strong><small>Flights, shipping, deposit, setup and emergency buffer</small></div>
        <div><span className="calculator-results__icon"><WalletCards /></span><p>Estimated monthly life</p><strong>{money.format(result.monthly)}</strong><small>Housing, utilities, food, transport and everyday living</small></div>
        <p className="estimate-note">Mock planning data. Verify costs, exchange rates and professional fees before financial decisions.</p>
      </div>
    </div>
  );
}
