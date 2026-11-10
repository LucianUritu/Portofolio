from pathlib import Path

source = Path('style.css')
text = source.read_text(encoding='utf-8')
lines, token = [], []
indent = 0
quote = None
comment = False
i = 0
def flush(suffix=''):
    value = ''.join(token).strip()
    token.clear()
    if value or suffix:
        lines.append('  ' * indent + value + suffix)
while i < len(text):
    char = text[i]
    if comment:
        token.append(char)
        if char == '*' and i + 1 < len(text) and text[i + 1] == '/':
            token.append('/'); i += 1; comment = False; flush()
    elif quote:
        token.append(char)
        if char == quote and (i == 0 or text[i-1] != '\\'):
            quote = None
    elif char in ('"', "'"):
        quote = char; token.append(char)
    elif char == '/' and i + 1 < len(text) and text[i+1] == '*':
        flush(); token.append('/*'); i += 1; comment = True
    elif char == '{':
        flush(' {'); indent += 1
    elif char == '}':
        flush(); indent -= 1; lines.append('  ' * indent + '}')
    elif char == ';':
        flush(';')
    else:
        token.append(char)
    i += 1
flush()
source.write_text('\n'.join(lines) + '\n', encoding='utf-8')
