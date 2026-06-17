#!/usr/bin/env python3
"""
Backfill exercise metadata using OpenAI.
Adds: description, purpose, benefits, howTo, commonMistakes, muscleGroups, equipment
to all exercises in exercises.json.

Usage: python3 scripts/backfill-exercise-metadata.py
"""

import json
import os
import sys
import time
import urllib.request
import ssl
from pathlib import Path

ROOT = Path(__file__).parent.parent
EXERCISES_PATH = ROOT / "exercises.json"
DATA_MODEL_PATH = ROOT / "data-model.json"
ENV_PATH = ROOT / ".env"

# SSL context
ssl_ctx = ssl.create_default_context()
try:
    import certifi
    ssl_ctx.load_verify_locations(certifi.where())
except ImportError:
    ssl_ctx.check_hostname = False
    ssl_ctx.verify_mode = ssl.CERT_NONE


def get_api_key():
    key = os.environ.get("OPENAI_API_KEY", "")
    if not key and ENV_PATH.exists():
        for line in ENV_PATH.read_text().splitlines():
            if line.startswith("OPENAI_API_KEY="):
                key = line.split("=", 1)[1].strip()
    if not key:
        print("ERROR: No OPENAI_API_KEY found in environment or .env file.")
        sys.exit(1)
    return key


def load_data_model():
    with open(DATA_MODEL_PATH) as f:
        return json.load(f)


def load_exercises():
    with open(EXERCISES_PATH) as f:
        return json.load(f)


def save_exercises(data):
    with open(EXERCISES_PATH, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")


def call_openai(api_key, messages, retries=3):
    payload = json.dumps({
        "model": "gpt-4o-mini",
        "messages": messages,
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

    for attempt in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=60, context=ssl_ctx) as resp:
                result = json.loads(resp.read().decode())
            content = result["choices"][0]["message"]["content"]
            return json.loads(content)
        except Exception as e:
            if attempt < retries - 1:
                print(f"    Retry {attempt + 1} after error: {str(e)[:80]}")
                time.sleep(2 ** attempt)
            else:
                raise


def build_system_prompt(muscle_group_ids, equipment_ids):
    return f"""You are a 50-year veteran combining expertise as a physical therapist, personal trainer, orthopedic surgeon, and human body specialist. You write exercise descriptions that are expert-informed but accessible to anyone with no training background.

RULES:
- Write in plain English. No jargon without brief explanation.
- No emojis, em dashes, en dashes, or decorative punctuation. Use commas, periods, and semicolons only.
- No profanity, slang, or crude humor.
- Positive, encouraging tone. Frame corrections as improvements.
- No body shaming or appearance-focused language. Focus on function, strength, and health.
- No gendered language about who benefits from an exercise.
- No medical claims or guarantees. Use "may reduce risk" not "prevents."
- Be politically correct and inclusive.
- Active voice. Direct and concise.

VALID MUSCLE GROUP IDS (use ONLY these):
{json.dumps(muscle_group_ids)}

VALID EQUIPMENT IDS (use ONLY these, empty array means bodyweight):
{json.dumps(equipment_ids)}

Respond with a JSON object containing:
- "description": string (1-2 sentences, what the exercise is)
- "purpose": string (1-3 sentences, why it is in a program)
- "benefits": string (physiobiological adaptations, plain language, 2-4 sentences)
- "howTo": array of strings (3-6 numbered steps, each starting with a verb)
- "commonMistakes": array of strings (3-4 items, each states mistake then fix in 1-2 sentences)
- "muscleGroups": array of valid muscle group IDs (first is primary)
- "equipment": array of valid equipment IDs (empty if bodyweight only)"""


def build_user_prompt(exercise):
    name = exercise.get("name", "")
    note = exercise.get("recommendations", {}).get("note", "")
    reps = exercise.get("recommendations", {}).get("reps", "")
    sets = exercise.get("recommendations", {}).get("sets", "")

    prompt = f"Exercise: {name}"
    if note:
        prompt += f"\nExisting coaching note: {note}"
    if reps:
        prompt += f"\nTypical reps: {reps}"
    if sets:
        prompt += f"\nTypical sets: {sets}"
    return prompt


def needs_backfill(exercise):
    """Check if an exercise is missing the new fields."""
    return not exercise.get("description") or not exercise.get("muscleGroups")


def main():
    api_key = get_api_key()
    data_model = load_data_model()
    exercises_data = load_exercises()
    exercises = exercises_data["exercises"]

    muscle_group_ids = [mg["id"] for mg in data_model["muscleGroups"]["values"]]
    equipment_ids = [eq["id"] for eq in data_model["equipment"]["values"]]

    system_prompt = build_system_prompt(muscle_group_ids, equipment_ids)

    total = len(exercises)
    to_process = [(i, ex) for i, ex in enumerate(exercises) if needs_backfill(ex)]
    print(f"Total exercises: {total}")
    print(f"Need backfill: {len(to_process)}")
    print()

    if not to_process:
        print("All exercises already have metadata. Nothing to do.")
        return

    for count, (i, ex) in enumerate(to_process, 1):
        print(f"[{count}/{len(to_process)}] {ex['name']} ({ex['id']})")

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": build_user_prompt(ex)}
        ]

        try:
            result = call_openai(api_key, messages)

            # Validate muscle groups
            valid_mg = [mg for mg in result.get("muscleGroups", []) if mg in muscle_group_ids]
            if not valid_mg:
                valid_mg = ["full-body"]

            # Validate equipment
            valid_eq = [eq for eq in result.get("equipment", []) if eq in equipment_ids]

            # Apply fields
            ex["description"] = result.get("description", "")
            ex["purpose"] = result.get("purpose", "")
            ex["benefits"] = result.get("benefits", "")
            ex["howTo"] = result.get("howTo", [])
            ex["commonMistakes"] = result.get("commonMistakes", [])
            ex["muscleGroups"] = valid_mg
            ex["equipment"] = valid_eq
            if "alternatives" not in ex:
                ex["alternatives"] = []

            print(f"    OK: {len(valid_mg)} muscles, {len(valid_eq)} equipment, {len(ex['howTo'])} steps")

        except Exception as e:
            print(f"    ERROR: {str(e)[:100]}")
            print(f"    Skipping this exercise.")
            continue

        # Save every 5 exercises to avoid losing progress
        if count % 5 == 0:
            save_exercises(exercises_data)
            print(f"    [Saved checkpoint at {count}/{len(to_process)}]")

        # Rate limiting
        time.sleep(0.5)

    # Final save
    save_exercises(exercises_data)
    print(f"\nDone. Backfilled {len(to_process)} exercises.")


if __name__ == "__main__":
    main()
