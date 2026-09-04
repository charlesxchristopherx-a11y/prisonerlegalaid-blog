# PLA short-form video pipeline

Generates a caption-synced vertical MP4 from a plain-text script. No avatar,
no paid services, no manual editing step.

    export CF_ACCOUNT_ID=... CF_API_TOKEN=...
    python3 render.py --script script.txt --out video.mp4 --voice helena

## How it works

1. **Cloudflare Workers AI (Deepgram Aura-2)** turns the script into speech.
2. **Whisper large-v3-turbo** transcribes that audio to get word timings.
3. Timings are aligned back onto the **original script** words.
4. FFmpeg renders 1080x1920 with caption timing driven by real speech.

Both AI models are on Cloudflare's free tier. FFmpeg is preinstalled on
GitHub Actions runners. Marginal cost per video is effectively zero.

## Three decisions worth understanding before changing anything

**Whisper is used for TIMING ONLY.** The words on screen come from the input
script. Whisper is accurate but not perfect -- during development it rendered
"court appointed" as "court -appointive". A transcription error must never
appear on screen as if it were the copy. `align()` maps timings onto the real
words with a sequence matcher and interpolates across any drift.

**Line breaking is grammar-aware, not width-aware.** Wrapping purely on
character count produced orphans like "appointed for the" / "trial". Both
`phrases()` and `split_lines()` refuse to end a line or phrase on a function
word (the DANGLERS set) and will absorb a one-word tail into the previous line.

**Script length is enforced, not suggested.** 45-80 words, 14-34 seconds.
Below that a video reads as filler; above ~30s completion rate falls sharply
on Reels and TikTok. `check_script()` rejects out-of-range input rather than
producing something that will not perform.

## Failure behaviour

Every stage validates and exits non-zero with a specific message. This is
deliberate: an unattended pipeline that silently ships a broken video is worse
than one that stops and reports. Exit codes: 1 config, 2 upstream API, 3
validation.

Checks include: required fonts and logos present; TTS returned real audio of
plausible duration; Whisper returned enough word timings; at least 55% of
script words aligned to audio (below that captions would drift); output has
the right dimensions, expected duration, and an audio track.

## Tests

    python3 test_render.py

Pure-logic tests, no network. They cover the two bugs that shipped during
development -- dangling function words and Whisper mis-transcriptions
reaching the screen -- plus script-length and prohibited-claim rejection.
Run these before changing caption logic.

## Assets

`logo_small.png` / `logo_end.png` are the brand mark on a white circular
badge. The source logo is dark artwork on white with no alpha channel, so it
disappears against a dark video; the badge is what makes it legible. Do not
replace these with the raw logo.
