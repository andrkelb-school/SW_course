#!/usr/bin/env python3
#"""Stabiler Generator für Moodle CodeRunner XML (python3_w_input).
#Reduziert auf notwendige Felder für lauffähige Frage.
from pathlib import Path
import json, html

ROOT = Path(__file__).resolve().parent.parent
QDIR = ROOT / 'questions'
OUT = ROOT / 'dist' / 'moodle-export.xml'
def read(p: Path) -> str:
    return p.read_text(encoding='utf-8')

def parse_tests(path: Path):
    if not path.exists():
        return []
    lines = read(path).splitlines()
    tests = []
    cur = None; mode=None; buf=[]
    def finish():
        nonlocal cur, buf, mode
        cur['expected'] = '\n'.join(buf).rstrip() + '\n'
        buf=[]; mode=None
    for raw in lines:
        if not raw.strip():
            if mode=='expected': finish()
            continue
        if raw.startswith('- '):
            if cur:
                if mode=='expected': finish()
                tests.append(cur)
            cur={'input_lines':[], 'expected':'', 'example':False, 'weight':1, 'display':''}
            continue
        if cur is None: continue
    s=raw.strip()
    if s.startswith('input_lines:'): continue
    if s.startswith('expected:'):
            mode='expected'; continue
        if mode=='expected':
            if raw.startswith('  '): buf.append(raw.strip()); continue
            finish()
        if s.startswith('example:'): cur['example']=s.split(':',1)[1].strip().lower()=='true'; continue
        if s.startswith('weight:'):
            try: cur['weight']=int(s.split(':',1)[1].strip())
            except: cur['weight']=1
            continue
        if s.startswith('display:'): cur['display']=s.split(':',1)[1].strip().strip('"'); continue
        if raw.startswith('  - '): cur['input_lines'].append(raw.split('- ',1)[1].strip().strip('"')); continue
    if cur:
        if mode=='expected': finish()
        tests.append(cur)
    return tests

def build_question(dirpath: Path):
    qjson = dirpath / 'question.json'
    if not qjson.exists(): return ''
    data = json.loads(read(qjson))
    prompt = dirpath / 'prompt.md'
    desc = read(prompt) if prompt.exists() else data.get('description_md','')
    # Sehr einfache HTML-Einbettung (Markdown nicht voll gerendert)
    desc_html = '<p>' + html.escape(desc).replace('\n\n','</p><p>').replace('\n','<br/>') + '</p>'
    tests = parse_tests(dirpath / data.get('tests_ref','tests.yaml'))
    name = html.escape(data.get('name','Frage'))
    coderunnertype = html.escape(data.get('prototype','python3'))
    allornothing = 1 if data.get('test_strategy','all_or_nothing')=='all_or_nothing' else 0
    lines = int(data.get('answer_box_size',12))
    cols = int(data.get('answer_box_columns',80))
    answer = data.get('answer_template','')
    timeout = int(data.get('timeout',5))
    penaltyregime = html.escape(data.get('penalty_regime',''))
    # Testcases
    tc_parts=[]
    for t in tests:
    stdin = '\n'.join(t['input_lines'])
    expected = t['expected']
    tc_parts.append(
            '      <testcase testtype="0" useasexample="{ex}" hiderestiffail="0" mark="{mark:.7f}" >\n'
            '      <testcode>\n                <text></text>\n      </testcode>\n'
            '      <stdin>\n                <text>{stdin}</text>\n      </stdin>\n'
            '      <expected>\n                <text>{expected}</text>\n      </expected>\n'
            '      <extra>\n                <text></text>\n      </extra>\n'
            '      <display>\n                <text>{display}</text>\n      </display>\n'
            '      </testcase>'
            .format(ex='1' if t['example'] else '0', mark=float(t['weight']), stdin=html.escape(stdin), expected=html.escape(expected), display=html.escape(t['display']))
        )
    testcases_block='\n'.join(tc_parts)
    xml = (
        '  <question type="coderunner">\n'
    f'    <name>\n      <text>{name}</text>\n    </name>\n'
    f'    <questiontext format="html">\n      <text><![CDATA[{desc_html}]]></text>\n    </questiontext>\n'
    '    <generalfeedback format="html">\n      <text></text>\n    </generalfeedback>\n'
    '    <defaultgrade>30</defaultgrade>\n    <penalty>0</penalty>\n    <hidden>0</hidden>\n    <idnumber></idnumber>\n'
    f'    <coderunnertype>{coderunnertype}</coderunnertype>\n'
    '    <prototypetype>0</prototypetype>\n'
    f'    <allornothing>{allornothing}</allornothing>\n'
    f'    <penaltyregime>{penaltyregime}</penaltyregime>\n'
    '    <precheck>0</precheck>\n    <hidecheck>0</hidecheck>\n    <showsource>0</showsource>\n'
    f'    <answerboxlines>{lines}</answerboxlines>\n'
    f'    <answerboxcolumns>{cols}</answerboxcolumns>\n'
    '    <answerpreload></answerpreload>\n    <globalextra></globalextra>\n    <useace></useace>\n    <resultcolumns></resultcolumns>\n    <template></template>\n    <iscombinatortemplate></iscombinatortemplate>\n    <allowmultiplestdins></allowmultiplestdins>\n'
    f'    <answer><![CDATA[{answer}]]></answer>\n'
    '    <validateonsave>1</validateonsave>\n    <testsplitterre></testsplitterre>\n    <language></language>\n    <acelang></acelang>\n    <sandbox></sandbox>\n    <grader></grader>\n    <cputimelimitsecs></cputimelimitsecs>\n    <memlimitmb></memlimitmb>\n    <sandboxparams></sandboxparams>\n    <templateparams></templateparams>\n    <hoisttemplateparams>1</hoisttemplateparams>\n    <extractcodefromjson>1</extractcodefromjson>\n    <templateparamslang>None</templateparamslang>\n    <templateparamsevalpertry>0</templateparamsevalpertry>\n    <templateparamsevald></templateparamsevald>\n    <twigall>0</twigall>\n'
        '    <testcases>\n' + testcases_block + '\n    </testcases>\n'
        '  </question>'
    )
    return xml

