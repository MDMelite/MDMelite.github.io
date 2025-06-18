# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static promotional website for "The Child of Comedy" novel by D. Moberg. It's a single-page application with multimedia content including sample chapters, audiobook previews, and promotional videos.

## Development Commands

This is a pure static website with no build process:
- **Run locally**: Open `index.html` directly in a browser or use a local server (e.g., `python -m http.server 8000` or `npx serve`)
- **Deploy**: Push to GitHub and enable GitHub Pages, or upload to any static hosting service
- **Domain setup**: Rename `CNAME.example` to `CNAME` for custom domain on GitHub Pages

## Architecture & Key Components

### Custom Audio Player (`audio-player.js`)
- Full-featured HTML5 audio player with progress persistence
- Stores playback position in localStorage
- Keyboard shortcuts: space/k (play/pause), arrows (seek/volume), m (mute)
- Touch-friendly mobile controls

### Design System
CSS variables defined in `index.html`:
- `--charcoal-black`: #1a1a1a (main background)
- `--brick-red`: #8B4513
- `--cream`: #FAF0E6
- `--gold`: #FFD700 (accent color)

### External Dependencies (via CDN)
- Tailwind CSS for utility styling
- GSAP + ScrollTrigger for animations
- Google Fonts: Playfair Display (serif), Inter (sans-serif)

### Content Structure
- `/assets/` - Book covers and promotional videos
- `/audio/` - Audiobook chapter samples
- Single `index.html` with all content sections

## Key Implementation Details

1. **Animations**: GSAP ScrollTrigger animations are initialized in inline scripts at the bottom of `index.html`
2. **Audio Player**: Instantiated with `new AudioPlayer('elementId', 'audioFile.mp3')`
3. **Responsive Design**: Uses Tailwind's responsive utilities throughout
4. **No JavaScript Framework**: Vanilla JavaScript for maximum performance and simplicity