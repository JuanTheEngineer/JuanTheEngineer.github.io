#!/usr/bin/env python3
"""
Action App Data Editor — Tkinter GUI for reviewing/editing exercises and programs.
Lets you sift through each exercise, edit notes, review demos, fix typos, and
standardize program requirements — all in one place.

Usage: python3 scripts/data-editor.py
"""

import json
import tkinter as tk
from tkinter import ttk, messagebox, scrolledtext, simpledialog
from pathlib import Path
import webbrowser
import urllib.request
import os
import ssl

# Fix macOS Python SSL cert issue
ssl_ctx = ssl.create_default_context()
try:
    import certifi
    ssl_ctx.load_verify_locations(certifi.where())
except ImportError:
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE

ROOT = Path(__file__).parent.parent
EXERCISES_PATH = ROOT / "exercises.json"
WORKOUTS_PATH = ROOT / "workouts.json"

# --- Load Data ---
def load_data():
    with open(EXERCISES_PATH, "r") as f:
        exercises_data = json.load(f)
    with open(WORKOUTS_PATH, "r") as f:
        workouts_data = json.load(f)
    return exercises_data, workouts_data

def save_exercises(data):
    with open(EXERCISES_PATH, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

def save_workouts(data):
    with open(WORKOUTS_PATH, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

# --- Main App ---
class DataEditorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Action App — Data Editor")
        self.root.geometry("900x700")
        self.root.configure(bg="#0f172a")

        self.exercises_data, self.workouts_data = load_data()
        self.exercises = self.exercises_data["exercises"]
        self.programs = self.workouts_data["programs"]
        self.current_idx = 0
        self.unsaved_changes = False

        self.setup_ui()
        self.load_exercise(0)

    def setup_ui(self):
        style = ttk.Style()
        style.theme_use("clam")
        style.configure("TFrame", background="#0f172a")
        style.configure("TLabel", background="#0f172a", foreground="#e2e8f0", font=("Inter", 11))
        style.configure("Title.TLabel", font=("Inter", 14, "bold"), foreground="#60a5fa")
        style.configure("TButton", font=("Inter", 10))
        style.configure("TNotebook", background="#0f172a")
        style.configure("TNotebook.Tab", font=("Inter", 10, "bold"))

        # --- Top nav ---
        nav = ttk.Frame(self.root)
        nav.pack(fill="x", padx=10, pady=5)

        self.btn_prev = ttk.Button(nav, text="← Prev", command=self.prev_exercise)
        self.btn_prev.pack(side="left")

        self.lbl_counter = ttk.Label(nav, text="", style="Title.TLabel")
        self.lbl_counter.pack(side="left", padx=20)

        self.btn_next = ttk.Button(nav, text="Next →", command=self.next_exercise)
        self.btn_next.pack(side="left")

        ttk.Button(nav, text="Save All", command=self.save_all).pack(side="right")
        ttk.Button(nav, text="Skip to Issues", command=self.skip_to_issues).pack(side="right", padx=5)

        # --- Tabs ---
        self.notebook = ttk.Notebook(self.root)
        self.notebook.pack(fill="both", expand=True, padx=10, pady=5)

        # Tab 1: Exercise Editor
        self.tab_exercise = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_exercise, text="  Exercise  ")
        self.setup_exercise_tab()

        # Tab 2: Program Requirements
        self.tab_programs = ttk.Frame(self.notebook)
        self.notebook.add(self.tab_programs, text="  Programs  ")
        self.setup_programs_tab()

    def setup_exercise_tab(self):
        f = self.tab_exercise

        # ID + Name
        row1 = ttk.Frame(f)
        row1.pack(fill="x", padx=10, pady=(10, 5))
        ttk.Label(row1, text="ID:").pack(side="left")
        self.lbl_id = ttk.Label(row1, text="", foreground="#94a3b8", font=("Courier", 11))
        self.lbl_id.pack(side="left", padx=10)

        row2 = ttk.Frame(f)
        row2.pack(fill="x", padx=10, pady=2)
        ttk.Label(row2, text="Name:").pack(side="left")
        self.entry_name = tk.Entry(row2, font=("Inter", 12), bg="#1e293b", fg="#f1f5f9", insertbackground="#60a5fa", width=50)
        self.entry_name.pack(side="left", padx=10, fill="x", expand=True)

        # Reps / Sets / Units
        row3 = ttk.Frame(f)
        row3.pack(fill="x", padx=10, pady=5)
        ttk.Label(row3, text="Reps:").pack(side="left")
        self.entry_reps = tk.Entry(row3, font=("Inter", 11), bg="#1e293b", fg="#f1f5f9", insertbackground="#60a5fa", width=12)
        self.entry_reps.pack(side="left", padx=(5, 15))
        ttk.Label(row3, text="Sets:").pack(side="left")
        self.entry_sets = tk.Entry(row3, font=("Inter", 11), bg="#1e293b", fg="#f1f5f9", insertbackground="#60a5fa", width=12)
        self.entry_sets.pack(side="left", padx=(5, 15))
        ttk.Label(row3, text="Units:").pack(side="left")
        self.entry_units = tk.Entry(row3, font=("Inter", 11), bg="#1e293b", fg="#f1f5f9", insertbackground="#60a5fa", width=15)
        self.entry_units.pack(side="left", padx=5)

        # Note
        note_row = ttk.Frame(f)
        note_row.pack(fill="x", padx=10, pady=(10, 2))
        ttk.Label(note_row, text="Note:").pack(side="left")
        ttk.Button(note_row, text="🤖 AI Fill", command=self.ai_fill).pack(side="right")

        self.text_note = scrolledtext.ScrolledText(f, height=4, font=("Inter", 11), bg="#1e293b", fg="#f1f5f9", insertbackground="#60a5fa", wrap="word")
        self.text_note.pack(fill="x", padx=10)

        # AI prompt (optional context for AI fill)
        ai_row = ttk.Frame(f)
        ai_row.pack(fill="x", padx=10, pady=(2, 0))
        ttk.Label(ai_row, text="AI prompt (optional):").pack(side="left")
        self.entry_ai_prompt = tk.Entry(ai_row, font=("Inter", 10), bg="#1e293b", fg="#94a3b8", insertbackground="#60a5fa", width=40)
        self.entry_ai_prompt.insert(0, "")
        self.entry_ai_prompt.pack(side="left", padx=5, fill="x", expand=True)

        # Demos
        ttk.Label(f, text="Demos:", style="Title.TLabel").pack(anchor="w", padx=10, pady=(15, 2))
        self.demos_frame = ttk.Frame(f)
        self.demos_frame.pack(fill="both", expand=True, padx=10, pady=5)

        # Status bar
        self.lbl_status = ttk.Label(f, text="", foreground="#f59e0b")
        self.lbl_status.pack(anchor="w", padx=10, pady=5)

    def setup_programs_tab(self):
        f = self.tab_programs
        ttk.Label(f, text="Program Requirements (edit to standardize):", style="Title.TLabel").pack(anchor="w", padx=10, pady=10)

        # Scrollable list of programs
        canvas = tk.Canvas(f, bg="#0f172a", highlightthickness=0)
        scrollbar = ttk.Scrollbar(f, orient="vertical", command=canvas.yview)
        self.programs_inner = ttk.Frame(canvas)

        self.programs_inner.bind("<Configure>", lambda e: canvas.configure(scrollregion=canvas.bbox("all")))
        canvas.create_window((0, 0), window=self.programs_inner, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side="left", fill="both", expand=True, padx=10)
        scrollbar.pack(side="right", fill="y")

        self.program_entries = []
        for i, prog in enumerate(self.programs):
            row = ttk.Frame(self.programs_inner)
            row.pack(fill="x", pady=2)
            ttk.Label(row, text=prog["title"], width=35, anchor="w").pack(side="left")
            entry = tk.Entry(row, font=("Inter", 10), bg="#1e293b", fg="#f1f5f9", insertbackground="#60a5fa", width=50)
            entry.insert(0, prog.get("requirements", ""))
            entry.pack(side="left", padx=5, fill="x", expand=True)
            self.program_entries.append(entry)

    def load_exercise(self, idx):
        self.save_current()  # Save previous before moving
        self.current_idx = idx
        ex = self.exercises[idx]
        rec = ex.get("recommendations", {})

        # Update counter
        issues = self.count_issues(ex)
        status = f"  {'⚠️ ' + str(issues) + ' issues' if issues else '✅ OK'}"
        self.lbl_counter.config(text=f"{idx + 1} / {len(self.exercises)}{status}")

        # Fill fields
        self.lbl_id.config(text=ex["id"])
        self.entry_name.delete(0, "end")
        self.entry_name.insert(0, ex.get("name", ""))

        self.entry_reps.delete(0, "end")
        self.entry_reps.insert(0, rec.get("reps", ""))
        self.entry_sets.delete(0, "end")
        self.entry_sets.insert(0, rec.get("sets", ""))
        self.entry_units.delete(0, "end")
        self.entry_units.insert(0, rec.get("repUnits", "reps"))

        self.text_note.delete("1.0", "end")
        self.text_note.insert("1.0", rec.get("note", ""))

        # Demos
        for w in self.demos_frame.winfo_children():
            w.destroy()

        demos = ex.get("demos", [])
        if not demos:
            ttk.Label(self.demos_frame, text="⚠️ No demos", foreground="#ef4444").pack(anchor="w")

        for i, demo in enumerate(demos):
            row = ttk.Frame(self.demos_frame)
            row.pack(fill="x", pady=2)

            # Type dropdown
            type_cb = ttk.Combobox(row, values=["youtube", "cloudinary", "tiktok", "vimeo", "url", "local"], width=10, state="readonly")
            type_cb.set(demo.get("type", "youtube"))
            type_cb.pack(side="left", padx=2)
            type_cb.bind("<<ComboboxSelected>>", lambda e, d=demo, cb=type_cb: self._update_demo(d, "type", cb.get()))

            # URL entry
            url_entry = tk.Entry(row, font=("Inter", 9), bg="#1e293b", fg="#f1f5f9", insertbackground="#60a5fa", width=30)
            url_entry.insert(0, demo.get("url", ""))
            url_entry.pack(side="left", padx=2)
            url_entry.bind("<FocusOut>", lambda e, d=demo, ent=url_entry: self._update_demo(d, "url", ent.get().strip()))

            # Notes entry
            note_entry = tk.Entry(row, font=("Inter", 9), bg="#1e293b", fg="#f1f5f9", insertbackground="#60a5fa", width=20)
            note_entry.insert(0, demo.get("notes", ""))
            note_entry.pack(side="left", padx=2)
            note_entry.bind("<FocusOut>", lambda e, d=demo, ent=note_entry: self._update_demo(d, "notes", ent.get().strip()))

            # Edit button (full editor)
            ttk.Button(row, text="✎", width=2, command=lambda idx=i: self.edit_demo_dialog(idx)).pack(side="left", padx=2)

            # Preview button (opens in browser)
            ttk.Button(row, text="▶", width=2, command=lambda d=demo: webbrowser.open(d.get("url", ""))).pack(side="left", padx=2)

            # Reject button (moves to rejectedDemos)
            ttk.Button(row, text="👎", width=2, command=lambda idx=i: self.reject_demo(idx)).pack(side="left", padx=2)

            # Delete button
            ttk.Button(row, text="✕", width=2, command=lambda idx=i: self.delete_demo(idx)).pack(side="left", padx=2)

        # Add demo button
        ttk.Button(self.demos_frame, text="+ Add Demo", command=self.add_demo_dialog).pack(anchor="w", pady=(5, 0))

        # Status
        issues_list = self.get_issues(ex)
        self.lbl_status.config(text="  |  ".join(issues_list) if issues_list else "")

    def save_demo_note(self, demo, entry):
        val = entry.get().strip()
        if val:
            demo["notes"] = val
        elif "notes" in demo:
            del demo["notes"]
        self.unsaved_changes = True

    def _update_demo(self, demo, key, value):
        if value:
            demo[key] = value
        elif key in demo:
            del demo[key]
        self.unsaved_changes = True

    def edit_demo_dialog(self, demo_idx):
        """Full editor for an existing demo — all fields as dropdowns/entries."""
        ex = self.exercises[self.current_idx]
        demo = ex["demos"][demo_idx]

        dialog = tk.Toplevel(self.root)
        dialog.title(f"Edit Demo {demo_idx + 1}")
        dialog.geometry("600x550")
        dialog.configure(bg="#1e293b")
        dialog.transient(self.root)
        dialog.grab_set()

        fields = {}

        def add_dropdown(label, key, options, default):
            ttk.Label(dialog, text=label).pack(anchor="w", padx=10, pady=(8, 2))
            var = tk.StringVar(value=demo.get(key, default))
            cb = ttk.Combobox(dialog, textvariable=var, values=options, state="readonly", width=20)
            cb.pack(anchor="w", padx=10)
            fields[key] = var

        def add_entry(label, key, default="", width=55):
            ttk.Label(dialog, text=label).pack(anchor="w", padx=10, pady=(8, 2))
            entry = tk.Entry(dialog, font=("Inter", 11), bg="#0f172a", fg="#f1f5f9", insertbackground="#60a5fa", width=width)
            entry.insert(0, str(demo.get(key, default)))
            entry.pack(fill="x", padx=10)
            fields[key] = entry

        add_dropdown("Type:", "type", ["youtube", "cloudinary", "tiktok", "vimeo", "url", "local"], "youtube")
        add_dropdown("Media Type:", "mediaType", ["video", "image"], "video")
        add_dropdown("Format:", "format", ["youtube", "mp4", "gif", "webm", "mov", "png", "jpg"], "youtube")
        add_entry("URL:", "url")
        add_entry("Start Time (sec):", "startTime", "0", width=10)
        add_entry("End Time (sec):", "endTime", "0", width=10)
        add_dropdown("Primary:", "isPrimary", ["True", "False"], str(demo.get("isPrimary", False)))
        add_entry("Notes / Caption:", "notes")

        def save():
            demo["type"] = fields["type"].get()
            demo["mediaType"] = fields["mediaType"].get()
            demo["format"] = fields["format"].get()
            demo["url"] = fields["url"].get().strip()
            demo["startTime"] = int(fields["startTime"].get() or 0)
            demo["endTime"] = int(fields["endTime"].get() or 0)
            demo["isPrimary"] = fields["isPrimary"].get() == "True"
            notes = fields["notes"].get().strip()
            if notes:
                demo["notes"] = notes
            elif "notes" in demo:
                del demo["notes"]
            # If primary, unmark others
            if demo["isPrimary"]:
                for d in ex["demos"]:
                    if d is not demo:
                        d["isPrimary"] = False
            self.unsaved_changes = True
            dialog.destroy()
            self.load_exercise(self.current_idx)

        ttk.Button(dialog, text="Save Changes", command=save).pack(pady=15)
        dialog.bind("<Return>", lambda e: save())

    def delete_demo(self, demo_idx):
        ex = self.exercises[self.current_idx]
        demos = ex.get("demos", [])
        if 0 <= demo_idx < len(demos):
            demos.pop(demo_idx)
            self.unsaved_changes = True
            self.load_exercise(self.current_idx)

    def reject_demo(self, demo_idx):
        """Move a demo to rejectedDemos with an optional reason."""
        ex = self.exercises[self.current_idx]
        demos = ex.get("demos", [])
        if demo_idx < 0 or demo_idx >= len(demos):
            return
        demo = demos[demo_idx]
        reason = simpledialog.askstring("Reject Demo", "Why is this demo bad? (optional):", parent=self.root)
        if reason is None:  # cancelled
            return
        # Move to rejectedDemos
        rejected_entry = {"url": demo.get("url", ""), "reason": reason or "not relevant"}
        if demo.get("metadata", {}).get("title"):
            rejected_entry["title"] = demo["metadata"]["title"]
        if demo.get("metadata", {}).get("channel"):
            rejected_entry["channel"] = demo["metadata"]["channel"]
        if "rejectedDemos" not in ex:
            ex["rejectedDemos"] = []
        ex["rejectedDemos"].append(rejected_entry)
        # Remove from demos
        demos.pop(demo_idx)
        self.unsaved_changes = True
        self.load_exercise(self.current_idx)

    def add_demo_dialog(self):
        """Pop up a window to add a demo with all attributes as dropdowns."""
        dialog = tk.Toplevel(self.root)
        dialog.title("Add Demo")
        dialog.geometry("600x550")
        dialog.configure(bg="#1e293b")
        dialog.transient(self.root)
        dialog.grab_set()

        fields = {}

        def add_dropdown(label, key, options, default):
            ttk.Label(dialog, text=label).pack(anchor="w", padx=10, pady=(8, 2))
            var = tk.StringVar(value=default)
            cb = ttk.Combobox(dialog, textvariable=var, values=options, state="readonly", width=20)
            cb.pack(anchor="w", padx=10)
            fields[key] = var

        def add_entry(label, key, default="", width=55):
            ttk.Label(dialog, text=label).pack(anchor="w", padx=10, pady=(8, 2))
            entry = tk.Entry(dialog, font=("Inter", 11), bg="#0f172a", fg="#f1f5f9", insertbackground="#60a5fa", width=width)
            entry.insert(0, default)
            entry.pack(fill="x", padx=10)
            fields[key] = entry

        add_dropdown("Type:", "type", ["youtube", "cloudinary", "tiktok", "vimeo", "url", "local"], "youtube")
        add_dropdown("Media Type:", "mediaType", ["video", "image"], "video")
        add_dropdown("Format:", "format", ["youtube", "mp4", "gif", "webm", "mov", "png", "jpg"], "youtube")
        add_entry("URL:", "url")
        fields["url"].focus()
        add_entry("Start Time (sec):", "startTime", "0", width=10)
        add_entry("End Time (sec):", "endTime", "0", width=10)
        is_first = len(self.exercises[self.current_idx].get("demos", [])) == 0
        add_dropdown("Primary:", "isPrimary", ["True", "False"], "True" if is_first else "False")
        add_entry("Notes / Caption:", "notes")

        def submit():
            url = fields["url"].get().strip()
            if not url:
                messagebox.showwarning("Missing URL", "Please enter a URL.")
                return
            new_demo = {
                "type": fields["type"].get(),
                "mediaType": fields["mediaType"].get(),
                "format": fields["format"].get(),
                "url": url,
                "startTime": int(fields["startTime"].get() or 0),
                "endTime": int(fields["endTime"].get() or 0),
                "isPrimary": fields["isPrimary"].get() == "True",
            }
            notes = fields["notes"].get().strip()
            if notes:
                new_demo["notes"] = notes

            ex = self.exercises[self.current_idx]
            if "demos" not in ex:
                ex["demos"] = []
            # If marking as primary, unmark others
            if new_demo["isPrimary"]:
                for d in ex["demos"]:
                    d["isPrimary"] = False
            ex["demos"].append(new_demo)
            self.unsaved_changes = True
            dialog.destroy()
            self.load_exercise(self.current_idx)

        ttk.Button(dialog, text="Add Demo", command=submit).pack(pady=15)
        dialog.bind("<Return>", lambda e: submit())

    def save_current(self):
        if not hasattr(self, 'current_idx'):
            return
        ex = self.exercises[self.current_idx]
        ex["name"] = self.entry_name.get().strip()

        rec = ex.setdefault("recommendations", {})
        reps = self.entry_reps.get().strip()
        sets = self.entry_sets.get().strip()
        units = self.entry_units.get().strip()
        note = self.text_note.get("1.0", "end").strip()

        if reps: rec["reps"] = reps
        elif "reps" in rec: del rec["reps"]
        if sets: rec["sets"] = sets
        elif "sets" in rec: del rec["sets"]
        if units and units != "reps": rec["repUnits"] = units
        elif "repUnits" in rec: del rec["repUnits"]
        if note: rec["note"] = note
        elif "note" in rec: del rec["note"]

        self.unsaved_changes = True

    def save_all(self):
        self.save_current()
        # Save program requirements
        for i, entry in enumerate(self.program_entries):
            val = entry.get().strip()
            if val:
                self.programs[i]["requirements"] = val
            elif "requirements" in self.programs[i]:
                del self.programs[i]["requirements"]

        save_exercises(self.exercises_data)
        save_workouts(self.workouts_data)
        self.unsaved_changes = False
        messagebox.showinfo("Saved", f"✅ Saved {len(self.exercises)} exercises + {len(self.programs)} programs")

    def next_exercise(self):
        if self.current_idx < len(self.exercises) - 1:
            self.load_exercise(self.current_idx + 1)

    def prev_exercise(self):
        if self.current_idx > 0:
            self.load_exercise(self.current_idx - 1)

    def skip_to_issues(self):
        """Jump to next exercise with issues (no note, no demos, etc)"""
        start = self.current_idx + 1
        for i in range(start, len(self.exercises)):
            if self.count_issues(self.exercises[i]) > 0:
                self.load_exercise(i)
                return
        # Wrap around
        for i in range(0, start):
            if self.count_issues(self.exercises[i]) > 0:
                self.load_exercise(i)
                return
        messagebox.showinfo("All Good", "🎉 No more issues found!")

    def count_issues(self, ex):
        return len(self.get_issues(ex))

    def ai_fill(self):
        """Call OpenAI to suggest note, reps/sets, and YouTube search query."""
        ex = self.exercises[self.current_idx]
        name = ex.get("name", "")
        rec = ex.get("recommendations", {})
        current_note = rec.get("note", "")
        user_prompt = self.entry_ai_prompt.get().strip()

        # Get API key
        api_key = os.environ.get("OPENAI_API_KEY", "")
        if not api_key:
            # Try reading from localStorage equivalent (the .env file)
            env_path = ROOT / ".env"
            if env_path.exists():
                for line in env_path.read_text().splitlines():
                    if line.startswith("OPENAI_API_KEY="):
                        api_key = line.split("=", 1)[1].strip()
            if not api_key:
                api_key = simpledialog.askstring("API Key", "Enter your OpenAI API key:", show="*")
                if not api_key:
                    return

        # Build prompt
        system = """You are a fitness exercise expert. Given an exercise name, provide:
1. A concise form note (1-2 sentences, practical cues for someone doing the exercise)
2. Suggested reps if not provided
3. Suggested sets if not provided
4. A YouTube search query to find a good demo video

Respond in JSON format:
{"note": "...", "reps": "...", "sets": "...", "repUnits": "...", "youtubeQuery": "..."}

Only fill reps/sets/repUnits if they are currently missing. If they exist, return them as empty strings.
Keep the note practical and concise — form cues, common mistakes, breathing."""

        user_msg = f"Exercise: {name}"
        if current_note:
            user_msg += f"\nCurrent note: {current_note}"
        if rec.get("reps"):
            user_msg += f"\nCurrent reps: {rec['reps']}"
        if rec.get("sets"):
            user_msg += f"\nCurrent sets: {rec['sets']}"
        if user_prompt:
            user_msg += f"\nAdditional context: {user_prompt}"

        # Call OpenAI
        self.lbl_status.config(text="🤖 Calling AI...")
        self.root.update()

        try:
            payload = json.dumps({
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system},
                    {"role": "user", "content": user_msg}
                ],
                "temperature": 0.3,
                "response_format": {"type": "json_object"}
            }).encode()

            req = urllib.request.Request(
                "https://api.openai.com/v1/chat/completions",
                data=payload,
                headers={
                    "Content-Type": "application/json",
                    "Authorization": f"Bearer {api_key}"
                }
            )
            with urllib.request.urlopen(req, timeout=15, context=ssl_ctx) as resp:
                result = json.loads(resp.read().decode())

            content = result["choices"][0]["message"]["content"]
            data = json.loads(content)

            # Fill note
            if data.get("note"):
                self.text_note.delete("1.0", "end")
                self.text_note.insert("1.0", data["note"])

            # Fill reps/sets if empty
            if data.get("reps") and not self.entry_reps.get().strip():
                self.entry_reps.delete(0, "end")
                self.entry_reps.insert(0, data["reps"])
            if data.get("sets") and not self.entry_sets.get().strip():
                self.entry_sets.delete(0, "end")
                self.entry_sets.insert(0, data["sets"])
            if data.get("repUnits") and not self.entry_units.get().strip():
                self.entry_units.delete(0, "end")
                self.entry_units.insert(0, data["repUnits"])

            # Show YouTube query
            yt_query = data.get("youtubeQuery", "")
            status = f"✅ AI filled. YouTube search: \"{yt_query}\""
            self.lbl_status.config(text=status)

            # Offer to open YouTube search
            if yt_query:
                if messagebox.askyesno("YouTube Search", f"Open YouTube search for:\n\"{yt_query}\"?"):
                    webbrowser.open(f"https://www.youtube.com/results?search_query={yt_query.replace(' ', '+')}")

            self.unsaved_changes = True

        except Exception as e:
            self.lbl_status.config(text=f"❌ AI error: {str(e)[:60]}")
            messagebox.showerror("AI Error", str(e))

    def get_issues(self, ex):
        issues = []
        rec = ex.get("recommendations", {})
        if not rec.get("note"):
            issues.append("Missing note")
        if not ex.get("demos"):
            issues.append("No demos")
        if not rec.get("reps"):
            issues.append("No reps")
        if not rec.get("sets"):
            issues.append("No sets")
        # Check for demo notes
        for i, demo in enumerate(ex.get("demos", [])):
            if not demo.get("notes") and demo.get("type") != "cloudinary":
                issues.append(f"Demo {i+1} missing caption")
                break
        return issues


# --- Run ---
if __name__ == "__main__":
    root = tk.Tk()
    app = DataEditorApp(root)

    # Keyboard shortcuts
    root.bind("<Command-s>", lambda e: app.save_all())
    root.bind("<Control-s>", lambda e: app.save_all())
    root.bind("<Command-Right>", lambda e: app.next_exercise())
    root.bind("<Command-Left>", lambda e: app.prev_exercise())
    root.bind("<Control-Right>", lambda e: app.next_exercise())
    root.bind("<Control-Left>", lambda e: app.prev_exercise())

    root.mainloop()
