import { useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  DemoResponse,
  MedicinesResponse,
  SymptomCheckResult,
  SymptomCheckInput,
} from "@shared/api";
import {
  Activity,
  Brain,
  Database,
  Languages,
  MapPin,
  Mic,
  ScreenShare,
  Server,
  Stethoscope,
  Video,
  VideoOff,
} from "lucide-react";

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
      <Consultation />
      <Stats />
      <Features />
      <div className="container grid gap-6 py-10 md:grid-cols-2">
        <SymptomChecker />
        <OfflineRecords />
      </div>
      <MedicineAvailability />
      <Architecture />
      <AboutUs />
      <FooterRibbon />
      <p className="sr-only">{exampleFromServer}</p>
    </div>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <svg
          className="absolute -top-24 -right-24 opacity-20"
          width="400"
          height="400"
          viewBox="0 0 200 200"
        >
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
          <Badge className="mb-4" variant="secondary">
            {t("tagline")}
          </Badge>
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
              <CardTitle className="text-base flex items-center gap-2">
                <Languages className="h-4 w-4 text-primary" /> {t("f1_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("f1_desc")}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Database className="h-4 w-4 text-primary" /> {t("f2_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("f2_desc")}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> {t("f3_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("f3_desc")}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-4 w-4 text-primary" /> {t("f4_title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t("f4_desc")}
            </CardContent>
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
            <div className="text-muted-foreground">
              {t("stats_connectivity")}
            </div>
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
        <FeatureCard
          icon={<Languages className="h-5 w-5" />}
          title={t("f1_title")}
          desc={t("f1_desc")}
        />
        <FeatureCard
          icon={<Database className="h-5 w-5" />}
          title={t("f2_title")}
          desc={t("f2_desc")}
        />
        <FeatureCard
          icon={<MapPin className="h-5 w-5" />}
          title={t("f3_title")}
          desc={t("f3_desc")}
        />
        <FeatureCard
          icon={<Brain className="h-5 w-5" />}
          title={t("f4_title")}
          desc={t("f4_desc")}
        />
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 flex flex-row items-center gap-2">
        <div className="p-2 rounded-md bg-secondary text-primary">{icon}</div>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {desc}
      </CardContent>
    </Card>
  );
}

function Consultation() {
  const localRef = useRef<HTMLVideoElement | null>(null);
  const remoteRef = useRef<HTMLVideoElement | null>(null);
  const pc1 = useRef<RTCPeerConnection | null>(null);
  const pc2 = useRef<RTCPeerConnection | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [running, setRunning] = useState(false);
  const [lowData, setLowData] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  async function start() {
    const constraints: MediaStreamConstraints = {
      audio: { noiseSuppression: true, echoCancellation: true },
      video: videoEnabled
        ? lowData
          ? {
              width: { ideal: 320 },
              height: { ideal: 240 },
              frameRate: { ideal: 15, max: 15 },
            }
          : {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              frameRate: { ideal: 30, max: 30 },
            }
        : false,
    } as any;

    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    setLocalStream(stream);
    if (localRef.current) localRef.current.srcObject = stream;

    pc1.current = new RTCPeerConnection();
    pc2.current = new RTCPeerConnection();

    const rs = new MediaStream();
    setRemoteStream(rs);
    if (remoteRef.current) remoteRef.current.srcObject = rs;

    pc2.current.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => rs.addTrack(t));
    };

    stream.getTracks().forEach((t) => pc1.current!.addTrack(t, stream));

    const offer = await pc1.current.createOffer();
    await pc1.current.setLocalDescription(offer);
    await pc2.current.setRemoteDescription(offer);

    const answer = await pc2.current.createAnswer();
    await pc2.current.setLocalDescription(answer);
    await pc1.current.setRemoteDescription(answer);

    setRunning(true);
  }

  function toggleAudio() {
    const enabled = !audioEnabled;
    setAudioEnabled(enabled);
    localStream?.getAudioTracks().forEach((t) => (t.enabled = enabled));
  }

  function toggleVideo() {
    const enabled = !videoEnabled;
    setVideoEnabled(enabled);
    localStream?.getVideoTracks().forEach((t) => (t.enabled = enabled));
  }

  async function shareScreen() {
    try {
      const display = await (navigator.mediaDevices as any).getDisplayMedia({
        video: true,
        audio: true,
      });
      const sender = pc1.current
        ?.getSenders()
        .find((s) => s.track?.kind === "video");
      if (sender) await sender.replaceTrack(display.getVideoTracks()[0]);
      if (remoteRef.current) remoteRef.current.focus();
      display.getVideoTracks()[0].addEventListener("ended", async () => {
        if (localStream?.getVideoTracks()[0] && sender)
          await sender.replaceTrack(localStream.getVideoTracks()[0]);
      });
    } catch {}
  }

  function startRecording() {
    const mix = new MediaStream([
      ...(remoteStream ? remoteStream.getTracks() : []),
      ...(localStream ? localStream.getAudioTracks() : []),
    ]);
    const rec = new MediaRecorder(mix, {
      mimeType: "video/webm;codecs=vp8,opus",
    });
    setRecorder(rec);
    chunks.current = [];
    rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
    rec.onstop = () => {
      const blob = new Blob(chunks.current, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `consultation-${Date.now()}.webm`;
      a.click();
      URL.revokeObjectURL(url);
    };
    rec.start();
  }

  function stopRecording() {
    recorder?.stop();
    setRecorder(null);
  }

  function end() {
    pc1.current?.close();
    pc2.current?.close();
    pc1.current = null;
    pc2.current = null;
    localStream?.getTracks().forEach((t) => t.stop());
    remoteStream?.getTracks().forEach((t) => t.stop());
    setLocalStream(null);
    setRemoteStream(null);
    setRunning(false);
  }

  return (
    <section id="consult" className="container py-10">
      <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
        <Video className="h-6 w-6 text-primary" /> Online consultation (video +
        audio)
      </h2>
      <Card className="mt-4">
        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
          <div className="space-y-3">
            <div className="aspect-video rounded-md overflow-hidden border bg-black/80 relative">
              <video
                ref={remoteRef}
                autoPlay
                playsInline
                className="h-full w-full object-cover absolute inset-0"
                style={{
                  display:
                    remoteRef.current && (remoteRef.current as any).srcObject
                      ? "block"
                      : "none",
                }}
              />
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                src="https://media.w3.org/2010/05/sintel/trailer.mp4"
              />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <input
                  id="low"
                  type="checkbox"
                  checked={lowData}
                  onChange={(e) => setLowData(e.target.checked)}
                />
                <label htmlFor="low">Low data (240p/15fps)</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="vid"
                  type="checkbox"
                  checked={videoEnabled}
                  onChange={toggleVideo}
                />
                <label htmlFor="vid">Video</label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="aud"
                  type="checkbox"
                  checked={audioEnabled}
                  onChange={toggleAudio}
                />
                <label htmlFor="aud">Audio</label>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {!running ? (
                <Button onClick={start}>
                  <Video className="h-4 w-4" /> Start consultation
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={toggleAudio}>
                    <Mic className="h-4 w-4" />{" "}
                    {audioEnabled ? "Mute" : "Unmute"}
                  </Button>
                  <Button variant="outline" onClick={toggleVideo}>
                    <VideoOff className="h-4 w-4" />{" "}
                    {videoEnabled ? "Stop video" : "Start video"}
                  </Button>
                  <Button variant="outline" onClick={shareScreen}>
                    <ScreenShare className="h-4 w-4" /> Share screen
                  </Button>
                  {!recorder ? (
                    <Button variant="default" onClick={startRecording}>
                      Record
                    </Button>
                  ) : (
                    <Button variant="destructive" onClick={stopRecording}>
                      Stop recording
                    </Button>
                  )}
                  <Button variant="ghost" onClick={end}>
                    End
                  </Button>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="aspect-video rounded-md overflow-hidden border bg-black/40">
              <video
                ref={localRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Local preview (muted)
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

function SymptomChecker() {
  const { t } = useI18n();
  const [input, setInput] = useState<SymptomCheckInput>({
    age: 30,
    symptoms: [],
    notes: "",
  });
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
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" /> {t("symptom_title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Age</label>
            <Input
              type="number"
              value={input.age}
              min={0}
              max={120}
              onChange={(e) =>
                setInput((s) => ({ ...s, age: Number(e.target.value) }))
              }
            />
          </div>
        </div>
        <div>
          <div className="text-sm font-medium mb-2">
            {t("symptom_symptoms")}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {options.map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-2 rounded-md border p-2"
              >
                <Checkbox
                  checked={input.symptoms.includes(opt.key)}
                  onCheckedChange={(v) =>
                    setInput((s) => ({
                      ...s,
                      symptoms: v
                        ? [...s.symptoms, opt.key]
                        : s.symptoms.filter((k) => k !== opt.key),
                    }))
                  }
                />
                <span className="text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="text-sm text-muted-foreground">
            {t("symptom_other")}
          </label>
          <Textarea
            rows={3}
            value={input.notes}
            onChange={(e) => setInput((s) => ({ ...s, notes: e.target.value }))}
          />
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
                <span className="font-medium">Red flags:</span>{" "}
                {result.redFlags.join(", ")}
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
  if (input.age > 65 && (s.has("fever") || s.has("cough")))
    redFlags.push("age > 65 with fever/cough");

  if (s.has("injury") || (s.has("vomit") && s.has("breath"))) {
    return {
      level: "urgent",
      advice: "Seek emergency care immediately.",
      redFlags,
    };
  }
  if (s.has("chest") || s.has("breath")) {
    return {
      level: "doctor",
      advice: "Consult a doctor as soon as possible.",
      redFlags,
    };
  }
  if (s.has("fever") && s.has("cough")) {
    return {
      level: "pharmacist",
      advice:
        "Consider OTC fever reducers and hydration. If symptoms persist >48h, see a doctor.",
      redFlags,
    };
  }
  if (s.has("diarrhea") || s.has("rash")) {
    return {
      level: "pharmacist",
      advice:
        "Oral rehydration solution (ORS) and rest. Monitor for blood in stool or high fever.",
      redFlags,
    };
  }
  return {
    level: "self_care",
    advice: "Rest, fluids, and monitor symptoms.",
    redFlags,
  };
}

import { useAuth } from "@/lib/auth";

function OfflineRecords() {
  const { t } = useI18n();
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [notes, setNotes] = useState("");
  const [records, setRecords] = useState<
    Array<{ id: string; name: string; age: number | ""; notes: string }>
  >(() => {
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
    const next = [{ id, name, age: Number(age), notes }, ...records].slice(
      0,
      50,
    );
    setRecords(next);
    localStorage.setItem("records", JSON.stringify(next));
    setName("");
    setAge("");
    setNotes("");
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(records, null, 2)], {
      type: "application/json",
    });
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
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" /> {t("records_title")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${online ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          <span className="text-muted-foreground">
            {online ? t("records_status_online") : t("records_status_offline")}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm text-muted-foreground">
              {t("records_name")}
            </label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="text-sm text-muted-foreground">
              {t("records_age")}
            </label>
            <Input
              type="number"
              value={age}
              onChange={(e) =>
                setAge(e.target.value === "" ? "" : Number(e.target.value))
              }
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-muted-foreground">
              {t("records_notes")}
            </label>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {user ? (
            <Button onClick={save}>{t("records_save")}</Button>
          ) : (
            <Button asChild>
              <a href="/auth">Login to save</a>
            </Button>
          )}
          <Button variant="outline" onClick={exportJson}>
            {t("records_export")}
          </Button>
          <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={importJson}
            />
            <span className="px-3 py-2 border rounded-md">
              {t("records_import")}
            </span>
          </label>
        </div>
        <Separator />
        <div className="space-y-2 max-h-64 overflow-auto pr-1">
          {records.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              {t("records_empty")}
            </div>
          ) : (
            records.map((r) => (
              <div key={r.id} className="rounded-md border p-2">
                <div className="font-medium">
                  {r.name || "Unnamed"}{" "}
                  <span className="text-xs text-muted-foreground">
                    {r.age || ""}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {r.notes}
                </div>
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
  const [query, setQuery] = useState("");
  const [onlyStock, setOnlyStock] = useState(false);
  const [sort, setSort] = useState<"stock" | "name">("stock");
  const [watch, setWatch] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("watchlist") || "[]");
    } catch {
      return [];
    }
  });
  const [data, setData] = useState<MedicinesResponse | null>(null);
  const [loading, setLoading] = useState(false);

  function cacheSet(pin: string, payload: MedicinesResponse) {
    const key = `med_cache_${pin}`;
    localStorage.setItem(key, JSON.stringify(payload));
  }
  function cacheGet(pin: string): MedicinesResponse | null {
    try {
      return JSON.parse(localStorage.getItem(`med_cache_${pin}`) || "null");
    } catch {
      return null;
    }
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/medicines?pincode=${encodeURIComponent(pincode)}`,
      );
      const json = (await res.json()) as MedicinesResponse;
      setData(json);
      cacheSet(pincode, json);
    } catch {
      const cached = cacheGet(pincode);
      if (cached) setData(cached);
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
      <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
        <MapPin className="h-6 w-6 text-primary" /> {t("pharmacy_title")}
      </h2>
      <div className="mt-4 flex flex-wrap gap-2">
        <Input
          placeholder={t("pharmacy_pincode")}
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          maxLength={6}
          className="w-32"
        />
        <Input
          placeholder="Search medicine name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[200px]"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={onlyStock}
            onChange={(e) => setOnlyStock(e.target.checked)}
          />{" "}
          Only in stock
        </label>
        <label className="flex items-center gap-2 text-sm">
          Sort by
          <select
            className="border rounded-md h-10 px-2"
            value={sort}
            onChange={(e) => setSort(e.target.value as any)}
          >
            <option value="stock">Highest stock</option>
            <option value="name">Name</option>
          </select>
        </label>
        <Button onClick={load} disabled={loading}>
          {t("pharmacy_check")}
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {data &&
          [...data.items]
            .filter((m) =>
              query ? m.name.toLowerCase().includes(query.toLowerCase()) : true,
            )
            .filter((m) => (onlyStock ? m.stock > 0 : true))
            .sort((a, b) =>
              sort === "stock"
                ? b.stock - a.stock
                : a.name.localeCompare(b.name),
            )
            .map((m, i) => (
              <Card key={m.name + i} className="">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>{m.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant={m.stock > 0 ? "default" : "secondary"}>
                        {m.stock > 0 ? `${m.stock} in stock` : "Out of stock"}
                      </Badge>
                      <button
                        className={`text-xs underline ${watch.includes(m.name) ? "text-accent" : ""}`}
                        onClick={() => {
                          const next = watch.includes(m.name)
                            ? watch.filter((x) => x !== m.name)
                            : [...watch, m.name];
                          setWatch(next);
                          localStorage.setItem(
                            "watchlist",
                            JSON.stringify(next),
                          );
                        }}
                      >
                        {watch.includes(m.name) ? "Watching" : "Watch"}
                      </button>
                    </div>
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
        <div className="mt-2 text-xs text-muted-foreground">
          {t("pharmacy_updated")}:{" "}
          {new Date(data.updatedAt).toLocaleTimeString()}
        </div>
      )}
    </section>
  );
}

function Architecture() {
  const { t } = useI18n();
  return (
    <section id="architecture" className="container py-12">
      <h2 className="text-2xl md:text-3xl font-bold">
        {t("architecture_title")}
      </h2>
      <p className="mt-2 text-muted-foreground max-w-3xl">
        Web PWA (React + Vite + Tailwind) with offline caching and background
        sync; Express API for lightweight endpoints; optional SMS/IVR for
        no‑internet access; pharmacy stock via polling/SSE; data stored in
        secure cloud DB with region replication.
      </p>
      <div className="mt-6 overflow-x-auto">
        <svg
          width="1024"
          height="260"
          viewBox="0 0 1024 260"
          className="min-w-[720px]"
        >
          <defs>
            <linearGradient id="grad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          <rect
            x="20"
            y="20"
            width="280"
            height="80"
            rx="12"
            fill="url(#grad)"
            opacity="0.15"
            stroke="hsl(var(--primary))"
          />
          <text x="40" y="55" fontSize="14" fill="currentColor">
            PWA Client (React)
          </text>
          <text x="40" y="78" fontSize="12" fill="currentColor">
            Service Worker • Offline cache • i18n
          </text>

          <rect
            x="340"
            y="20"
            width="280"
            height="80"
            rx="12"
            fill="url(#grad)"
            opacity="0.15"
            stroke="hsl(var(--primary))"
          />
          <text x="360" y="55" fontSize="14" fill="currentColor">
            Express API
          </text>
          <text x="360" y="78" fontSize="12" fill="currentColor">
            /api/medicines • symptom triage
          </text>

          <rect
            x="660"
            y="20"
            width="320"
            height="80"
            rx="12"
            fill="url(#grad)"
            opacity="0.15"
            stroke="hsl(var(--primary))"
          />
          <text x="680" y="55" fontSize="14" fill="currentColor">
            Data layer
          </text>
          <text x="680" y="78" fontSize="12" fill="currentColor">
            Cloud DB (region‑replicated) • Caching
          </text>

          <rect
            x="20"
            y="140"
            width="280"
            height="80"
            rx="12"
            fill="url(#grad)"
            opacity="0.15"
            stroke="hsl(var(--primary))"
          />
          <text x="40" y="175" fontSize="14" fill="currentColor">
            Pharmacies
          </text>
          <text x="40" y="198" fontSize="12" fill="currentColor">
            Stock endpoints
          </text>

          <rect
            x="340"
            y="140"
            width="280"
            height="80"
            rx="12"
            fill="url(#grad)"
            opacity="0.15"
            stroke="hsl(var(--primary))"
          />
          <text x="360" y="175" fontSize="14" fill="currentColor">
            Hospitals
          </text>
          <text x="360" y="198" fontSize="12" fill="currentColor">
            EHR integration
          </text>

          <rect
            x="660"
            y="140"
            width="320"
            height="80"
            rx="12"
            fill="url(#grad)"
            opacity="0.15"
            stroke="hsl(var(--primary))"
          />
          <text x="680" y="175" fontSize="14" fill="currentColor">
            SMS/IVR gateway
          </text>
          <text x="680" y="198" fontSize="12" fill="currentColor">
            No‑internet fallback
          </text>

          <path
            d="M160 100 L160 140"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
          <path
            d="M480 100 L480 140"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
          <path
            d="M820 100 L820 140"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
          />
        </svg>
      </div>
    </section>
  );
}

function AboutUs() {
  return (
    <section id="about" className="container py-12">
      <h2 className="text-2xl md:text-3xl font-bold">About us</h2>
      <div className="mt-4 grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Mission</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Make quality care accessible in rural India through low‑bandwidth
            telemedicine, offline health records, and transparent medicine
            availability.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Team</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Public health experts, rural clinicians, and engineers with
            experience in PWA, WebRTC, and scalable cloud.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Partners</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Working with district hospitals, local pharmacies, and Punjab Health
            Department to pilot and scale.
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FooterRibbon() {
  return (
    <section className="bg-secondary/60 py-12">
      <div className="container text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm shadow-sm">
          <Server className="h-4 w-4 text-primary" />
          <span>
            Optimized for low bandwidth • Offline first • Scalable for rural
            Punjab
          </span>
        </div>
      </div>
    </section>
  );
}
