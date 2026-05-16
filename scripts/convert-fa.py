#!/usr/bin/env python3
"""Convert Lordicon placeholders to Font Awesome icons."""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

FA = {
    "sun": "fa-solid fa-sun",
    "solar": "fa-solid fa-solar-panel",
    "home": "fa-solid fa-house",
    "building": "fa-solid fa-building",
    "factory": "fa-solid fa-industry",
    "tools": "fa-solid fa-screwdriver-wrench",
    "bolt": "fa-solid fa-bolt",
    "ev": "fa-solid fa-charging-station",
    "leaf": "fa-solid fa-leaf",
    "eco": "fa-solid fa-seedling",
    "shield": "fa-solid fa-shield-halved",
    "check": "fa-solid fa-circle-check",
    "globe": "fa-solid fa-globe",
    "pin": "fa-solid fa-location-dot",
    "phone": "fa-solid fa-phone",
    "email": "fa-solid fa-envelope",
    "cert": "fa-solid fa-certificate",
    "school": "fa-solid fa-school",
    "shop": "fa-solid fa-store",
    "hospital": "fa-solid fa-hospital",
    "chart": "fa-solid fa-chart-line",
    "speed": "fa-solid fa-gauge-high",
    "user": "fa-solid fa-user-tie",
    "userAlt": "fa-solid fa-user",
    "engineer": "fa-solid fa-hard-hat",
    "scientist": "fa-solid fa-flask",
    "whatsapp": "fa-brands fa-whatsapp",
    "linkedin": "fa-brands fa-linkedin-in",
    "instagram": "fa-brands fa-instagram",
    "facebook": "fa-brands fa-facebook-f",
    "twitter": "fa-brands fa-x-twitter",
    "savings": "fa-solid fa-indian-rupee-sign",
    "moon": "fa-solid fa-moon",
    "sunMode": "fa-solid fa-sun",
}

HEAD_OLD = """  <link rel="stylesheet" href="css/icons.css">
  <script src="https://cdn.lordicon.com/lordicon.js"></script>"""

HEAD_NEW = """  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
  <link rel="stylesheet" href="css/icons.css">"""

SCRIPT_OLD = """  <script src="js/icons.js"></script>
  <script src="js/main.js"></script>"""

SCRIPT_NEW = """  <script src="js/main.js"></script>"""

FONT_OLD = 'family=Outfit:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600;700'
FONT_NEW = 'family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700'

ICON_RE = re.compile(
    r'<(?:motion-blur-enter|div|span)\s+class="icon-box\s+icon-box--([^"]+)"[^>]*data-icon="([^"]+)"[^>]*>\s*</(?:motion-blur-enter|motion-blur-enter|div|span)>',
    re.I,
)

ICON_RE2 = re.compile(
    r'<(?:div|span)\s+class="icon-box\s+icon-box--([^"]+)"[^>]*data-icon="([^"]+)"[^>]*></(?:div|span)>',
)


def fa_span(box_class: str, icon: str) -> str:
    cls = FA.get(icon, "fa-solid fa-circle")
    wrap = box_class.replace("icon-box", "icon-wrap")
    return f'<span class="icon-wrap {wrap}"><i class="{cls}" aria-hidden="true"></i></span>'


def process(text: str) -> str:
    def repl(m):
        return fa_span(f"icon-box--{m.group(1)}", m.group(2))

    for pat in [ICON_RE2, ICON_RE]:
        text = pat.sub(repl, text)
    # bare icon-box without close on same line
    text = re.sub(
        r'<(?:motion-blur-enter|div|span)\s+class="icon-box\s+(icon-box--[^"]+)"[^>]*data-icon="([^"]+)"[^>]*/>',
        lambda m: fa_span(m.group(1), m.group(2)),
        text,
    )
    return text


for path in ROOT.glob("*.html"):
    t = path.read_text(encoding="utf-8")
    orig = t
    t = t.replace(HEAD_OLD, HEAD_NEW)
    t = t.replace(SCRIPT_OLD, SCRIPT_NEW)
    t = t.replace(FONT_OLD, FONT_NEW)
    t = process(t)
    # theme toggle empty button - add moon icon
    t = t.replace(
        '<button class="theme-toggle" type="button" aria-label="Toggle theme"></button>',
        '<button class="theme-toggle" type="button" aria-label="Toggle theme"><i class="fa-solid fa-moon"></i></button>',
    )
    if t != orig:
        path.write_text(t, encoding="utf-8")
        print("updated", path.name)