def main():
    OUT.parent.mkdir(exist_ok=True)
    questions=[]
    for d in sorted(QDIR.iterdir()):
        if d.is_dir():
            qxml=build_question(d)
            if qxml:
                questions.append(qxml)
    full = '<?xml version="1.0" encoding="UTF-8"?>\n<quiz>\n' + '\n'.join(questions) + '\n</quiz>\n'
    OUT.write_text(full, encoding='utf-8')
    print(f'Export geschrieben: {OUT} ({len(questions)} Fragen)')

if __name__ == '__main__':
    main()
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

def read_file(p: Path) -> str:
    return p.read_text(encoding='utf-8')

def parse_tests_yaml(path):
    """Parser für neues YAML Format mit input_lines, expected Block, example, weight, display."""
    lines = read_file(path).splitlines()
    tests = []
    current = None
    mode = None
    buf = []
    def finish_expected():
        nonlocal current, buf, mode
        current['expected'] = '\n'.join(buf).rstrip() + '\n'
        buf = []
        mode = None
    for raw in lines:
        line = raw.rstrip('\n')
        if not line.strip():
            if mode == 'expected':
                finish_expected()
            continue
        if line.startswith('- '):
            if current:
                if mode == 'expected':
                    finish_expected()
                tests.append(current)
            current = {'input_lines': [], 'expected': '', 'example': False, 'weight':1, 'display': ''}
            continue
        if current is None:
            continue
        if line.strip().startswith('input_lines:'):
            continue
        if line.strip().startswith('expected:'):
            mode = 'expected'
            continue
        if mode == 'expected':
            if line.startswith('  ') or line.startswith('    '):
                buf.append(line.strip())
                continue
            finish_expected()
        if line.strip().startswith('example:'):
            current['example'] = line.split(':',1)[1].strip().lower() == 'true'
            continue
        if line.strip().startswith('weight:'):
            try:
                current['weight'] = int(line.split(':',1)[1].strip())
            except:
                current['weight'] = 1
            continue
        if line.strip().startswith('display:'):
            current['display'] = line.split(':',1)[1].strip().strip('"')
            continue
        if line.startswith('  - '):
            val = line.split('- ',1)[1].strip().strip('"')
            current['input_lines'].append(val)
            continue
    if current:
        if mode == 'expected':
            finish_expected()
        tests.append(current)
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

