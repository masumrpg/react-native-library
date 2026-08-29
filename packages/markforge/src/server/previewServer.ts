import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { parseMarkdown } from "../core/parser.js";
import { buildHtmlDocument } from "../core/html/htmlBuilder.js";
import { buildDocxDocument } from "../core/docx/docxBuilder.js";
import { buildPdfDocument } from "../core/pdf/pdfBuilder.js";
import { loadConfig } from "../config/loadConfig.js";
import type { MarkforgeConfig } from "../config/types.js";

export interface PreviewServerOptions {
  filePath: string;
  port?: number;
  open?: boolean;
  config?: MarkforgeConfig;
}

export interface PreviewServerInstance {
  server: http.Server;
  port: number;
  url: string;
  close: () => Promise<void>;
}

/**
 * Launches an interactive dual-pane Markdown Editor & Live-Reload Preview Server.
 * Left Pane: Code Editor with line numbers, shortcut triggers, auto-save, and formatting toolbar.
 * Right Pane: Real-time rendered document preview iframe with scroll preservation.
 */
export async function startPreviewServer(
  options: PreviewServerOptions
): Promise<PreviewServerInstance> {
  const absoluteFilePath = path.resolve(process.cwd(), options.filePath);
  if (!fs.existsSync(absoluteFilePath)) {
    throw new Error(`MarkForge preview error: File not found at "${absoluteFilePath}"`);
  }

  const baseDir = path.dirname(absoluteFilePath);
  const { config: fileConfig } = await loadConfig(undefined, baseDir);
  const baseConfig = options.config || fileConfig;
  const port = options.port || 3000;

  // SSE client connections
  const sseClients = new Set<http.ServerResponse>();

  // Function to broadcast reload event
  const broadcastReload = () => {
    sseClients.forEach((client) => {
      try {
        client.write(`event: reload\ndata: ${Date.now()}\n\n`);
      } catch {
        sseClients.delete(client);
      }
    });
  };

  // Watch markdown file and referenced config
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  const watcher = fs.watch(baseDir, { recursive: false }, (_event, filename) => {
    if (!filename) return;
    const changedPath = path.resolve(baseDir, filename);
    if (
      changedPath === absoluteFilePath ||
      filename.includes("markforge") ||
      filename.endsWith(".css")
    ) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        broadcastReload();
      }, 150);
    }
  });

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url || "/", `http://localhost:${port}`);

    // 1. SSE Endpoint
    if (url.pathname === "/events") {
      res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      });
      res.write(`data: connected\n\n`);
      sseClients.add(res);

      req.on("close", () => {
        sseClients.delete(res);
      });
      return;
    }

    // 2. API: Get Raw Markdown File Content
    if (url.pathname === "/api/file-content" && req.method === "GET") {
      try {
        const content = fs.readFileSync(absoluteFilePath, "utf-8");
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            content,
            fileName: path.basename(absoluteFilePath),
            filePath: absoluteFilePath,
          })
        );
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: msg }));
      }
      return;
    }

    // 3. API: Save Markdown Content to Disk
    if (url.pathname === "/api/save-content" && req.method === "POST") {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });
      req.on("end", () => {
        try {
          const parsed = JSON.parse(body) as { content?: string };
          if (typeof parsed.content === "string") {
            fs.writeFileSync(absoluteFilePath, parsed.content, "utf-8");
            broadcastReload();
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: true, savedAt: Date.now() }));
          } else {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Missing content field in request body" }));
          }
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: msg }));
        }
      });
      return;
    }

    // 4. API: Quick Export Document (DOCX / PDF)
    if (url.pathname === "/api/export" && (req.method === "GET" || req.method === "POST")) {
      const format = url.searchParams.get("format") || "docx";
      try {
        const mdContent = fs.readFileSync(absoluteFilePath, "utf-8");
        const doc = parseMarkdown(mdContent);
        const { config: resolvedConfig } = await loadConfig(undefined, baseDir);
        const mergedConfig = { ...baseConfig, ...resolvedConfig };
        const fileBase = path.basename(absoluteFilePath, path.extname(absoluteFilePath));

        if (format === "docx") {
          const buffer = await buildDocxDocument(doc, mergedConfig, baseDir);
          res.writeHead(200, {
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "Content-Disposition": `attachment; filename="${fileBase}.docx"`,
          });
          res.end(buffer);
          return;
        } else if (format === "pdf") {
          const buffer = await buildPdfDocument(doc, mergedConfig, baseDir);
          res.writeHead(200, {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${fileBase}.pdf"`,
          });
          res.end(buffer);
          return;
        } else {
          const html = await buildHtmlDocument(doc, mergedConfig, baseDir);
          res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8",
            "Content-Disposition": `attachment; filename="${fileBase}.html"`,
          });
          res.end(html);
          return;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Export failed: ${msg}`);
        return;
      }
    }

    // 5. Rendered Document HTML Frame Endpoint
    if (url.pathname === "/document-content") {
      try {
        const mdContent = fs.readFileSync(absoluteFilePath, "utf-8");
        const doc = parseMarkdown(mdContent);
        const { config: resolvedConfig } = await loadConfig(undefined, baseDir);
        const html = await buildHtmlDocument(doc, { ...baseConfig, ...resolvedConfig }, baseDir);

        // Inject scroll-preservation and auto-reload script inside document frame
        const injectedScript = `
        <script>
        (function() {
          var evtSource = new EventSource('/events');
          evtSource.addEventListener('reload', function() {
            var scrollPos = window.scrollY;
            sessionStorage.setItem('markforge_scroll', scrollPos);
            window.location.reload();
          });
          window.addEventListener('load', function() {
            var saved = sessionStorage.getItem('markforge_scroll');
            if (saved) {
              window.scrollTo(0, parseInt(saved, 10));
            }
          });
        })();
        </script>
        `;
        const finalHtml = html.replace("</body>", `${injectedScript}</body>`);

        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(finalHtml);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        res.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
        res.end(`<div style="padding:2rem;font-family:sans-serif;color:#ef4444;background:#fef2f2;border:1px solid #f87171;border-radius:8px;"><h3>MarkForge Compilation Error</h3><pre>${escapeHtml(msg)}</pre></div>`);
      }
      return;
    }

    // 6. Main Web Workbench Studio UI (Dual-Pane Editor + Live Preview)
    if (url.pathname === "/" || url.pathname === "/index.html") {
      const fileName = path.basename(absoluteFilePath);
      const initialContent = fs.readFileSync(absoluteFilePath, "utf-8");

      const appHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MarkForge Live Studio - ${escapeHtml(fileName)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root {
      --mf-primary: #0D998D;
      --mf-primary-dark: #008277;
      --mf-primary-light: #ECFDFD;
      --mf-primary-border: #33CDCF;
      --mf-dark: #0F172A;
      --mf-slate: #1E293B;
      --mf-editor-bg: #0F172A;
      --mf-editor-gutter: #1E293B;
      --mf-editor-text: #F8FAFC;
      --mf-muted: #64748B;
      --mf-light-border: #E2E8F0;
      --mf-bg: #F1F5F9;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--mf-bg);
      color: var(--mf-dark);
      display: flex;
      flex-direction: column;
      height: 100vh;
      overflow: hidden;
    }
    header {
      background: #FFFFFF;
      border-bottom: 1px solid var(--mf-light-border);
      min-height: 56px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      padding: 0.4rem 1.2rem;
      z-index: 10;
      box-shadow: 0 1px 3px rgba(15, 23, 42, 0.04);
      gap: 0.75rem;
    }
    .brand-section {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .brand-badge {
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      background: var(--mf-dark);
      color: #FFFFFF;
      padding: 0.25rem 0.55rem;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .file-name {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--mf-dark);
    }
    .sync-status {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--mf-primary-dark);
      background: var(--mf-primary-light);
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      border: 1px solid var(--mf-primary-border);
    }
    .sync-dot {
      width: 7px;
      height: 7px;
      background-color: var(--mf-primary);
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(13, 153, 141, 0.2);
    }
    .toolbar-section {
      display: flex;
      align-items: center;
      gap: 0.3rem;
      background: #F8FAFC;
      padding: 0.25rem 0.4rem;
      border-radius: 6px;
      border: 1px solid var(--mf-light-border);
    }
    .tool-btn {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 0.25rem 0.45rem;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 4px;
      cursor: pointer;
      color: var(--mf-slate);
      transition: all 0.1s ease;
    }
    .tool-btn:hover {
      background: #FFFFFF;
      border-color: var(--mf-light-border);
      color: var(--mf-primary-dark);
    }
    .tool-divider {
      width: 1px;
      height: 16px;
      background: var(--mf-light-border);
      margin: 0 0.15rem;
    }
    .controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .view-toggles {
      display: flex;
      background: #F1F5F9;
      padding: 2px;
      border-radius: 6px;
      border: 1px solid var(--mf-light-border);
    }
    .toggle-btn {
      font-family: inherit;
      font-size: 0.74rem;
      font-weight: 600;
      padding: 0.25rem 0.55rem;
      border: none;
      background: transparent;
      border-radius: 4px;
      cursor: pointer;
      color: var(--mf-muted);
      transition: all 0.15s ease;
    }
    .toggle-btn.active {
      background: #FFFFFF;
      color: var(--mf-dark);
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.08);
    }
    .btn {
      font-family: inherit;
      font-size: 0.78rem;
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      border: 1px solid var(--mf-light-border);
      background: #FFFFFF;
      color: var(--mf-dark);
    }
    .btn:hover {
      background: #F8FAFC;
      border-color: #CBD5E1;
    }
    .btn-primary {
      background: var(--mf-primary);
      color: #FFFFFF;
      border-color: var(--mf-primary);
    }
    .btn-primary:hover {
      background: var(--mf-primary-dark);
      border-color: var(--mf-primary-dark);
    }
    .save-indicator {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--mf-muted);
      min-width: 65px;
      text-align: right;
    }
    .save-indicator.saved {
      color: var(--mf-primary-dark);
    }
    .save-indicator.saving {
      color: #D97706;
    }
    .save-indicator.unsaved {
      color: #E11D48;
    }

    /* Main Workspace Splitter Layout */
    main.workspace {
      flex: 1;
      display: flex;
      height: calc(100vh - 56px);
      overflow: hidden;
      background: var(--mf-bg);
      position: relative;
    }
    .editor-pane {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: var(--mf-editor-bg);
      border-right: 1px solid #334155;
      overflow: hidden;
    }
    .editor-header {
      background: #090D16;
      border-bottom: 1px solid #1E293B;
      padding: 0.4rem 0.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #94A3B8;
      font-size: 0.74rem;
      font-weight: 500;
    }
    .editor-container {
      flex: 1;
      display: flex;
      position: relative;
      overflow: hidden;
      background: var(--mf-editor-bg);
    }
    .line-numbers {
      width: 44px;
      padding: 0.8rem 0.4rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      line-height: 1.55;
      color: #475569;
      text-align: right;
      user-select: none;
      background: var(--mf-editor-gutter);
      overflow: hidden;
      border-right: 1px solid #1E293B;
    }
    .code-editor {
      flex: 1;
      padding: 0.8rem 1rem;
      font-family: 'JetBrains Mono', monospace;
      font-size: 13px;
      line-height: 1.55;
      color: var(--mf-editor-text);
      background: transparent;
      border: none;
      outline: none;
      resize: none;
      white-space: pre;
      overflow-wrap: normal;
      overflow: auto;
      tab-size: 2;
    }

    /* Draggable Splitter Handle */
    .splitter {
      width: 8px;
      cursor: col-resize;
      background: #E2E8F0;
      transition: background 0.15s ease;
      position: relative;
      z-index: 5;
    }
    .splitter:hover, .splitter.active {
      background: var(--mf-primary);
    }

    /* Right Preview Pane */
    .preview-pane {
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      background: #FFFFFF;
      overflow: hidden;
    }
    .preview-header {
      background: #FFFFFF;
      border-bottom: 1px solid var(--mf-light-border);
      padding: 0.35rem 0.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--mf-muted);
      font-size: 0.74rem;
      font-weight: 600;
    }
    .viewport-selector {
      display: flex;
      gap: 0.25rem;
    }
    .vp-btn {
      font-size: 0.72rem;
      padding: 0.15rem 0.4rem;
      border: 1px solid var(--mf-light-border);
      background: #F8FAFC;
      border-radius: 4px;
      cursor: pointer;
      color: var(--mf-muted);
    }
    .vp-btn.active {
      background: var(--mf-primary-light);
      color: var(--mf-primary-dark);
      border-color: var(--mf-primary-border);
    }
    .preview-wrapper {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: stretch;
      background: #F1F5F9;
      overflow: hidden;
    }
    iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: #FFFFFF;
      transition: max-width 0.2s ease;
    }
    .author-footer {
      font-size: 0.72rem;
      color: var(--mf-muted);
      padding-right: 0.5rem;
    }
    .author-footer a {
      color: var(--mf-primary-dark);
      text-decoration: none;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <header>
    <div class="brand-section">
      <span class="brand-badge">MARKFORGE STUDIO</span>
      <span class="file-name" title="${escapeHtml(absoluteFilePath)}">${escapeHtml(fileName)}</span>
      <div class="sync-status">
        <div class="sync-dot"></div>
        <span>Live Sync Active</span>
      </div>
    </div>

    <!-- Quick Formatting Toolbar -->
    <div class="toolbar-section">
      <button class="tool-btn" onclick="insertFormat('h1')" title="Heading 1">H1</button>
      <button class="tool-btn" onclick="insertFormat('h2')" title="Heading 2">H2</button>
      <button class="tool-btn" onclick="insertFormat('h3')" title="Heading 3">H3</button>
      <div class="tool-divider"></div>
      <button class="tool-btn" onclick="insertFormat('bold')" title="Bold">B</button>
      <button class="tool-btn" onclick="insertFormat('italic')" title="Italic">I</button>
      <button class="tool-btn" onclick="insertFormat('code')" title="Inline Code">&lt;&gt;</button>
      <button class="tool-btn" onclick="insertFormat('quote')" title="Blockquote">&gt;</button>
      <div class="tool-divider"></div>
      <button class="tool-btn" onclick="insertFormat('table')" title="GFM Table">Table</button>
      <button class="tool-btn" onclick="insertFormat('list')" title="List">List</button>
      <button class="tool-btn" onclick="insertFormat('task')" title="Task Checklist">Task</button>
      <div class="tool-divider"></div>
      <button class="tool-btn" onclick="insertFormat('callout')" title="Callout Box">Callout</button>
      <button class="tool-btn" onclick="insertFormat('math')" title="LaTeX Math">Math</button>
      <button class="tool-btn" onclick="insertFormat('columns')" title="Multi-Columns">Columns</button>
      <button class="tool-btn" onclick="insertFormat('footnote')" title="Footnote">Footnote</button>
      <button class="tool-btn" onclick="insertFormat('mermaid')" title="Mermaid Diagram">Mermaid</button>
    </div>

    <!-- Controls & View Mode -->
    <div class="controls">
      <div class="view-toggles">
        <button class="toggle-btn active" id="btn-split" onclick="setViewMode('split')">Split</button>
        <button class="toggle-btn" id="btn-edit" onclick="setViewMode('edit')">Editor</button>
        <button class="toggle-btn" id="btn-prev" onclick="setViewMode('prev')">Preview</button>
      </div>
      <span class="save-indicator saved" id="save-status">Saved</span>
      <button class="btn btn-primary" onclick="saveContentManual()" title="Save (Ctrl+S)">Save</button>
      <button class="btn" onclick="exportDoc('docx')" title="Download Word Document">DOCX</button>
      <button class="btn" onclick="exportDoc('pdf')" title="Download PDF Document">PDF</button>
      <button class="btn" onclick="printDoc()" title="Print / PDF dialog">Print</button>
    </div>
  </header>

  <main class="workspace" id="workspace">
    <!-- Left: Code Editor Pane -->
    <div class="editor-pane" id="editor-pane">
      <div class="editor-header">
        <span>MARKDOWN SOURCE</span>
        <span id="editor-stats">Lines: 1 | Words: 0 | UTF-8</span>
      </div>
      <div class="editor-container">
        <div class="line-numbers" id="line-numbers">1</div>
        <textarea class="code-editor" id="code-editor" spellcheck="false" placeholder="Write markdown here...">${escapeHtml(initialContent)}</textarea>
      </div>
    </div>

    <!-- Middle: Draggable Splitter Handle -->
    <div class="splitter" id="splitter"></div>

    <!-- Right: Rendered Preview Pane -->
    <div class="preview-pane" id="preview-pane">
      <div class="preview-header">
        <span>RENDERED PREVIEW</span>
        <div class="viewport-selector">
          <button class="vp-btn active" onclick="setViewport('100%')" id="vp-full">100% Full</button>
          <button class="vp-btn" onclick="setViewport('820px')" id="vp-a4">A4 (820px)</button>
          <button class="vp-btn" onclick="setViewport('440px')" id="vp-mob">Mobile</button>
        </div>
        <span class="author-footer">Created by <a href="https://github.com/masumrpg" target="_blank">Ma'sum (@masumrpg)</a></span>
      </div>
      <div class="preview-wrapper">
        <iframe id="preview-frame" src="/document-content"></iframe>
      </div>
    </div>
  </main>

  <script>
    var editor = document.getElementById('code-editor');
    var lineNumbers = document.getElementById('line-numbers');
    var stats = document.getElementById('editor-stats');
    var saveStatus = document.getElementById('save-status');
    var previewFrame = document.getElementById('preview-frame');
    var editorPane = document.getElementById('editor-pane');
    var previewPane = document.getElementById('preview-pane');
    var splitter = document.getElementById('splitter');
    var isDirty = false;
    var autoSaveTimeout = null;

    // Update Line Numbers & Stats
    function updateStatsAndLines() {
      var lines = editor.value.split('\\n');
      var lineCount = lines.length;
      var numHtml = '';
      for (var i = 1; i <= lineCount; i++) {
        numHtml += i + '<br>';
      }
      lineNumbers.innerHTML = numHtml;

      var words = editor.value.trim().length > 0 ? editor.value.trim().split(/\\s+/).length : 0;
      var chars = editor.value.length;
      stats.textContent = 'Lines: ' + lineCount + ' | Words: ' + words + ' | Chars: ' + chars + ' | UTF-8';
    }

    // Synchronize vertical scroll between Line Numbers and Textarea
    editor.addEventListener('scroll', function() {
      lineNumbers.scrollTop = editor.scrollTop;
    });

    // Handle Input & Debounced Auto-Save
    editor.addEventListener('input', function() {
      updateStatsAndLines();
      setSaveState('unsaved');
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(function() {
        saveContent();
      }, 600);
    });

    function setSaveState(state) {
      if (state === 'saved') {
        saveStatus.textContent = 'Saved';
        saveStatus.className = 'save-indicator saved';
        isDirty = false;
      } else if (state === 'saving') {
        saveStatus.textContent = 'Saving...';
        saveStatus.className = 'save-indicator saving';
      } else {
        saveStatus.textContent = 'Changes...';
        saveStatus.className = 'save-indicator unsaved';
        isDirty = true;
      }
    }

    // Save Content via API
    function saveContent(callback) {
      setSaveState('saving');
      fetch('/api/save-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editor.value }),
      })
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (data.success) {
          setSaveState('saved');
          if (callback) callback();
        } else {
          saveStatus.textContent = 'Save Error';
        }
      })
      .catch(function() {
        saveStatus.textContent = 'Save Error';
      });
    }

    function saveContentManual() {
      saveContent();
    }

    // Keyboard Shortcuts: Tab (2 spaces), Shift+Tab, Ctrl+S
    editor.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveContent();
        return;
      }

      if (e.key === 'Tab') {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
        this.selectionStart = this.selectionEnd = start + 2;
        updateStatsAndLines();
        setSaveState('unsaved');
        if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(saveContent, 600);
      }
    });

    // Formatting Snippet Injector
    function insertFormat(type) {
      var start = editor.selectionStart;
      var end = editor.selectionEnd;
      var selected = editor.value.substring(start, end);
      var replacement = '';

      switch (type) {
        case 'h1': replacement = '# ' + (selected || 'Heading 1'); break;
        case 'h2': replacement = '## ' + (selected || 'Heading 2'); break;
        case 'h3': replacement = '### ' + (selected || 'Heading 3'); break;
        case 'bold': replacement = '**' + (selected || 'bold text') + '**'; break;
        case 'italic': replacement = '*' + (selected || 'italic text') + '*'; break;
        case 'code': replacement = '\`' + (selected || 'inline code') + '\`'; break;
        case 'quote': replacement = '> ' + (selected || 'Quote text'); break;
        case 'table':
          replacement = '\\n| Column 1 | Column 2 | Column 3 |\\n| :--- | :---: | ---: |\\n| Data A | Data B | Data C |\\n| Data D | Data E | Data F |\\n';
          break;
        case 'list': replacement = '- ' + (selected || 'List item'); break;
        case 'task': replacement = '- [ ] ' + (selected || 'Task item'); break;
        case 'callout':
          replacement = '> [!NOTE]\\n> ' + (selected || 'This is an important callout note.');
          break;
        case 'math':
          replacement = '$$\\n' + (selected || '\\\\int_{-\\\\infty}^{\\\\infty} e^{-x^2} dx = \\\\sqrt{\\\\pi}') + '\\n$$';
          break;
        case 'columns':
          replacement = ':::columns 2\\n:::col\\n### Left Column\\n' + (selected || 'Content on the left.') + '\\n:::\\n:::col\\n### Right Column\\nContent on the right.\\n:::\\n:::';
          break;
        case 'footnote':
          replacement = (selected || 'Statement with footnote') + '[^1]\\n\\n[^1]: Note description text.';
          break;
        case 'mermaid':
          replacement = '\\n\`\`\`mermaid\\ngraph TD\\n    A[Start] --> B(Process)\\n    B --> C{Decision}\\n    C -->|Yes| D[Done]\\n    C -->|No| B\\n\`\`\`\\n';
          break;
      }

      editor.value = editor.value.substring(0, start) + replacement + editor.value.substring(end);
      editor.selectionStart = editor.selectionEnd = start + replacement.length;
      editor.focus();
      updateStatsAndLines();
      setSaveState('unsaved');
      if (autoSaveTimeout) clearTimeout(autoSaveTimeout);
      autoSaveTimeout = setTimeout(saveContent, 600);
    }

    // View Mode Toggle (Split / Editor Only / Preview Only)
    function setViewMode(mode) {
      document.getElementById('btn-split').classList.remove('active');
      document.getElementById('btn-edit').classList.remove('active');
      document.getElementById('btn-prev').classList.remove('active');

      if (mode === 'split') {
        document.getElementById('btn-split').classList.add('active');
        editorPane.style.display = 'flex';
        editorPane.style.width = '50%';
        previewPane.style.display = 'flex';
        previewPane.style.width = '50%';
        splitter.style.display = 'block';
      } else if (mode === 'edit') {
        document.getElementById('btn-edit').classList.add('active');
        editorPane.style.display = 'flex';
        editorPane.style.width = '100%';
        previewPane.style.display = 'none';
        splitter.style.display = 'none';
      } else if (mode === 'prev') {
        document.getElementById('btn-prev').classList.add('active');
        editorPane.style.display = 'none';
        previewPane.style.display = 'flex';
        previewPane.style.width = '100%';
        splitter.style.display = 'none';
      }
    }

    // Viewport Width Resizer
    function setViewport(width) {
      document.getElementById('vp-full').classList.remove('active');
      document.getElementById('vp-a4').classList.remove('active');
      document.getElementById('vp-mob').classList.remove('active');

      if (width === '100%') {
        document.getElementById('vp-full').classList.add('active');
        previewFrame.style.maxWidth = '100%';
      } else if (width === '820px') {
        document.getElementById('vp-a4').classList.add('active');
        previewFrame.style.maxWidth = '820px';
      } else if (width === '440px') {
        document.getElementById('vp-mob').classList.add('active');
        previewFrame.style.maxWidth = '440px';
      }
    }

    // Draggable Splitter Handle Logic
    var isDragging = false;
    splitter.addEventListener('mousedown', function(e) {
      isDragging = true;
      splitter.classList.add('active');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    });

    window.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      var totalWidth = document.getElementById('workspace').clientWidth;
      var newEditorWidth = (e.clientX / totalWidth) * 100;
      if (newEditorWidth > 15 && newEditorWidth < 85) {
        editorPane.style.width = newEditorWidth + '%';
        previewPane.style.width = (100 - newEditorWidth) + '%';
      }
    });

    window.addEventListener('mouseup', function() {
      if (isDragging) {
        isDragging = false;
        splitter.classList.remove('active');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    });

    // Document Print Action
    function printDoc() {
      previewFrame.contentWindow.print();
    }

    // Document Export Action
    function exportDoc(format) {
      saveContent(function() {
        window.location.href = '/api/export?format=' + format;
      });
    }

    // Initialize line stats
    updateStatsAndLines();
  </script>
</body>
</html>`;

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(appHtml);
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  });

  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      const url = `http://localhost:${port}`;
      resolve({
        server,
        port,
        url,
        close: async () => {
          watcher.close();
          sseClients.forEach((client) => {
            try {
              client.end();
            } catch {
              // ignore
            }
          });
          sseClients.clear();
          return new Promise<void>((res) => {
            server.close(() => res());
          });
        },
      });
    });

    server.on("error", (err) => {
      reject(err);
    });
  });
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
