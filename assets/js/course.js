/* ==========================================================================
   Free AI Business Course — progress, notes, fill-in prompts, lesson rail.

   Plain script, no dependencies, works from file:// and any static host.
   Every page is complete without it; this adds:
   - "Mark this lesson as done" and a notes box on every lesson
   - fill-in-the-blanks on every prompt, with a Copy button that copies
     exactly what's on screen
   - ticks, "continue", the route and your notes on the course map
   - the module rail (wide screens) and module outline (small screens)
   - lessons that open in order: each one once the one before it is ticked
   Everything is saved in this browser only (localStorage).
   ========================================================================== */
(function () {
  "use strict";

  /* The course outline. When you add a lesson page, add it here too
     (and to index.html) so the rail, ticks and progress count include it.
     Paths are relative to the modules/ folder. */
  var COURSE = /* outline:start */ [
    {
      n: 0,
      title: "Your First Week",
      lessons: [
        ["0.1", "Day 1: Publish Something in 20 Minutes", "module-0/0.1-day-1-publish-something.html"],
        ["0.2", "Day 2: Your Home Base", "module-0/0.2-day-2-your-home-base.html"],
        ["0.3", "Day 3: A Tool You Will Actually Use", "module-0/0.3-day-3-a-tool-you-will-use.html"],
        ["0.4", "Day 4: Rebuild Day 1, Better", "module-0/0.4-day-4-rebuild-day-1.html"],
        ["0.5", "Day 5: Build for a Real Business", "module-0/0.5-day-5-build-for-a-real-business.html"],
        ["0.6", "Day 6: Put Real Data In It", "module-0/0.6-day-6-put-real-data-in-it.html"],
        ["0.7", "Day 7: Show One Person", "module-0/0.7-day-7-show-one-person.html"],
      ],
    },
    {
      n: 1,
      title: "Mental Preparation & Fundamentals",
      lessons: [
        ["1.1", "Why This Works Right Now", "module-1/1.1-why-this-works-now.html"],
        ["1.2", "How These Businesses Actually Make Money", "module-1/1.2-how-they-make-money.html"],
        ["1.3", "The Anti-Watcher Mindset", "module-1/1.3-anti-watcher-mindset.html"],
        ["1.4", "What Success Actually Looks Like", "module-1/1.4-what-success-looks-like.html"],
      ],
    },
    {
      n: 2,
      title: "Personalized Niche Selection",
      lessons: [
        ["2.1", "How to Actually Pick a Niche", "module-2/2.1-how-to-pick-a-niche.html"],
        ["2.2", "Build Your Lead Scraper in Base44", "module-2/2.2-build-your-lead-scraper.html"],
        ["2.3", "Validating Demand Before You Build Anything", "module-2/2.3-validating-demand.html"],
        ["2.4", "Locking In Your Niche", "module-2/2.4-locking-in-your-niche.html"],
      ],
    },
    {
      n: 3,
      title: "Setting Up Operations",
      lessons: [
        ["3.1", "Base44 Walkthrough: Your First Build", "module-3/3.1-your-first-build.html"],
        ["3.2", "Structuring a Base44 Project for Client Work", "module-3/3.2-structuring-for-client-work.html"],
        ["3.3", "Your Business Backend", "module-3/3.3-your-business-backend.html"],
        ["3.4", "Deploying & Handing Off a Build", "module-3/3.4-deploying-and-handoff.html"],
      ],
    },
    {
      n: 4,
      title: "Your Brand & Positioning",
      lessons: [
        ["4.1", "What You Actually Are", "module-4/4.1-what-you-actually-are.html"],
        ["4.2", "Naming and the Basics", "module-4/4.2-naming-and-the-basics.html"],
        ["4.3", "Build Your Site in Base44", "module-4/4.3-build-your-site.html"],
        ["4.4", "Your Proof Assets", "module-4/4.4-your-proof-assets.html"],
      ],
    },
    {
      n: 5,
      title: "Client Acquisition",
      lessons: [
        ["5.1", "Who to Contact and How to Find Them", "module-5/5.1-finding-who-to-contact.html"],
        ["5.2", "The Outreach Scripts", "module-5/5.2-outreach-scripts.html"],
        ["5.3", "The Demo That Sells Itself", "module-5/5.3-the-demo-that-sells-itself.html"],
        ["5.4", "Handling Objections & Closing", "module-5/5.4-handling-objections-and-closing.html"],
        ["5.5", "Contracts & Getting Paid", "module-5/5.5-contracts-and-getting-paid.html"],
      ],
    },
    {
      n: 6,
      title: "AI Agent Automation",
      lessons: [
        ["6.1", "What Agents Actually Do for a Small Business", "module-6/6.1-what-agents-do.html"],
        ["6.2", "Building Your First Agent in Base44", "module-6/6.2-building-your-first-agent.html"],
        ["6.3", "Connecting an Agent to Real Business Data", "module-6/6.3-connecting-real-data.html"],
        ["6.4", "Packaging Agents as a Recurring Add-On", "module-6/6.4-packaging-as-recurring.html"],
      ],
    },
    {
      n: 7,
      title: "1-Week Sprint Blueprint",
      lessons: [
        ["7.1", "The Week at a Glance", "module-7/7.1-the-week-at-a-glance.html"],
        ["7.2", "Days 1–3: Building the Deliverable in Base44", "module-7/7.2-days-1-3-the-build.html"],
        ["7.3", "Days 4–7: Turning the Build Into a Sale", "module-7/7.3-days-4-7-the-sale.html"],
        ["7.4", "What Happens After Client #1", "module-7/7.4-what-happens-after-client-1.html"],
      ],
    },
  ] /* outline:end */;

  var DONE_KEY = "free-ai-business-course:done";
  var FILLS_KEY = "free-ai-business-course:fills";
  var NOTES_KEY = "free-ai-business-course:notes";
  var SVG_NS = "http://www.w3.org/2000/svg";

  /* Blanks that mean the same thing everywhere in the course, keyed by their
     bracket text (before any ", e.g."). Other named blanks are shared within
     one lesson; generic ones ([X], [PASTE]) are filled one at a time. */
  var COURSE_WIDE_BLANKS = {
    NICHE: { label: "Niche", note: "Used wherever a lesson asks for your niche." },
    "CLIENT NAME": { label: "Client's business name", note: "Used wherever a lesson asks for your client." },
  };
  /* Other wordings of a course-wide blank. */
  var BLANK_ALIASES = { CLIENT: "CLIENT NAME", "CLIENT BUSINESS": "CLIENT NAME", "CLIENT BUSINESS NAME": "CLIENT NAME" };

  /* Lesson 7.4 says the course loops from here: Module 5 outreach, Module 7 sprint, repeat. */
  var LOOP_START = "5.1";

  var script = document.currentScript;
  var root = script ? script.src.replace(/assets\/js\/course\.js(\?.*)?$/, "") : "";

  var lessons = [];
  COURSE.forEach(function (mod) {
    mod.lessons.forEach(function (l) {
      lessons.push({ id: l[0], title: l[1], path: l[2], module: mod });
    });
  });
  var byId = {};
  lessons.forEach(function (l) {
    byId[l.id] = l;
  });

  /** Absolute URL of a lesson page. */
  function lessonUrl(lesson) {
    return root + "modules/" + lesson.path;
  }

  /** True when an object has its own property `key`. */
  function has(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  /* ---- Saved state -------------------------------------------------------- */

  var storageOk = true;

  /** Read a JSON value from localStorage, or `fallback` if missing, malformed or blocked. */
  function readStore(key, fallback, isValid) {
    var raw;
    try {
      raw = window.localStorage.getItem(key);
    } catch (e) {
      storageOk = false;
      return fallback;
    }
    if (!raw) return fallback;
    try {
      var value = JSON.parse(raw);
      return isValid(value) ? value : fallback;
    } catch (e) {
      return fallback;
    }
  }

  /** Write a JSON value to localStorage; returns false if the browser refused. */
  function writeStore(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      storageOk = false;
      return false;
    }
  }

  /** True for a plain object (not an array or null). */
  function isPlainObject(v) {
    return !!v && typeof v === "object" && !Array.isArray(v);
  }

  /** The set of finished lesson ids. */
  function loadDone() {
    var list = readStore(DONE_KEY, [], Array.isArray);
    return new Set(
      list.filter(function (id) {
        return has(byId, id);
      })
    );
  }

  /** Save the set of finished lesson ids. */
  function saveDone(done) {
    return writeStore(DONE_KEY, Array.from(done));
  }

  /** Lesson notes: { "1.2": "text", ... }. */
  function loadNotes() {
    return readStore(NOTES_KEY, {}, isPlainObject);
  }

  /** Filled-in blanks: { "*": { NICHE: "..." }, "5.2": { "OWNER NAME": "..." } }. */
  function loadFills() {
    return readStore(FILLS_KEY, {}, isPlainObject);
  }

  /** Where to pick up: the first lesson not ticked (null when all are done). Lessons open in order,
      so this is the one unfinished lesson that's open. */
  function nextUp(done) {
    for (var i = 0; i < lessons.length; i++) {
      if (!done.has(lessons[i].id)) return lessons[i];
    }
    return null;
  }

  /* Lessons open in order: a lesson opens once every lesson before it is ticked, so Day 1 is always
     open and ticking a lesson opens the next. Unticking an earlier lesson closes the later ones again.
     A lesson that isn't open shows its title, but not its content, and isn't a link anywhere. This
     runs in the browser, so it guides rather than guards: with JavaScript off, every page shows
     everything, as it always has. */

  /** True when a lesson is open. When this browser can't save ticks, every lesson is (ticking
      couldn't open the next one). */
  function isOpen(lesson, done) {
    if (!storageOk) return true;
    var up = nextUp(done);
    return !up || lessons.indexOf(lesson) <= lessons.indexOf(up);
  }

  /** Make a link followable, or not: a locked lesson's link keeps its place and words, not its address. */
  function setLinkOpen(link, open) {
    if (open) {
      if (link.hasAttribute("data-locked-href")) {
        link.setAttribute("href", link.getAttribute("data-locked-href"));
        link.removeAttribute("data-locked-href");
      }
    } else if (link.hasAttribute("href")) {
      link.setAttribute("data-locked-href", link.getAttribute("href"));
      link.removeAttribute("href");
    }
    link.classList.toggle("is-locked", !open);
  }

  /** How many lessons of one module are finished. */
  function doneInModule(mod, done) {
    return mod.lessons.filter(function (l) {
      return done.has(l[0]);
    }).length;
  }

  /* ---- Small DOM helpers ------------------------------------------------- */

  /** Create an element with attributes and children (strings become text). */
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (key) {
      if (attrs[key] !== null && attrs[key] !== undefined && attrs[key] !== false) node.setAttribute(key, attrs[key]);
    });
    (children || []).forEach(function (child) {
      if (child === null || child === undefined) return;
      node.appendChild(typeof child === "string" ? document.createTextNode(child) : child);
    });
    return node;
  }

  /** A hand-drawn ballpoint tick. */
  function tick() {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "tick");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M2.2 8.9c1.3 1 2.5 2.3 3.6 3.9C7.9 8.6 10.4 5.3 14 2.4");
    svg.appendChild(path);
    return svg;
  }

  /** A small padlock, for a lesson that isn't open yet. */
  function lock() {
    var svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("class", "lock");
    svg.setAttribute("viewBox", "0 0 16 16");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    var path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", "M5.2 7.2V5.1a2.8 2.8 0 0 1 5.6 0v2.1M3.7 7.2h8.6v6.4H3.7z");
    svg.appendChild(path);
    return svg;
  }

  /** "1 lesson" / "7 lessons". */
  function plural(n, word) {
    return n + " " + word + (n === 1 ? "" : "s");
  }

  /** "OWNER NAME" becomes "Owner name"; text that already has lower case keeps its case. */
  function sentenceCase(s) {
    var text = /[a-z]/.test(s) ? s : s.toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  /** Run `fn` once input has paused for `ms`. */
  function debounce(fn, ms) {
    var timer;
    return function () {
      clearTimeout(timer);
      timer = setTimeout(fn, ms);
    };
  }

  /* ---- Prompts: fill in the blanks, then copy ------------------------------ */

  /** Wrap every [BRACKETED] run inside `container` in <mark class="fill">. An annotated
      span.blank becomes one mark (keeping its label and key); text inside span.keep is
      left alone, because it's meant for the AI tool exactly as written. */
  function markFillIns(container) {
    Array.prototype.slice.call(container.querySelectorAll("span.blank")).forEach(function (span) {
      var mark = el("mark", { class: "fill" }, [span.textContent]);
      ["key", "label", "hint", "long"].forEach(function (name) {
        var value = span.getAttribute("data-blank-" + name);
        if (value !== null) mark.setAttribute("data-blank-" + name, value);
      });
      span.parentNode.replaceChild(mark, span);
    });
    var walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        return node.parentNode.closest("mark, .keep") ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      },
    });
    var nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      var text = node.nodeValue;
      var pattern = /\[[^\[\]\n]+\]/g;
      if (!pattern.test(text)) return;
      pattern.lastIndex = 0;
      var frag = document.createDocumentFragment();
      var last = 0;
      var match;
      while ((match = pattern.exec(text))) {
        if (match.index > last) frag.appendChild(document.createTextNode(text.slice(last, match.index)));
        frag.appendChild(el("mark", { class: "fill" }, [match[0]]));
        last = match.index + match[0].length;
      }
      if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
      node.parentNode.replaceChild(frag, node);
    });
  }

  /** Label and hint for a blank: "SPECIFIC OBSERVATION, e.g. …" gives "Specific observation" + "e.g. …". */
  function describeBlank(raw) {
    var eg = raw.split(/, (?=e\.g\.)/);
    if (eg.length > 1) return { label: sentenceCase(eg[0]), hint: eg.slice(1).join(", ") };
    var dash = raw.split(" — ");
    if (dash.length > 1) return { label: sentenceCase(dash[0]), hint: dash.slice(1).join(" — ") };
    return { label: sentenceCase(raw), hint: "" };
  }

  /** A generic blank like [X] is labelled by its line: "I pulled ___ leads for [NICHE]…". */
  function contextLabel(mark, pre) {
    var range = document.createRange();
    range.setStart(pre, 0);
    range.setEndBefore(mark);
    var before = range.toString();
    range = document.createRange();
    range.setStartAfter(mark);
    range.setEnd(pre, pre.childNodes.length);
    var after = range.toString();
    before = before.slice(before.lastIndexOf("\n") + 1).replace(/^\s*[-•*]\s*/, "");
    after = after.split("\n")[0];
    if (before.length > 34) before = "…" + before.slice(-33).replace(/^\S*\s/, "");
    if (after.length > 34) after = after.slice(0, 33).replace(/\s\S*$/, "") + "…";
    return (before + "___" + after).trim();
  }

  /** Copy text to the clipboard; resolves true on success. */
  function copyText(text, fallbackNode) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(
        function () {
          return true;
        },
        function () {
          return legacyCopy(fallbackNode);
        }
      );
    }
    return Promise.resolve(legacyCopy(fallbackNode));
  }

  /** Select a node's text and use execCommand("copy"); leaves it selected if that fails. */
  function legacyCopy(node) {
    var range = document.createRange();
    range.selectNodeContents(node);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    var ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (e) {
      ok = false;
    }
    if (ok) sel.removeAllRanges();
    return ok;
  }

  /* One entry per distinct blank on the page: its saved value, where it shows, and its inputs. */
  var blanks = {};
  var promptCounters = [];

  /** Show a blank's value (or its [BRACKETS]) everywhere it appears, and sync its inputs. */
  function paintBlank(blank, except) {
    blank.marks.forEach(function (mark) {
      var value = blank.value;
      // In "$[AMOUNT]" the $ is already in the text, so a typed "$300" mustn't double it.
      if (value && mark.hasAttribute("data-money")) value = value.replace(/^\s*\$\s*/, "");
      mark.textContent = value || mark.getAttribute("data-blank");
      mark.classList.toggle("is-filled", !!value);
    });
    blank.inputs.forEach(function (input) {
      if (input !== except && input.value !== blank.value) input.value = blank.value;
    });
  }

  /** Save one blank's value under its scope ("*" or a lesson id). */
  function saveBlank(blank) {
    var fills = loadFills();
    var scope = isPlainObject(fills[blank.scope]) ? fills[blank.scope] : {};
    if (blank.value) scope[blank.name] = blank.value;
    else delete scope[blank.name];
    if (Object.keys(scope).length) fills[blank.scope] = scope;
    else delete fills[blank.scope];
    return writeStore(FILLS_KEY, fills);
  }

  /** Re-read saved fill-ins (e.g. after another tab changed them) and repaint. */
  function reloadBlanks() {
    var fills = loadFills();
    Object.keys(blanks).forEach(function (id) {
      var blank = blanks[id];
      var scope = isPlainObject(fills[blank.scope]) ? fills[blank.scope] : {};
      var value = typeof scope[blank.name] === "string" ? scope[blank.name] : "";
      // Keep only typing that hasn't been saved yet; otherwise the other tab's value wins.
      if (value === blank.value || has(pendingBlanks, id)) return;
      blank.value = value;
      paintBlank(blank);
    });
    promptCounters.forEach(function (update) {
      update();
    });
  }

  /** Turn every prompt into a small form: highlighted blanks, a Fill in panel, and Copy. */
  function enhancePrompts() {
    var promptBlocks = document.querySelectorAll(".prompt-block");
    var announcer = el("p", { class: "visually-hidden", role: "status" });
    if (promptBlocks.length) document.body.appendChild(announcer);
    var manualHint = /Mac|iPhone|iPad/.test(navigator.platform || "") ? "Press ⌘C" : "Press Ctrl+C";
    var lessonId = document.body.getAttribute("data-lesson") || "page";
    var fills = loadFills();

    promptBlocks.forEach(function (block, p) {
      var pre = block.querySelector("pre");
      var head = block.querySelector(".prompt-head");
      if (!pre || !head) return;
      var name = head.firstElementChild ? head.firstElementChild.textContent.trim() : "prompt";
      markFillIns(pre);

      // Work out which blank each mark belongs to, before any values are painted.
      var marks = Array.prototype.slice.call(pre.querySelectorAll("mark.fill"));
      var inThisPrompt = [];
      var inputFor = {};
      var genericCount = 0;
      marks.forEach(function (mark) {
        var bracketed = mark.textContent;
        var raw = bracketed.slice(1, -1).trim();
        var annotated = mark.hasAttribute("data-blank-key") || mark.hasAttribute("data-blank-label");
        var generic = !annotated && (raw.length <= 2 || raw === "PASTE");
        // "[SPECIFIC OBSERVATION, e.g. …]" and "[SPECIFIC OBSERVATION]" are the same blank.
        var key = mark.getAttribute("data-blank-key") || raw.split(/, (?=e\.g\.)| — /)[0].trim().toUpperCase();
        if (has(BLANK_ALIASES, key)) key = BLANK_ALIASES[key];
        var wide = !generic && has(COURSE_WIDE_BLANKS, key) ? COURSE_WIDE_BLANKS[key] : null;
        var scope = wide ? "*" : lessonId;
        var blankName = generic ? raw + "#" + (p + 1) + "." + ++genericCount : key;
        var id = scope + "|" + blankName;
        var before = mark.previousSibling;
        if (before && before.nodeType === 3 && /\$$/.test(before.nodeValue)) mark.setAttribute("data-money", "");
        mark.setAttribute("data-blank", bracketed);
        if (!has(blanks, id)) {
          var saved = isPlainObject(fills[scope]) ? fills[scope][blankName] : "";
          var text = generic ? { label: contextLabel(mark, pre), hint: "" } : describeBlank(raw);
          blanks[id] = {
            scope: scope,
            name: blankName,
            label: wide ? wide.label : mark.getAttribute("data-blank-label") || text.label,
            hint: mark.getAttribute("data-blank-hint") || text.hint,
            note: wide ? wide.note : "",
            long: mark.hasAttribute("data-blank-long") || (!annotated && (/^(paste|describe|list|any)/i.test(raw) || raw.length > 45)),
            money: false,
            value: typeof saved === "string" ? saved : "",
            marks: [],
            inputs: [],
          };
        }
        if (mark.hasAttribute("data-money")) blanks[id].money = true;
        blanks[id].marks.push(mark);
        if (inThisPrompt.indexOf(id) === -1) inThisPrompt.push(id);
        mark.addEventListener("click", function () {
          openPanel(true);
          if (inputFor[id]) inputFor[id].focus();
        });
      });

      var actions = el("div", { class: "prompt-actions" });
      var panel = null;
      var toggle = null;
      var countLabel = null;
      var countText = null;
      var copyButton = el("button", { type: "button", class: "copy-button", "aria-label": "Copy " + name }, ["Copy"]);
      var copyAgain = null;
      var reset;

      /** Copy the prompt exactly as shown, and confirm on the button that was pressed. */
      function copyPrompt(button) {
        copyText(pre.textContent, pre).then(function (ok) {
          var left = pre.querySelectorAll("mark.fill:not(.is-filled)").length;
          button.textContent = ok ? "Copied" : manualHint;
          button.setAttribute("data-state", ok ? "copied" : "manual");
          announcer.textContent = ok
            ? "Copied " + name + "." + (left ? " " + plural(left, "blank") + " still in brackets." : "")
            : "Couldn't copy automatically. The text is selected. " + manualHint + " to copy it.";
          clearTimeout(reset);
          reset = setTimeout(function () {
            [copyButton, copyAgain].forEach(function (b) {
              if (!b) return;
              b.textContent = "Copy";
              b.removeAttribute("data-state");
            });
          }, 2200);
        });
      }
      copyButton.addEventListener("click", function () {
        copyPrompt(copyButton);
      });

      /** Show or hide this prompt's fill-in panel. */
      function openPanel(open) {
        if (!panel) return;
        panel.hidden = !open;
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      }

      if (inThisPrompt.length) {
        var panelId = "blanks-" + (p + 1);
        countLabel = el("span", { class: "fill-count", "aria-hidden": "true" });
        countText = el("span", { class: "visually-hidden" });
        toggle = el("button", { type: "button", class: "fill-toggle", "aria-expanded": "false", "aria-controls": panelId }, [
          "Fill in blanks",
          countLabel,
          countText,
        ]);
        toggle.addEventListener("click", function () {
          openPanel(panel.hidden);
        });
        actions.appendChild(toggle);

        // Short fields first, then the long ones that take a full row, so the grid packs without gaps.
        var ordered = inThisPrompt
          .filter(function (id) {
            return !blanks[id].long;
          })
          .concat(
            inThisPrompt.filter(function (id) {
              return blanks[id].long;
            })
          );
        var grid = el("div", { class: "fill-fields" });
        ordered.forEach(function (id, i) {
          var blank = blanks[id];
          var inputId = panelId + "-" + (i + 1);
          var hintId = inputId + "-hint";
          var hint = blank.hint || (blank.money ? "Just the number. The $ is already in the text." : "");
          var note = blank.note;
          var described = [hint ? hintId : null, note ? inputId + "-note" : null].filter(Boolean).join(" ") || null;
          var input = el(blank.long ? "textarea" : "input", {
            id: inputId,
            class: "fill-input",
            type: blank.long ? null : "text",
            rows: blank.long ? "2" : null,
            autocomplete: "off",
            spellcheck: blank.long ? "true" : "false",
            "aria-describedby": described,
          });
          input.value = blank.value;
          blank.inputs.push(input);
          inputFor[id] = input;
          input.addEventListener("input", function () {
            blank.value = input.value;
            paintBlank(blank, input);
            persist(blank);
            promptCounters.forEach(function (update) {
              update();
            });
          });
          grid.appendChild(
            el("div", { class: "fill-field" + (blank.long ? " is-long" : "") }, [
              el("label", { for: inputId }, [blank.label]),
              hint ? el("p", { class: "fill-hint", id: hintId }, [hint]) : null,
              input,
              note ? el("p", { class: "fill-note", id: inputId + "-note" }, [note]) : null,
            ])
          );
        });

        // Course-wide blanks (niche, client) stay: clearing one prompt shouldn't empty every lesson.
        var local = inThisPrompt.filter(function (id) {
          return blanks[id].scope !== "*";
        });
        var clearBlanks = null;
        if (local.length) {
          clearBlanks = el("button", { type: "button", class: "text-button" }, ["Clear these blanks"]);
          clearBlanks.addEventListener("click", function () {
            local.forEach(function (id) {
              blanks[id].value = "";
              paintBlank(blanks[id]);
              persist(blanks[id]);
            });
            promptCounters.forEach(function (update) {
              update();
            });
            var first = inputFor[local[0]];
            if (first) first.focus();
          });
        }

        copyAgain = el("button", { type: "button", class: "copy-button", "aria-label": "Copy " + name }, ["Copy"]);
        copyAgain.addEventListener("click", function () {
          copyPrompt(copyAgain);
        });

        panel = el("div", { class: "fill-panel", id: panelId, hidden: "hidden" }, [
          el("p", { class: "fill-intro" }, ["What you type here appears in the prompt above, and Copy includes it."]),
          grid,
          el("div", { class: "fill-foot" }, [copyAgain, clearBlanks]),
        ]);
        pre.insertAdjacentElement("afterend", panel);

        promptCounters.push(function () {
          var filled = inThisPrompt.filter(function (id) {
            return !!blanks[id].value;
          }).length;
          countLabel.textContent = filled + "/" + inThisPrompt.length;
          countText.textContent = ", " + filled + " of " + inThisPrompt.length + " filled";
        });
      }

      actions.appendChild(copyButton);
      head.appendChild(actions);
    });

    Object.keys(blanks).forEach(function (id) {
      paintBlank(blanks[id]);
    });
    promptCounters.forEach(function (update) {
      update();
    });
    document.querySelectorAll(".callout").forEach(markFillIns);
  }

  /* Saving on every keystroke is fine for localStorage, but group writes a little. */
  var pendingBlanks = {};
  var flushBlanks = debounce(function () {
    Object.keys(pendingBlanks).forEach(function (id) {
      saveBlank(pendingBlanks[id]);
    });
    pendingBlanks = {};
  }, 250);

  /** Queue a blank to be saved. */
  function persist(blank) {
    pendingBlanks[blank.scope + "|" + blank.name] = blank;
    flushBlanks();
  }

  /* The lesson's notes box, once it exists, and how to save it immediately. */
  var noteBox = null;
  var saveNoteNow = function () {};

  /** Save anything typed but not yet written: fill-ins and the lesson note. */
  function flushAll() {
    Object.keys(pendingBlanks).forEach(function (id) {
      saveBlank(pendingBlanks[id]);
    });
    pendingBlanks = {};
    saveNoteNow();
  }

  // Leaving (Next, Back, closing the tab, switching apps on a phone) mustn't lose the last keystrokes.
  window.addEventListener("pagehide", flushAll);
  document.addEventListener("visibilitychange", function () {
    if (document.visibilityState === "hidden") flushAll();
  });

  /* ---- Course map (index.html) --------------------------------------------- */

  /** Render ticks, counts, the tally, the route, notes and the continue buttons on the course map. */
  function renderIndex() {
    var done = loadDone();
    var next = nextUp(done);

    document.querySelectorAll(".lesson-list li[data-lesson]").forEach(function (li) {
      var id = li.getAttribute("data-lesson");
      var isDone = done.has(id);
      var open = !byId[id] || isOpen(byId[id], done);
      li.classList.toggle("is-done", isDone);
      li.classList.toggle("is-next", !!next && next.id === id);
      li.classList.toggle("is-locked", !open);
      var link = li.querySelector("a");
      setLinkOpen(link, open);
      var state = li.querySelector(".lesson-state");
      if (!state) {
        state = el("span", { class: "lesson-state" });
        link.appendChild(state);
      }
      state.textContent = "";
      if (isDone) {
        state.appendChild(tick());
        state.appendChild(el("span", { class: "visually-hidden" }, ["(done)"]));
      } else if (!open) {
        state.appendChild(lock());
        state.appendChild(el("span", { class: "visually-hidden" }, ["(locked)"]));
      }
    });

    COURSE.forEach(function (mod) {
      var count = document.querySelector('[data-module-count="' + mod.n + '"]');
      if (!count) return;
      var n = doneInModule(mod, done);
      count.textContent = n === 0 ? plural(mod.lessons.length, "lesson") : n + " of " + mod.lessons.length + " done";
    });

    var message;
    if (!storageOk) message = "This browser isn't saving progress, so ticks won't stick.";
    else if (done.size === 0) message = lessons.length + " lessons in " + COURSE.length + " modules. Nothing ticked off yet.";
    else if (!next) message = "All " + lessons.length + " lessons done. From here the course loops: Module 5 outreach, then the Module 7 sprint.";
    else message = done.size + " of " + lessons.length + " lessons done.";
    document.querySelectorAll("[data-progress-text]").forEach(function (text) {
      text.textContent = message;
    });

    var loop = byId[LOOP_START] || lessons[0];
    document.querySelectorAll("[data-continue]").forEach(function (cont) {
      if (done.size === 0) {
        cont.href = lessonUrl(lessons[0]);
        cont.textContent = "Start with Day 1";
      } else if (!next) {
        cont.href = lessonUrl(loop);
        cont.textContent = "Go round again from " + loop.id + " " + loop.title;
      } else {
        cont.href = lessonUrl(next);
        cont.textContent = "Continue with " + next.id + " " + next.title;
      }
    });

    // The route: a step is done when all its modules are; the first step not done is where you are.
    var foundCurrent = false;
    document.querySelectorAll(".route-step[data-modules]").forEach(function (step) {
      var nums = step.getAttribute("data-modules").split(" ").filter(Boolean);
      var complete =
        nums.length > 0 &&
        nums.every(function (n) {
          var mod = COURSE[Number(n)];
          return mod && doneInModule(mod, done) === mod.lessons.length;
        });
      step.classList.toggle("is-done", complete);
      step.classList.toggle("is-current", !complete && !foundCurrent);
      if (!complete) foundCurrent = true;
    });

    document.querySelectorAll(".tally-mark[data-lesson]").forEach(function (mark) {
      var id = mark.getAttribute("data-lesson");
      mark.classList.toggle("is-done", done.has(id));
      mark.classList.toggle("is-next", !!next && next.id === id);
    });

    renderNotesList();

    var clear = document.querySelector("[data-clear-progress]");
    if (clear) {
      clear.hidden = !hasAnythingSaved();
      clear.textContent = "Clear everything";
      delete clear.dataset.armed;
    }
  }

  /** Notes in course order: [{ lesson, text }]. */
  function notesInOrder() {
    var notes = loadNotes();
    return lessons
      .filter(function (l) {
        return typeof notes[l.id] === "string" && notes[l.id].trim();
      })
      .map(function (l) {
        return { lesson: l, text: notes[l.id].trim() };
      });
  }

  /** True when this browser holds any ticks, notes or fill-ins. */
  function hasAnythingSaved() {
    return loadDone().size > 0 || notesInOrder().length > 0 || Object.keys(loadFills()).length > 0;
  }

  /** Show "Your notes" on the course map when there are any. */
  function renderNotesList() {
    var section = document.querySelector("[data-notes]");
    var list = document.querySelector("[data-notes-list]");
    if (!section || !list) return;
    var entries = notesInOrder();
    list.textContent = "";
    entries.forEach(function (entry) {
      list.appendChild(
        el("li", {}, [
          el("a", { href: lessonUrl(entry.lesson) }, [
            el("span", { class: "lesson-id" }, [entry.lesson.id]),
            el("span", { class: "lesson-title" }, [entry.lesson.title]),
          ]),
          linkify(el("p", { class: "note-text" }), entry.text),
        ])
      );
    });
    section.hidden = entries.length === 0;
  }

  /** Fill `node` with `text`, turning web addresses into links (as text nodes, never HTML). */
  function linkify(node, text) {
    var pattern = /https?:\/\/[^\s<>"']+/g;
    var last = 0;
    var match;
    while ((match = pattern.exec(text))) {
      var url = match[0].replace(/[.,;:!?)\]]+$/, "");
      node.appendChild(document.createTextNode(text.slice(last, match.index)));
      node.appendChild(el("a", { href: url, rel: "noopener", target: "_blank" }, [url]));
      last = match.index + url.length;
      pattern.lastIndex = last;
    }
    node.appendChild(document.createTextNode(text.slice(last)));
    return node;
  }

  /** Download notes, plus the details used across the course, as a plain-text file. */
  function downloadNotes() {
    var entries = notesInOrder();
    var wide = loadFills()["*"];
    var lines = ["Free AI Business Course: your notes", ""];
    if (isPlainObject(wide)) {
      var details = Object.keys(COURSE_WIDE_BLANKS)
        .filter(function (key) {
          return typeof wide[key] === "string" && wide[key].trim();
        })
        .map(function (key) {
          return COURSE_WIDE_BLANKS[key].label + ": " + wide[key].trim();
        });
      if (details.length) lines.push.apply(lines, details.concat([""]));
    }
    entries.forEach(function (entry) {
      lines.push(entry.lesson.id + " " + entry.lesson.title, entry.text, "");
    });
    var blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var link = el("a", { href: url, download: "free-ai-business-course-notes.txt" });
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  /** Wire the course map's buttons: two-step "Clear everything" and "Download your notes". */
  function wireIndexButtons() {
    var download = document.querySelector("[data-download-notes]");
    if (download) download.addEventListener("click", downloadNotes);

    var clear = document.querySelector("[data-clear-progress]");
    if (!clear) return;
    var armedAt = 0;
    clear.addEventListener("click", function () {
      if (clear.dataset.armed) {
        // A double-click is one intention, not a confirmation.
        if (Date.now() - armedAt < 500) return;
        saveDone(new Set());
        writeStore(NOTES_KEY, {});
        writeStore(FILLS_KEY, {});
        renderIndex();
        var cont = document.querySelector("[data-continue]");
        if (cont) cont.focus();
        return;
      }
      clear.dataset.armed = "1";
      armedAt = Date.now();
      clear.textContent = "Press again to clear all ticks, notes and fill-ins";
    });
    clear.addEventListener("blur", function () {
      if (!clear.dataset.armed) return;
      delete clear.dataset.armed;
      clear.textContent = "Clear everything";
    });
  }

  /* ---- Lesson pages -------------------------------------------------------- */

  /** The current module's lessons as a list, with ticks and the current lesson marked. */
  function moduleLessonList(current, done) {
    var list = el("ol", { class: "rail-lessons" });
    current.module.lessons.forEach(function (l) {
      var lesson = byId[l[0]];
      var open = l[0] === current.id || isOpen(lesson, done);
      var state = el("span", { class: "rail-state" });
      if (done.has(l[0])) {
        state.appendChild(tick());
        state.appendChild(el("span", { class: "visually-hidden" }, ["(done)"]));
      } else if (!open) {
        state.appendChild(lock());
        state.appendChild(el("span", { class: "visually-hidden" }, ["(locked)"]));
      }
      var link = el("a", { href: open ? lessonUrl(lesson) : null, class: open ? null : "is-locked", "aria-current": l[0] === current.id ? "page" : null }, [
        el("span", { class: "rail-id" }, [l[0]]),
        el("span", { class: "rail-text" }, [el("span", {}, [l[1]])]),
        state,
      ]);
      list.appendChild(el("li", {}, [link]));
    });
    return list;
  }

  /** Build the left rail: this module's lessons, then the other modules. */
  function renderRail(current, done) {
    var rail = document.querySelector("[data-rail]");
    if (!rail) return;
    var mod = current.module;
    rail.textContent = "";

    rail.appendChild(el("p", { class: "rail-module" }, ["Module " + mod.n]));
    rail.appendChild(el("p", { class: "rail-title" }, [mod.title]));
    rail.appendChild(el("p", { class: "rail-count" }, [doneInModule(mod, done) + " of " + mod.lessons.length + " done"]));
    rail.appendChild(moduleLessonList(current, done));

    rail.appendChild(el("p", { class: "rail-others-title" }, ["The rest of the course"]));
    var others = el("ol", { class: "rail-others" });
    COURSE.forEach(function (m) {
      if (m === mod) return;
      var first = byId[m.lessons[0][0]];
      var n = doneInModule(m, done);
      var open = isOpen(first, done);
      others.appendChild(
        el("li", {}, [
          el("a", { href: open ? lessonUrl(first) : null, class: open ? null : "is-locked" }, [
            el("span", { class: "rail-id" }, [String(m.n)]),
            el("span", { class: "rail-text" }, [m.title, open ? null : el("span", { class: "visually-hidden" }, [" (locked)"])]),
            el("span", { class: "rail-state" }, [open ? n + "/" + m.lessons.length : lock()]),
          ]),
        ])
      );
    });
    rail.appendChild(others);
  }

  /** On small screens, where there's no rail, list the module's lessons after the lesson. */
  function renderOutline(current, done) {
    var main = document.querySelector(".lesson");
    if (!main) return;
    var outline = main.querySelector(".module-outline");
    var wasOpen = outline ? outline.open : false;
    if (!outline) {
      outline = el("details", { class: "module-outline" });
      main.appendChild(outline);
    }
    var mod = current.module;
    outline.textContent = "";
    outline.appendChild(
      el("summary", {}, [
        el("span", { class: "outline-title" }, ["Module " + mod.n + ": " + mod.title]),
        el("span", { class: "outline-count" }, [doneInModule(mod, done) + " of " + mod.lessons.length + " done"]),
      ])
    );
    outline.appendChild(moduleLessonList(current, done));
    outline.open = wasOpen;
  }

  /** Notes box and "Mark this lesson as done", under the lesson's deliverable. */
  function renderDoneToggle(current) {
    var body = document.querySelector(".lesson-body");
    if (!body) return;
    var deliverables = body.querySelectorAll(".deliverable");
    var host = deliverables.length ? deliverables[deliverables.length - 1] : body;

    // Notes: where the learner's answer, link or number for this lesson lives.
    var notesStatus = el("p", { class: "notes-status" });
    var textarea = el("textarea", {
      id: "lesson-notes",
      class: "notes-input",
      rows: "3",
      "aria-describedby": "lesson-notes-hint",
    });
    var saved = loadNotes()[current.id];
    textarea.value = typeof saved === "string" ? saved : "";
    noteBox = { textarea: textarea, lessonId: current.id, dirty: false };
    /** Write this lesson's note now (typing marks it dirty; a save clears that). */
    saveNoteNow = function () {
      if (!noteBox.dirty) return;
      var notes = loadNotes();
      if (textarea.value.trim()) notes[current.id] = textarea.value;
      else delete notes[current.id];
      var ok = writeStore(NOTES_KEY, notes);
      noteBox.dirty = false;
      notesStatus.textContent = ok ? "Saved in this browser." : "This browser isn't saving, so copy your notes somewhere safe.";
    };
    var saveSoon = debounce(saveNoteNow, 400);
    textarea.addEventListener("input", function () {
      noteBox.dirty = true;
      notesStatus.textContent = "";
      saveSoon();
    });
    var notesBlock = el("div", { class: "lesson-notes" }, [
      el("label", { for: "lesson-notes", class: "notes-label" }, ["Your notes"]),
      el("p", { class: "notes-hint", id: "lesson-notes-hint" }, [
        "Paste your link, numbers or answer. It's saved as you type, and every note is listed on the course map.",
      ]),
      textarea,
      notesStatus,
    ]);

    var input = el("input", { type: "checkbox", id: "lesson-done" });
    var status = el("p", { class: "done-status", role: "status" });
    var label = el("label", { class: "done-toggle", for: "lesson-done" }, [
      el("span", { class: "done-box" }, [input, tick()]),
      el("span", {}, ["Mark this lesson as done"]),
    ]);
    input.checked = loadDone().has(current.id);

    input.addEventListener("change", function () {
      var done = loadDone();
      if (input.checked) done.add(current.id);
      else done.delete(current.id);
      var ok = saveDone(done);
      var mod = current.module;
      if (!ok) {
        status.textContent = "This browser isn't saving progress, so the tick won't stick.";
      } else if (input.checked) {
        var n = doneInModule(mod, done);
        if (done.size === lessons.length) status.textContent = "Done. That's all " + lessons.length + " lessons.";
        else if (n === mod.lessons.length) status.textContent = "Done. That's all of Module " + mod.n + ".";
        else status.textContent = "Done. " + n + " of " + mod.lessons.length + " in Module " + mod.n + ".";
      } else {
        status.textContent = "Tick removed.";
      }
      renderRail(current, done);
      renderOutline(current, done);
      updateNextLink(current, done);
    });

    host.appendChild(notesBlock);
    host.appendChild(el("div", { class: "done-row" }, [label, status]));
  }

  var doneToggleBuilt = false;

  /** Show the lesson on screen, or keep it locked: a locked lesson shows its title and the way to where
      the learner is up to, not its content, notes or done box. */
  function applyLock(current, done) {
    var open = isOpen(current, done);
    document.body.classList.toggle("is-locked", !open);
    var panel = document.querySelector(".lesson-locked");
    if (open) {
      if (panel) panel.parentNode.removeChild(panel);
      if (!doneToggleBuilt) {
        renderDoneToggle(current);
        doneToggleBuilt = true;
      }
    } else {
      var up = nextUp(done);
      if (!panel) {
        var header = document.querySelector(".lesson-header");
        if (!header) return;
        panel = el("section", { class: "lesson-locked", "aria-labelledby": "locked-title" });
        header.parentNode.insertBefore(panel, header.nextSibling);
      }
      panel.textContent = "";
      panel.appendChild(el("h2", { class: "locked-title", id: "locked-title" }, [lock(), el("span", {}, ["This lesson isn't open yet"])]));
      panel.appendChild(
        el("p", {}, ["Lessons open in order: each one opens when the one before it is marked as done. You're up to " + up.id + " " + up.title + "."])
      );
      panel.appendChild(el("p", { class: "locked-action" }, [el("a", { class: "button", href: lessonUrl(up) }, ["Go to " + up.id])]));
    }
    updateNextLink(current, done);
  }

  /** The lesson's Next link opens once this lesson is ticked (which is what opens the next one). */
  function updateNextLink(current, done) {
    var next = document.querySelector(".lesson-nav a.next");
    if (!next) return;
    var target = lessons[lessons.indexOf(current) + 1];
    var open = !target || isOpen(target, done);
    setLinkOpen(next, open);
    var note = next.querySelector(".nav-locked");
    if (open) {
      if (note) note.parentNode.removeChild(note);
    } else if (!note) {
      next.appendChild(el("span", { class: "nav-locked" }, [lock(), el("span", {}, ["Opens when this lesson is marked as done"])]));
    }
  }

  /** Set up a lesson page: rail, then the lesson (or its lock), then the outline. */
  function renderLesson() {
    var current = byId[document.body.getAttribute("data-lesson")];
    if (!current) return;
    var done = loadDone();
    renderRail(current, done);
    applyLock(current, done);
    renderOutline(current, done);
  }

  /* ---- Start ---------------------------------------------------------------- */

  enhancePrompts();
  if (document.body.classList.contains("course-index")) {
    renderIndex();
    wireIndexButtons();
  } else if (document.body.classList.contains("lesson-page")) {
    renderLesson();
  }

  /** Bring the page up to date with what's saved: `key` is what changed, or null for everything. */
  function refresh(key) {
    if (key === null || key === FILLS_KEY) reloadBlanks();
    if (document.body.classList.contains("course-index")) {
      renderIndex();
      return;
    }
    var current = byId[document.body.getAttribute("data-lesson")];
    if (!current) return;
    if (key === null || key === DONE_KEY) {
      var done = loadDone();
      applyLock(current, done);
      var input = document.getElementById("lesson-done");
      var status = document.querySelector(".done-status");
      if (input) input.checked = done.has(current.id);
      if (status) status.textContent = "";
      renderRail(current, done);
      renderOutline(current, done);
    }
    // Unsaved typing in this tab wins; otherwise show what was saved elsewhere.
    if ((key === null || key === NOTES_KEY) && noteBox && !noteBox.dirty) {
      var note = loadNotes()[current.id];
      noteBox.textarea.value = typeof note === "string" ? note : "";
    }
  }

  /* Another tab changed what's saved. */
  window.addEventListener("storage", function (event) {
    if (event.key !== null && [DONE_KEY, NOTES_KEY, FILLS_KEY].indexOf(event.key) === -1) return;
    refresh(event.key);
  });

  /* Back/Forward restored this page from memory, as it was before. */
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) refresh(null);
  });
})();
