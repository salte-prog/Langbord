"use client";

import { useState, useEffect, useCallback } from "react";
import type { Member, NextMeeting, PastMeeting } from "@/lib/types";

type Tab = "meeting" | "members" | "archive";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [tab, setTab] = useState<Tab>("meeting");
  const [members, setMembers] = useState<Member[]>([]);
  const [nextMeeting, setNextMeeting] = useState<NextMeeting | null>(null);
  const [pastMeetings, setPastMeetings] = useState<PastMeeting[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const fetchData = useCallback(async () => {
    const res = await fetch("/api/data");
    if (res.ok) {
      const data = await res.json();
      setMembers(data.members);
      setNextMeeting(data.nextMeeting);
      setPastMeetings(data.pastMeetings);
      setAuthed(true);
    } else {
      setAuthed(false);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      setAuthed(true);
      fetchData();
    } else {
      const data = await res.json();
      setLoginError(data.error || "Innlogging feilet");
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setAuthed(false);
  }

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  // --- LOGIN SCREEN ---
  if (loading) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center">
        <div className="text-earth">Laster...</div>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-sand flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl font-bold text-navy text-center mb-8">
            Langbord Admin
          </h1>
          <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-md p-8 border border-blue-grey">
            <div className="mb-4">
              <label className="block text-sm font-medium text-charcoal mb-1">
                Brukernavn
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full border border-blue-grey rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                autoComplete="username"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-charcoal mb-1">
                Passord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-blue-grey rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
                autoComplete="current-password"
              />
            </div>
            {loginError && (
              <p className="text-red-600 text-sm mb-4">{loginError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-navy text-white py-2.5 rounded-lg font-medium hover:bg-navy-light transition-colors cursor-pointer"
            >
              Logg inn
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- ADMIN PANEL ---
  return (
    <div className="min-h-screen bg-sand">
      {/* Header */}
      <header className="bg-navy text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="font-[family-name:var(--font-playfair)] text-xl font-bold">
            Langbord Admin
          </h1>
          <button
            onClick={handleLogout}
            className="text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            Logg ut
          </button>
        </div>
      </header>

      {/* Toast */}
      {message && (
        <div className="fixed top-4 right-4 bg-navy text-white px-4 py-2 rounded-lg shadow-lg text-sm z-50">
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-6 mt-6">
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-blue-grey">
          {([
            ["meeting", "Neste m\u00f8te"],
            ["members", "Medlemmer"],
            ["archive", "Arkiv"],
          ] as [Tab, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                tab === key
                  ? "bg-navy text-white"
                  : "text-charcoal hover:bg-blue-grey"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {tab === "meeting" && (
          <MeetingTab
            meeting={nextMeeting}
            setMeeting={setNextMeeting}
            saving={saving}
            setSaving={setSaving}
            showMessage={showMessage}
          />
        )}
        {tab === "members" && (
          <MembersTab
            members={members}
            setMembers={setMembers}
            saving={saving}
            setSaving={setSaving}
            showMessage={showMessage}
          />
        )}
        {tab === "archive" && (
          <ArchiveTab
            meetings={pastMeetings}
            setMeetings={setPastMeetings}
            saving={saving}
            setSaving={setSaving}
            showMessage={showMessage}
          />
        )}
      </div>
    </div>
  );
}

// ---------- MEETING TAB ----------

function MeetingTab({
  meeting,
  setMeeting,
  saving,
  setSaving,
  showMessage,
}: {
  meeting: NextMeeting | null;
  setMeeting: (m: NextMeeting) => void;
  saving: boolean;
  setSaving: (s: boolean) => void;
  showMessage: (msg: string) => void;
}) {
  const [form, setForm] = useState<NextMeeting>(
    meeting || {
      id: generateId(),
      date: "",
      time: "18:00",
      hostName: "",
      hostCompany: "",
      industry: "",
      riddle: "",
      address: "",
      locationDescription: "",
      riddleApproved: false,
    }
  );
  const [generatingRiddle, setGeneratingRiddle] = useState(false);
  const [hints, setHints] = useState("");

  function update(field: keyof NextMeeting, value: string | boolean) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function generateRiddle() {
    setGeneratingRiddle(true);
    try {
      const res = await fetch("/api/riddle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostName: form.hostName,
          hostCompany: form.hostCompany,
          industry: form.industry,
          locationDescription: form.locationDescription,
          hints,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        update("riddle", data.riddle);
        update("riddleApproved", false);
      } else {
        const data = await res.json();
        showMessage(data.error || "Kunne ikke generere g\u00e5te");
      }
    } catch {
      showMessage("Feil ved generering av g\u00e5te");
    }
    setGeneratingRiddle(false);
  }

  async function saveMeeting() {
    setSaving(true);
    const res = await fetch("/api/meetings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMeeting(form);
      showMessage("Neste m\u00f8te lagret!");
    } else {
      showMessage("Lagring feilet");
    }
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-blue-grey">
      <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-navy mb-6">
        Neste m\u00f8te
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <Field label="Dato" type="date" value={form.date} onChange={(v) => update("date", v)} />
        <Field label="Klokkeslett" type="time" value={form.time} onChange={(v) => update("time", v)} />
        <Field label="Vertsmedlem" value={form.hostName} onChange={(v) => update("hostName", v)} placeholder="Fullt navn" />
        <Field label="Firma" value={form.hostCompany} onChange={(v) => update("hostCompany", v)} placeholder="Firmanavn" />
        <Field label="Bransje" value={form.industry} onChange={(v) => update("industry", v)} placeholder="F.eks. Subsea-teknologi" />
        <Field label="Adresse" value={form.address} onChange={(v) => update("address", v)} placeholder="Full adresse" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-charcoal mb-1">
          Beskrivelse av lokalet
        </label>
        <textarea
          value={form.locationDescription}
          onChange={(e) => update("locationDescription", e.target.value)}
          rows={2}
          className="w-full border border-blue-grey rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
          placeholder="Kort beskrivelse av lokalet/bedriften"
        />
      </div>

      {/* AI Riddle Generator */}
      <div className="border-t border-blue-grey pt-6 mb-6">
        <h3 className="font-semibold text-navy mb-3">AI-g\u00e5tegenerator</h3>
        <div className="mb-3">
          <label className="block text-sm font-medium text-charcoal mb-1">
            Ekstra hint til AI (valgfritt)
          </label>
          <input
            type="text"
            value={hints}
            onChange={(e) => setHints(e.target.value)}
            className="w-full border border-blue-grey rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
            placeholder="F.eks. avansert verkstedshall med teknisk utstyr"
          />
        </div>
        <button
          onClick={generateRiddle}
          disabled={generatingRiddle}
          className="bg-earth text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-earth-light transition-colors disabled:opacity-50 cursor-pointer"
        >
          {generatingRiddle ? "Genererer..." : "Generer g\u00e5te"}
        </button>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-charcoal mb-1">
          G\u00e5te
        </label>
        <textarea
          value={form.riddle}
          onChange={(e) => update("riddle", e.target.value)}
          rows={4}
          className="w-full border border-blue-grey rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
          placeholder="AI-generert eller manuelt skrevet g\u00e5te"
        />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <input
          type="checkbox"
          id="approved"
          checked={form.riddleApproved}
          onChange={(e) => update("riddleApproved", e.target.checked)}
          className="w-4 h-4 accent-navy"
        />
        <label htmlFor="approved" className="text-sm text-charcoal">
          G\u00e5te godkjent \u2014 vis p\u00e5 forsiden
        </label>
      </div>

      <button
        onClick={saveMeeting}
        disabled={saving}
        className="bg-navy text-white px-6 py-2.5 rounded-lg font-medium hover:bg-navy-light transition-colors disabled:opacity-50 cursor-pointer"
      >
        {saving ? "Lagrer..." : "Lagre neste m\u00f8te"}
      </button>
    </div>
  );
}

// ---------- MEMBERS TAB ----------

function MembersTab({
  members,
  setMembers,
  saving,
  setSaving,
  showMessage,
}: {
  members: Member[];
  setMembers: (m: Member[]) => void;
  saving: boolean;
  setSaving: (s: boolean) => void;
  showMessage: (msg: string) => void;
}) {
  const [editing, setEditing] = useState<Member | null>(null);
  const [bioLoading, setBioLoading] = useState(false);
  const [linkedinText, setLinkedinText] = useState("");

  const emptyMember: Member = {
    id: "",
    name: "",
    title: "",
    company: "",
    industry: "",
    bio: "",
    imageUrl: "",
    linkedinUrl: "",
  };

  function startEdit(member?: Member) {
    setEditing(member || { ...emptyMember, id: generateId() });
    setLinkedinText("");
  }

  async function saveMember() {
    if (!editing) return;
    setSaving(true);

    const isNew = !members.find((m) => m.id === editing.id);
    let updated: Member[];
    if (isNew) {
      updated = [...members, editing];
    } else {
      updated = members.map((m) => (m.id === editing.id ? editing : m));
    }

    const res = await fetch("/api/members", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });

    if (res.ok) {
      setMembers(updated);
      setEditing(null);
      showMessage("Medlem lagret!");
    } else {
      showMessage("Lagring feilet");
    }
    setSaving(false);
  }

  async function deleteMember(id: string) {
    setSaving(true);
    const res = await fetch("/api/members", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = await res.json();
      setMembers(data.members);
      showMessage("Medlem fjernet");
    }
    setSaving(false);
  }

  async function generateBio() {
    if (!editing || !linkedinText.trim()) return;
    setBioLoading(true);
    try {
      const res = await fetch("/api/bio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editing.name, rawText: linkedinText }),
      });
      if (res.ok) {
        const data = await res.json();
        setEditing({ ...editing, bio: data.bio });
      } else {
        const data = await res.json();
        showMessage(data.error || "Kunne ikke generere bio");
      }
    } catch {
      showMessage("Feil ved generering av bio");
    }
    setBioLoading(false);
  }

  if (editing) {
    return (
      <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-blue-grey">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-navy mb-6">
          {members.find((m) => m.id === editing.id) ? "Rediger" : "Nytt"} medlem
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Field label="Navn" value={editing.name} onChange={(v) => setEditing({ ...editing, name: v })} />
          <Field label="Tittel" value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
          <Field label="Firma" value={editing.company} onChange={(v) => setEditing({ ...editing, company: v })} />
          <Field label="Bransje" value={editing.industry} onChange={(v) => setEditing({ ...editing, industry: v })} />
          <Field label="LinkedIn URL" value={editing.linkedinUrl || ""} onChange={(v) => setEditing({ ...editing, linkedinUrl: v })} />
          <Field label="Bilde-URL" value={editing.imageUrl || ""} onChange={(v) => setEditing({ ...editing, imageUrl: v })} />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-1">Bio</label>
          <textarea
            value={editing.bio}
            onChange={(e) => setEditing({ ...editing, bio: e.target.value })}
            rows={3}
            className="w-full border border-blue-grey rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
          />
        </div>

        {/* AI Bio Generator */}
        <div className="border-t border-blue-grey pt-4 mb-6">
          <h3 className="font-semibold text-navy mb-3 text-sm">AI-bio fra LinkedIn</h3>
          <textarea
            value={linkedinText}
            onChange={(e) => setLinkedinText(e.target.value)}
            rows={3}
            placeholder="Lim inn LinkedIn-tekst her..."
            className="w-full border border-blue-grey rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30 mb-2"
          />
          <button
            onClick={generateBio}
            disabled={bioLoading || !linkedinText.trim()}
            className="bg-earth text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-earth-light transition-colors disabled:opacity-50 cursor-pointer"
          >
            {bioLoading ? "Genererer..." : "Hent og forenkle LinkedIn-beskrivelse"}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            onClick={saveMember}
            disabled={saving}
            className="bg-navy text-white px-6 py-2.5 rounded-lg font-medium hover:bg-navy-light transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Lagrer..." : "Lagre"}
          </button>
          <button
            onClick={() => setEditing(null)}
            className="text-earth hover:text-navy transition-colors cursor-pointer"
          >
            Avbryt
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-blue-grey">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-navy">
          Medlemmer
        </h2>
        <button
          onClick={() => startEdit()}
          className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors cursor-pointer"
        >
          + Legg til
        </button>
      </div>

      {members.length === 0 ? (
        <p className="text-earth text-sm">Ingen medlemmer enn\u00e5.</p>
      ) : (
        <div className="space-y-3">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center justify-between p-4 bg-sand rounded-xl border border-blue-grey"
            >
              <div>
                <p className="font-semibold text-navy text-sm">{member.name}</p>
                <p className="text-earth text-xs">
                  {member.title}, {member.company}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(member)}
                  className="text-xs text-navy hover:underline cursor-pointer"
                >
                  Rediger
                </button>
                <button
                  onClick={() => deleteMember(member.id)}
                  className="text-xs text-red-600 hover:underline cursor-pointer"
                >
                  Slett
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- ARCHIVE TAB ----------

function ArchiveTab({
  meetings,
  setMeetings,
  saving,
  setSaving,
  showMessage,
}: {
  meetings: PastMeeting[];
  setMeetings: (m: PastMeeting[]) => void;
  saving: boolean;
  setSaving: (s: boolean) => void;
  showMessage: (msg: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<PastMeeting>({
    id: "",
    date: "",
    hostName: "",
    hostCompany: "",
    industry: "",
    location: "",
    summary: "",
  });

  function resetForm() {
    setForm({
      id: generateId(),
      date: "",
      hostName: "",
      hostCompany: "",
      industry: "",
      location: "",
      summary: "",
    });
  }

  async function addMeeting() {
    setSaving(true);
    const newMeeting = { ...form, id: form.id || generateId() };
    const res = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMeeting),
    });
    if (res.ok) {
      const data = await res.json();
      setMeetings(data.meetings);
      setAdding(false);
      resetForm();
      showMessage("M\u00f8te lagt til i arkivet!");
    } else {
      showMessage("Lagring feilet");
    }
    setSaving(false);
  }

  async function deleteMeeting(id: string) {
    setSaving(true);
    const res = await fetch("/api/meetings", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = await res.json();
      setMeetings(data.meetings);
      showMessage("M\u00f8te fjernet fra arkivet");
    }
    setSaving(false);
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 border border-blue-grey">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-navy">
          Tidligere m\u00f8ter
        </h2>
        <button
          onClick={() => {
            resetForm();
            setAdding(!adding);
          }}
          className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors cursor-pointer"
        >
          {adding ? "Avbryt" : "+ Legg til"}
        </button>
      </div>

      {adding && (
        <div className="bg-sand rounded-xl p-5 border border-blue-grey mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Field label="Dato" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            <Field label="Vert" value={form.hostName} onChange={(v) => setForm({ ...form, hostName: v })} />
            <Field label="Firma" value={form.hostCompany} onChange={(v) => setForm({ ...form, hostCompany: v })} />
            <Field label="Bransje" value={form.industry} onChange={(v) => setForm({ ...form, industry: v })} />
            <Field label="Sted" value={form.location} onChange={(v) => setForm({ ...form, location: v })} />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal mb-1">
              Tema / sammendrag
            </label>
            <textarea
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              rows={2}
              className="w-full border border-blue-grey rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
            />
          </div>
          <button
            onClick={addMeeting}
            disabled={saving}
            className="bg-navy text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-navy-light transition-colors disabled:opacity-50 cursor-pointer"
          >
            {saving ? "Lagrer..." : "Legg til i arkivet"}
          </button>
        </div>
      )}

      {meetings.length === 0 ? (
        <p className="text-earth text-sm">Ingen tidligere m\u00f8ter registrert.</p>
      ) : (
        <div className="space-y-3">
          {meetings.map((m) => (
            <div
              key={m.id}
              className="flex items-start justify-between p-4 bg-sand rounded-xl border border-blue-grey"
            >
              <div>
                <p className="font-semibold text-navy text-sm">
                  {m.hostName} \u2014 {m.hostCompany}
                </p>
                <p className="text-earth text-xs">{m.date} \u00b7 {m.industry}</p>
                <p className="text-charcoal text-xs mt-1">{m.summary}</p>
              </div>
              <button
                onClick={() => deleteMeeting(m.id)}
                className="text-xs text-red-600 hover:underline shrink-0 ml-4 cursor-pointer"
              >
                Slett
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- FIELD HELPER ----------

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-charcoal mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-blue-grey rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-navy/30"
      />
    </div>
  );
}