MD_CODEBLOCK_RE = re.compile(r'```(\w+)?\n([\s\S]*?)```', re.MULTILINE)

def markdown_to_html(md: str) -> str:
    def repl_code(m):
        lang = m.group(1) or ''
        code = html.escape(m.group(2).rstrip())
        return f'<pre><code class="language-{lang}">{code}</code></pre>'
    md = MD_CODEBLOCK_RE.sub(repl_code, md)
    for i in range(6,0,-1):
        md = re.sub(rf'^{'#'*i} (.+)$', lambda m: f'<h{i}>{html.escape(m.group(1).strip())}</h{i}>', md, flags=re.MULTILINE)
    parts = [p.strip() for p in md.split('\n\n') if p.strip()]
    out = []
    for p in parts:
        if p.startswith('<h') or p.startswith('<pre>'):
            out.append(p)
        else:
            out.append(f'<p>{html.escape(p)}</p>')
    return '\n'.join(out)

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
    box_lines = int(data.get('answer_box_size',12))
    box_cols = int(data.get('answer_box_columns',80))
    timeout = int(data.get('timeout',5))
    coderunnertype = html.escape(data.get('prototype','python3'))
    allornothing = 1 if data.get('test_strategy','all_or_nothing') == 'all_or_nothing' else 0
    penalty_regime = html.escape(data.get('penalty_regime',''))

    # Testcases XML verschachtelt
    testcases_xml = []
    for t in tests:
        input_block = '\n'.join([html.escape(line) for line in t.get('input_lines', [])])
        expected_block = html.escape(t.get('expected',''))
        example_flag = '1' if t.get('example', False) else '0'
        mark = f"{float(t.get('weight',1)):.7f}"
        display_text = html.escape(t.get('display',''))
        testcases_xml.append(f"      <testcase testtype=\"0\" useasexample=\"{example_flag}\" hiderestiffail=\"0\" mark=\"{mark}\" >\n      <testcode>\n                <text></text>\n      </testcode>\n      <stdin>\n                <text>{input_block}</text>\n      </stdin>\n      <expected>\n                <text>{expected_block}</text>\n      </expected>\n      <extra>\n                <text></text>\n      </extra>\n      <display>\n                <text>{display_text}</text>\n      </display>\n      </testcase>")
    testcases_block = '\n'.join(testcases_xml)

        xml = (
            "  <question type=\"coderunner\">\n"
            f"    <name>\n      <text>{name}</text>\n    </name>\n"
            f"    <questiontext format=\"html\">\n      <text><![CDATA[{html_desc}]]></text>\n    </questiontext>\n"
            "    <generalfeedback format=\"html\">\n      <text></text>\n    </generalfeedback>\n"
            "    <defaultgrade>30</defaultgrade>\n    <penalty>0</penalty>\n    <hidden>0</hidden>\n    <idnumber></idnumber>\n"
            f"    <coderunnertype>{coderunnertype}</coderunnertype>\n"
            "    <prototypetype>0</prototypetype>\n"
            f"    <allornothing>{allornothing}</allornothing>\n"
            f"    <penaltyregime>{penalty_regime}</penaltyregime>\n"
            "    <precheck>0</precheck>\n    <hidecheck>0</hidecheck>\n    <showsource>0</showsource>\n"
            f"    <answerboxlines>{box_lines}</answerboxlines>\n"
            f"    <answerboxcolumns>{box_cols}</answerboxcolumns>\n"
            "    <answerpreload></answerpreload>\n    <globalextra></globalextra>\n    <useace></useace>\n    <resultcolumns></resultcolumns>\n    <template></template>\n    <iscombinatortemplate></iscombinatortemplate>\n    <allowmultiplestdins></allowmultiplestdins>\n"
            f"    <answer><![CDATA[{answer_template}]]></answer>\n"
            "    <validateonsave>1</validateonsave>\n    <testsplitterre></testsplitterre>\n    <language></language>\n    <acelang></acelang>\n    <sandbox></sandbox>\n    <grader></grader>\n    <cputimelimitsecs></cputimelimitsecs>\n    <memlimitmb></memlimitmb>\n    <sandboxparams></sandboxparams>\n    <templateparams></templateparams>\n    <hoisttemplateparams>1</hoisttemplateparams>\n    <extractcodefromjson>1</extractcodefromjson>\n    <templateparamslang>None</templateparamslang>\n    <templateparamsevalpertry>0</templateparamsevalpertry>\n"
            "    <templateparamsevald>{}</templateparamsevald>\n    <twigall>0</twigall>\n    <uiplugin></uiplugin>\n    <uiparameters></uiparameters>\n    <attachments>0</attachments>\n    <attachmentsrequired>0</attachmentsrequired>\n    <maxfilesize>10240</maxfilesize>\n    <filenamesregex></filenamesregex>\n    <filenamesexplain></filenamesexplain>\n    <displayfeedback>1</displayfeedback>\n    <giveupallowed>0</giveupallowed>\n    <prototypeextra></prototypeextra>\n"
            f"    <testcases>\n{testcases_block}\n    </testcases>\n  </question>"
        )
    <question type=\"coderunner\">\n    <name>\n      <text>{name}</text>\n    </name>\n    <questiontext format=\"html\">\n      <text><![CDATA[{html_desc}]]></text>\n    </questiontext>\n    <generalfeedback format=\"html\">\n      <text></text>\n    </generalfeedback>\n    <defaultgrade>30</defaultgrade>\n    <penalty>0</penalty>\n    <hidden>0</hidden>\n    <idnumber></idnumber>\n    <coderunnertype>{coderunnertype}</coderunnertype>\n    <prototypetype>0</prototypetype>\n    <allornothing>{allornothing}</allornothing>\n    <penaltyregime>{penalty_regime}</penaltyregime>\n    <precheck>0</precheck>\n    <hidecheck>0</hidecheck>\n    <showsource>0</showsource>\n    <answerboxlines>{box_lines}</answerboxlines>\n    <answerboxcolumns>{box_cols}</answerboxcolumns>\n    <answerpreload></answerpreload>\n    <globalextra></globalextra>\n    <useace></useace>\n    <resultcolumns></resultcolumns>\n    <template></template>\n    <iscombinatortemplate></iscombinatortemplate>\n    <allowmultiplestdins></allowmultiplestdins>\n    <answer><![CDATA[{answer_template}]]></answer>\n    <validateonsave>1</validateonsave>\n    <testsplitterre></testsplitterre>\n    <language></language>\n    <acelang></acelang>\n    <sandbox></sandbox>\n    <grader></grader>\n    <cputimelimitsecs></cputimelimitsecs>\n    <memlimitmb></memlimitmb>\n    <sandboxparams></sandboxparams>\n    <templateparams></templateparams>\n    <hoisttemplateparams>1</hoisttemplateparams>\n    <extractcodefromjson>1</extractcodefromjson>\n    <templateparamslang>None</templateparamslang>\n    <templateparamsevalpertry>0</templateparamsevalpertry>\n    <templateparamsevald>{}</templateparamsevald>\n    <twigall>0</twigall>\n    <uiplugin></uiplugin>\n    <uiparameters></uiparameters>\n    <attachments>0</attachments>\n    <attachmentsrequired>0</attachmentsrequired>\n    <maxfilesize>10240</maxfilesize>\n    <filenamesregex></filenamesregex>\n    <filenamesexplain></filenamesexplain>\n    <displayfeedback>1</displayfeedback>\n    <giveupallowed>0</giveupallowed>\n    <prototypeextra></prototypeextra>\n    <testcases>\n{testcases_block}\n    </testcases>\n  </question>"""
    return xml

def main():
    DIST_DIR.mkdir(exist_ok=True)
    questions_xml = []
    for d in sorted(QUESTIONS_DIR.iterdir()):
        if d.is_dir():
            qxml = build_question_xml(d)
            if qxml:
                questions_xml.append(qxml)
    full = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<quiz>\n" + '\n'.join(questions_xml) + "\n</quiz>\n"
    OUTPUT_FILE.write_text(full, encoding='utf-8')
    print(f"Export geschrieben: {OUTPUT_FILE} ({len(questions_xml)} Fragen)")

if __name__ == '__main__':
    main()

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
