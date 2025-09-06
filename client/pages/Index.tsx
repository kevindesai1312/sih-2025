import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { DemoResponse, MedicinesResponse, SymptomCheckResult, SymptomCheckInput } from "@shared/api";
import { Activity, Brain, Database, Languages, MapPin, Server, Stethoscope } from "lucide-react";

export default function Index() {
  const { t } = useI18n();
  const [exampleFromServer, setExampleFromServer] = useState("");
  useEffect(() => {
    fetchDemo();
  }, []);
  const fetchDemo = async () => {
    try {
      const response = await fetch("/api/demo");
      const data = (await response.json()) as DemoResponse;
      setExampleFromServer(data.message);
    } catch (error) {
      console.error("Error fetching hello:", error);
    }
  };

  return (
    <div className="bg-gradient-to-b from-secondary to-white">
      <Hero />
      <Stats />
      <Features />
      <div className="container grid gap-6 py-10 md:grid-cols-2">
        <SymptomChecker />
        <OfflineRecords />
      </div>
      <MedicineAvailability />
      <Architecture />
      <Stakeholders />
      <Outcomes />
      <FooterDiagram />
      <p className="sr-only">{exampleFromServer}</p>
    </div>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg className="absolute -top-24 -right-24 opacity-20" width="400" height="400" viewBox="0 0 200 200">
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          <circle cx="100" cy="100" r="90" fill="url(#g)" />
        </svg>
      </div>
      <div className="container py-16 md:py-24 text-center md:text-left grid md:grid-cols-2 items-center gap-10">
        <div>
          <Badge className="mb-4" variant="secondary">{t("tagline")}</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
            {t("hero_title")}
          </h1>
          <p className="mt-4 text-muted-foreground md:text-lg">
            {t("hero_sub")}
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Button asChild size="lg">
              <a href="#symptom">{t("cta_assess")}</a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#records">{t("cta_records")}</a>
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Languages className="h-4 w-4 text-primary" /> {t("f1_title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{t("f1_desc")}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Database className="h-4 w-4 text-primary" /> {t("f2_title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{t("f2_desc")}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" /> {t("f3_title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{t("f3_desc")}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2"><Brain className="h-4 w-4 text-primary" /> {t("f4_title")}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{t("f4_desc")}</CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const { t } = useI18n();
  return (
    <section className="container py-6 grid gap-4 md:grid-cols-2">
      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">31%</div>
            <div className="text-muted-foreground">{t("stats_connectivity")}</div>
          </div>
          <Activity className="h-10 w-10 text-primary" />
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6 flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">31% CAGR</div>
            <div className="text-muted-foreground">{t("stats_growth")}</div>
          </div>
          <Stethoscope className="h-10 w-10 text-primary" />
        </CardContent>
      </Card>
    </section>
  );
}

function Features() {
  const { t } = useI18n();
  return (
    <section id="features" className="container py-10">
      <h2 className="text-2xl md:text-3xl font-bold">{t("features_title")}</h2>
      <div className="mt-6 grid gap-6 md:grid-cols-4">
        <FeatureCard icon={<Languages className="h-5 w-5" />} title={t("f1_title")} desc={t("f1_desc")} />
        <FeatureCard icon={<Database className="h-5 w-5" />} title={t("f2_title")} desc={t("f2_desc")} />
        <FeatureCard icon={<MapPin className="h-5 w-5" />} title={t("f3_title")} desc={t("f3_desc")} />
        <FeatureCard icon={<Brain className="h-5 w-5" />} title={t("f4_title")} desc={t("f4_desc")} />
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <div className="p-2 rounded-md bg-secondary text-primary">{icon}</div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
    </Card>
  );
}

function SymptomChecker() {
  const { t } = useI18n();
  const [input, setInput] = useState<SymptomCheckInput>({ age: 30, symptoms: [], notes: "" });
  const [result, setResult] = useState<SymptomCheckResult | null>(null);

  const options = [
    { key: "fever", label: "Fever" },
    { key: "cough", label: "Cough" },
    { key: "breath", label: "Breathlessness" },
    { key: "chest", label: "Chest pain" },
    { key: "injury", label: "Injury" },
    { key: "diarrhea", label: "Diarrhea" },
    { key: "rash", label: "Rash" },
    { key: "vomit", label: "Vomiting" },
  ];

  function check() {
    const r = simpleTriage(input);
    setResult(r);
  }

  return (
    <Card id="symptom">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Brain className="h-5 w-5 text-primary" /> {t("symptom_title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Age</label>
            <Input type="number" value={input.age} min={0} max={120} onChange={(e) => setInput((s) => ({ ...s, age: Number(e.target.value) }))} />
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-2">{t("symptom_symptoms")}</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {options.map((opt) => (
              <label key={opt.key} className="flex items-center gap-2 rounded-md border p-2">
                <Checkbox
                  checked={input.symptoms.includes(opt.key)}
                  onCheckedChange={(v) =>
                    setInput((s) => ({
                      ...s,
                      symptoms: v ? [...s.symptoms, opt.key] : s.symptoms.filter((k) => k !== opt.key),
                    }))
                  }
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">{t("symptom_other")}</label>
          <Textarea rows={3} value={input.notes} onChange={(e) => setInput((s) => ({ ...s, notes: e.target.value }))} />
        </div>
        <div className="flex justify-end">
          <Button onClick={check}>{t("symptom_check")}</Button>
        </div>
        {result && (
          <div className="rounded-md border p-3">
            <div className="text-sm font-semibold">{t("symptom_result")}:</div>
            <div className="mt-1 text-sm">
              <span className="font-medium">Triage:</span> {result.level}
            </div>
            <div className="mt-1 text-sm">
              <span className="font-medium">Advice:</span> {result.advice}
            </div>
            {result.redFlags.length > 0 && (
              <div className="mt-1 text-sm text-destructive">
                <span className="font-medium">Red flags:</span> {result.redFlags.join(", ")}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function simpleTriage(input: SymptomCheckInput): SymptomCheckResult {
  const s = new Set(input.symptoms);
  const redFlags: string[] = [];
  if (s.has("chest")) redFlags.push("chest pain");
  if (s.has("breath")) redFlags.push("breathlessness");
  if (input.age > 65 && (s.has("fever") || s.has("cough"))) redFlags.push("age > 65 with fever/cough");

  if (s.has("injury") || s.has("vomit") && s.has("breath")) {
    return { level: "urgent", advice: "Seek emergency care immediately.", redFlags };
  }
  if (s.has("chest") || s.has("breath")) {
    return { level: "doctor", advice: "Consult a doctor as soon as possible.", redFlags };
  }
  if (s.has("fever") && s.has("cough")) {
    return { level: "pharmacist", advice: "Consider OTC fever reducers and hydration. If symptoms persist >48h, see a doctor.", redFlags };
  }
  if (s.has("diarrhea") || s.has("rash")) {
    return { level: "pharmacist", advice: "Oral rehydration solution (ORS) and rest. Monitor for blood in stool or high fever.", redFlags };
  }
  return { level: "self_care", advice: "Rest, fluids, and monitor symptoms.", redFlags };
}

function OfflineRecords() {
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState<Array<{ id: string; name: string; age: number | ""; notes: string }>>(() => {
    try {
      return JSON.parse(localStorage.getItem("records") || "[]");
    } catch {
      return [];
    }
  });

  const online = typeof navigator !== "undefined" ? navigator.onLine : true;
  useEffect(() => {
    const on = () => window.dispatchEvent(new Event("records-online-change"));
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);

  function save() {
    const id = crypto.randomUUID();
    const next = [{ id, name, age: Number(age), notes }, ...records].slice(0, 50);
    setRecords(next);
    localStorage.setItem("records", JSON.stringify(next));
    setName("");
    setAge("");
    setNotes("");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sehatsetu-records.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  function importJson(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (Array.isArray(data)) {
          setRecords(data);
          localStorage.setItem("records", JSON.stringify(data));
        }
      } catch {}
    };
    reader.readAsText(file);
  }

  return (
    <Card id="records">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5 text-primary" /> {t("records_title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <span className={`h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-amber-500"}`} />
          <span className="text-muted-foreground">{online ? t("records_status_online") : t("records_status_offline")}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-muted-foreground">{t("records_name")}</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">{t("records_age")}</label>
            <Input type="number" value={age} onChange={(e) => setAge(e.target.value === "" ? "" : Number(e.target.value))} />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-muted-foreground">{t("records_notes")}</label>
            <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={save}>{t("records_save")}</Button>
          <Button variant="outline" onClick={exportJson}>{t("records_export")}</Button>
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input type="file" accept="application/json" className="hidden" onChange={importJson} />
            <span className="px-3 py-2 border rounded-md">{t("records_import")}</span>
          </label>
        </div>
        <Separator />
        <div className="space-y-2 max-h-64 overflow-auto pr-1">
          {records.length === 0 ? (
            <div className="text-sm text-muted-foreground">{t("records_empty")}</div>
          ) : (
            records.map((r) => (
              <div key={r.id} className="rounded-md border p-2">
                <div className="font-medium">{r.name || "Unnamed"} <span className="text-xs text-muted-foreground">{r.age || ""}</span></div>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">{r.notes}</div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function MedicineAvailability() {
  const { t } = useI18n();
  const [pincode, setPincode] = useState("");
  const [data, setData] = useState<MedicinesResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/medicines?pincode=${encodeURIComponent(pincode)}`);
      const json = (await res.json()) as MedicinesResponse;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (pincode) load();
    }, 10000);
    return () => clearInterval(id);
  }, [pincode]);

  return (
    <section className="container py-10">
      <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2"><MapPin className="h-6 w-6 text-primary" /> {t("pharmacy_title")}</h2>
      <div className="mt-4 flex gap-2">
        <Input placeholder={t("pharmacy_pincode")} value={pincode} onChange={(e) => setPincode(e.target.value)} maxLength={6} />
        <Button onClick={load} disabled={loading}>{t("pharmacy_check")}</Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {data?.items.map((m, i) => (
          <Card key={m.name + i} className="">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{m.name}</span>
                <Badge variant={m.stock > 0 ? "default" : "secondary"}>{m.stock > 0 ? `${m.stock} in stock` : "Out of stock"}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground flex items-center justify-between">
              <span>{m.pharmacy}</span>
              <span className="text-xs">{m.pincode}</span>
            </CardContent>
          </Card>
        ))}
      </div>
      {data && (
        <div className="mt-2 text-xs text-muted-foreground">{t("pharmacy_updated")}: {new Date(data.updatedAt).toLocaleTimeString()}</div>
      )}
    </section>
  );
}

function Architecture() {
  const { t } = useI18n();
  return (
    <section id="architecture" className="container py-12">
      <h2 className="text-2xl md:text-3xl font-bold">{t("architecture_title")}</h2>
      <p className="mt-2 text-muted-foreground max-w-3xl">
        Web PWA (React + Vite + Tailwind) with offline caching and background sync; Express API for lightweight endpoints; optional SMS/IVR for no‑internet access; pharmacy stock via polling/SSE; data stored in secure cloud DB with region replication.
      </p>
      <div className="mt-6 overflow-x-auto">
        <svg width="1024" height="260" viewBox="0 0 1024 260" className="min-w-[720px]">
          <defs>
            <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          <rect x="20" y="20" width="280" height="80" rx="12" fill="url(#grad)" opacity="0.15" stroke="hsl(var(--primary))" />
          <text x="40" y="55" fontSize="14" fill="currentColor">PWA Client (React)</text>
          <text x="40" y="78" fontSize="12" fill="currentColor">Service Worker • Offline cache • i18n</text>

          <rect x="340" y="20" width="280" height="80" rx="12" fill="url(#grad)" opacity="0.15" stroke="hsl(var(--primary))" />
          <text x="360" y="55" fontSize="14" fill="currentColor">Express API</text>
          <text x="360" y="78" fontSize="12" fill="currentColor">/api/medicines • symptom triage</text>

          <rect x="660" y="20" width="320" height="80" rx="12" fill="url(#grad)" opacity="0.15" stroke="hsl(var(--primary))" />
          <text x="680" y="55" fontSize="14" fill="currentColor">Data layer</text>
          <text x="680" y="78" fontSize="12" fill="currentColor">Cloud DB (region‑replicated) • Caching</text>

          <rect x="20" y="140" width="280" height="80" rx="12" fill="url(#grad)" opacity="0.15" stroke="hsl(var(--primary))" />
          <text x="40" y="175" fontSize="14" fill="currentColor">Pharmacies</text>
          <text x="40" y="198" fontSize="12" fill="currentColor">Stock endpoints</text>

          <rect x="340" y="140" width="280" height="80" rx="12" fill="url(#grad)" opacity="0.15" stroke="hsl(var(--primary))" />
          <text x="360" y="175" fontSize="14" fill="currentColor">Hospitals</text>
          <text x="360" y="198" fontSize="12" fill="currentColor">EHR integration</text>

          <rect x="660" y="140" width="320" height="80" rx="12" fill="url(#grad)" opacity="0.15" stroke="hsl(var(--primary))" />
          <text x="680" y="175" fontSize="14" fill="currentColor">SMS/IVR gateway</text>
          <text x="680" y="198" fontSize="12" fill="currentColor">No‑internet fallback</text>

          <path d="M160 100 L160 140" stroke="hsl(var(--primary))" strokeWidth="2" />
          <path d="M480 100 L480 140" stroke="hsl(var(--primary))" strokeWidth="2" />
          <path d="M820 100 L820 140" stroke="hsl(var(--primary))" strokeWidth="2" />
        </svg>
      </div>
    </section>
  );
}

function Stakeholders() {
  const { t } = useI18n();
  return (
    <section id="stakeholders" className="container py-10">
      <h2 className="text-2xl md:text-3xl font-bold">{t("stakeholders_title")}</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-5">
        <StakeholderCard label={t("stakeholders_list_patients")} />
        <StakeholderCard label={t("stakeholders_list_staff")} />
        <StakeholderCard label={t("stakeholders_list_dept")} />
        <StakeholderCard label={t("stakeholders_list_pharmacies")} />
        <StakeholderCard label={t("stakeholders_list_farmers")} />
      </div>
    </section>
  );
}

function StakeholderCard({ label }: { label: string }) {
  return (
    <Card>
      <CardContent className="pt-6 text-center font-medium">{label}</CardContent>
    </Card>
  );
}

function Outcomes() {
  const { t } = useI18n();
  return (
    <section id="outcomes" className="container py-12">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h3 className="text-xl font-bold">{t("problem_title")}</h3>
          <p className="mt-2 text-muted-foreground">{t("problem_copy")}</p>
          <h3 className="mt-6 text-xl font-bold">{t("impact_title")}</h3>
          <p className="mt-2 text-muted-foreground">{t("impact_copy")}</p>
        </div>
        <div>
          <h3 className="text-xl font-bold">{t("outcomes_title")}</h3>
          <ul className="mt-2 text-muted-foreground list-disc pl-5 space-y-1">
            <li>Faster tele‑consult triage with AI assist</li>
            <li>Lower travel and medicine search time</li>
            <li>Continuity of care via offline records</li>
            <li>Better stock visibility across pharmacies</li>
          </ul>
          <h3 className="mt-6 text-xl font-bold">{t("scalability_title")}</h3>
          <ul className="mt-2 text-muted-foreground list-disc pl-5 space-y-1">
            <li>Modular micro‑frontends per district</li>
            <li>Configurable locales: Punjabi, Hindi, English</li>
            <li>Low‑bandwidth patterns: image‑lite UI, code‑split</li>
            <li>Open APIs for Health Dept & partners</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function FooterDiagram() {
  return (
    <section className="bg-secondary/60 py-12">
      <div className="container text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm shadow-sm">
          <Server className="h-4 w-4 text-primary" />
          <span>Optimized for low bandwidth • Offline first • Scalable for rural Punjab</span>
        </div>
      </div>
    </section>
  );
}
