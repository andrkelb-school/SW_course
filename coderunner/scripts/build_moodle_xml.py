#!/usr/bin/env python3
"""Generator für Moodle CodeRunner XML aus strukturierter Aufgabenablage.
Minimalversion: Liest question.json, prompt.md, tests.yaml und erzeugt dist/moodle-export.xml.
"""
import os, json, sys, re, html, datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
QUESTIONS_DIR = ROOT / 'questions'
DIST_DIR = ROOT / 'dist'
OUTPUT_FILE = DIST_DIR / 'moodle-export.xml'

def read_file(path):
    return path.read_text(encoding='utf-8')

def parse_tests_yaml(path):
    """Sehr einfache YAML-Listen-Parser für das definierte Format.
    Erwartet Einträge mit '- ' Beginn und einfache key: value Zeilen.
    """
    content = read_file(path).splitlines()
    tests = []
    current = None
    for raw in content:
        line = raw.rstrip()
        if not line or line.lstrip().startswith('#'):
            continue
        if line.startswith('- '):
            if current:
                tests.append(current)
            current = {}
            line = line[2:].strip()
            if line:
                if ':' in line:
                    k,v=line.split(':',1)
                    current[k.strip()] = v.strip().strip('"')
            continue
        if ':' in line and current is not None:
            k,v=line.split(':',1)
            current[k.strip()] = v.strip().strip('"')
    if current:
        tests.append(current)
    # Typkonvertierung
    for t in tests:
        if 'hidden' in t:
            t['hidden'] = t['hidden'].lower() == 'true'
        if 'weight' in t:
            try: t['weight'] = int(t['weight'])
            except: t['weight'] = 1
    return tests

MD_CODEBLOCK_RE = re.compile(r'```(\w+)?\n([\s\S]*?)```', re.MULTILINE)

def markdown_to_html(md: str) -> str:
    # Codeblöcke
    def repl_code(m):
        lang = m.group(1) or ''
        code = html.escape(m.group(2).rstrip())
        return f'<pre><code class="language-{lang}">{code}</code></pre>'
    md = MD_CODEBLOCK_RE.sub(repl_code, md)
    # Überschriften
    for i in range(6,0,-1):
        md = re.sub(rf'^{'#'*i} (.+)$', lambda m: f'<h{i}>{html.escape(m.group(1).strip())}</h{i}>', md, flags=re.MULTILINE)
    # Einfache Absätze
    parts = [p.strip() for p in md.split('\n\n') if p.strip()]
    html_parts = []
    for p in parts:
        if p.startswith('<h') or p.startswith('<pre>'):
            html_parts.append(p)
        else:
            html_parts.append(f'<p>{html.escape(p)}</p>')
    return '\n'.join(html_parts)

def build_question_xml(qdir: Path) -> str:
    qjson_path = qdir / 'question.json'
    if not qjson_path.exists():
        return ''
    data = json.loads(read_file(qjson_path))
    prompt_md_path = qdir / 'prompt.md'
    if prompt_md_path.exists():
        prompt_md = read_file(prompt_md_path)
        html_desc = markdown_to_html(prompt_md)
    else:
        html_desc = markdown_to_html(data.get('description_md',''))
    tests_yaml_path = qdir / data.get('tests_ref','tests.yaml')
    tests = parse_tests_yaml(tests_yaml_path) if tests_yaml_path.exists() else []
    name = html.escape(data.get('name','Unbenannte Frage'))
    answer_template = data.get('answer_template','')
    answer_template_escaped = html.escape(answer_template)
    box_size = int(data.get('answer_box_size',12))
    timeout = int(data.get('timeout',5))

    # Testcases XML
    testcases_xml = []
    for t in tests:
        attrs = []
        stdin = html.escape(t.get('input',''))
        expected = html.escape(t.get('expected',''))
        weight = t.get('weight',1)
        display = html.escape(t.get('display','')) if t.get('display') else ''
        useasexample = 'true' if t.get('display') else 'false'
        hidden = t.get('hidden', False)
        # CodeRunner nutzt Attribut 'useasexample' für Beispieldarstellung
        attrs.append(f'stdin="{stdin}"')
        attrs.append(f'expected="{expected}"')
        attrs.append(f'weight="{weight}"')
        attrs.append(f'useasexample="{useasexample}"')
        if display:
            attrs.append(f'display="{display}"')
        if hidden:
            attrs.append('hidden="true"')
        testcases_xml.append(f'      <testcase {" ".join(attrs)} />')
    testcases_block = '\n'.join(testcases_xml)

    xml = f"""
  <question type="coderunner">
    <name><text>{name}</text></name>
    <questiontext format="html"><text><![CDATA[{html_desc}]]></text></questiontext>
    <coderunner>
      <answer><![CDATA[{answer_template}]]></answer>
      <testcases>
{testcases_block}
      </testcases>
      <answerboxsize>{box_size}</answerboxsize>
      <sandboxparams></sandboxparams>
      <acelang>python3</acelang>
      <runtime>python3</runtime>
      <timelimitsecs>{timeout}</timelimitsecs>
    </coderunner>
  </question>"""
    return xml

def main():
    DIST_DIR.mkdir(exist_ok=True)
    questions_xml = []
    for item in sorted(QUESTIONS_DIR.iterdir()):
        if item.is_dir():
            qxml = build_question_xml(item)
            if qxml:
                questions_xml.append(qxml)
    full = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<quiz>\n" + '\n'.join(questions_xml) + "\n</quiz>\n"
    OUTPUT_FILE.write_text(full, encoding='utf-8')
    print(f"Export geschrieben: {OUTPUT_FILE} ({len(questions_xml)} Fragen)")

if __name__ == '__main__':
    main()
