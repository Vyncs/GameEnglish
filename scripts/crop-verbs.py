"""Recorta as 100 ilustracoes da folha public/100 verbs.png.

A folha tem 2 paineis (50 FIRST / 50 SECOND), cada um com 10 colunas x 5 linhas.
De cada celula pegamos SO a ilustracao (descartando o numero e a palavra no topo),
detectando a faixa branca que separa o texto do desenho.
"""
import os
import sys
from PIL import Image
import numpy as np

SRC = sys.argv[1] if len(sys.argv) > 1 else 'public/100 verbs.png'
OUT = sys.argv[2] if len(sys.argv) > 2 else 'public/verbs'
CONTACT = sys.argv[3] if len(sys.argv) > 3 else None

# Bordas verticais detectadas (11 por painel = 10 colunas).
COLS_LEFT = [4, 83, 166, 243, 323, 396, 466, 537, 606, 678, 753]
COLS_RIGHT = [779, 858, 933, 1005, 1074, 1154, 1228, 1301, 1378, 1453, 1529]
# Bordas horizontais (6 por painel = 5 linhas).
ROWS_LEFT = [57, 231, 423, 615, 792, 1009]
ROWS_RIGHT = [57, 231, 426, 618, 801, 1011]

PAD = 4          # margem interna para nao pegar a borda da tabela
MARGIN = 2       # respiro deixado ao redor do desenho
# Numero e palavra ocupam blocos de ate ~22px; o desenho nunca tem menos de ~49px.
ART_MIN_H = 35


def is_ink(block):
    """Mascara booleana: True onde o pixel NAO e branco."""
    return block.sum(axis=2) < 720


def crop_cell(arr, x0, x1, y0, y1):
    cell = arr[y0 + PAD:y1 - PAD, x0 + PAD:x1 - PAD]
    ink = is_ink(cell)
    rows = ink.sum(axis=1)

    # 1) blocos de tinta separados por faixas brancas
    blocks, a = [], None
    for y, n in enumerate(rows):
        if n > 0 and a is None:
            a = y
        elif n == 0 and a is not None:
            blocks.append((a, y))
            a = None
    if a is not None:
        blocks.append((a, len(rows)))

    # 2) o desenho e sempre o bloco mais alto da celula (numero e palavra sao baixos,
    #    e as vezes se juntam num bloco so - caso do "02 ask")
    if not blocks:
        return None
    start = max(blocks, key=lambda b: b[1] - b[0])[0]

    art = ink[start:]
    if not art.any():
        return None

    # 2) bounding box do desenho
    ys = np.where(art.any(axis=1))[0]
    xs = np.where(art.any(axis=0))[0]
    top = start + max(0, ys[0] - MARGIN)
    bot = start + min(art.shape[0], ys[-1] + 1 + MARGIN)
    left = max(0, xs[0] - MARGIN)
    right = min(art.shape[1], xs[-1] + 1 + MARGIN)

    return (x0 + PAD + left, y0 + PAD + top, x0 + PAD + right, y0 + PAD + bot)


def transparent_bg(tile):
    """Fundo branco -> transparente, via flood fill pelos 4 cantos.
    So o branco ligado a borda some: camisa branca, olho e balao continuam brancos.
    """
    rgba = tile.convert('RGBA')
    mask = Image.new('L', rgba.size, 0)
    flat = rgba.convert('RGB')
    from PIL import ImageDraw
    w, h = rgba.size
    for xy in ((0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1)):
        if sum(flat.getpixel(xy)) > 700:
            ImageDraw.floodfill(flat, xy, (255, 0, 255), thresh=40)
    a = np.asarray(flat).astype(int)
    bg = (a[:, :, 0] > 240) & (a[:, :, 1] < 15) & (a[:, :, 2] > 240)
    alpha = np.where(bg, 0, 255).astype('uint8')
    rgba.putalpha(Image.fromarray(alpha, 'L'))
    del mask
    return rgba


def main():
    im = Image.open(SRC).convert('RGB')
    arr = np.asarray(im).astype(int)
    os.makedirs(OUT, exist_ok=True)

    boxes = []
    for cols, rows in ((COLS_LEFT, ROWS_LEFT), (COLS_RIGHT, ROWS_RIGHT)):
        for r in range(5):
            for c in range(10):
                box = crop_cell(arr, cols[c], cols[c + 1], rows[r], rows[r + 1])
                boxes.append(box)

    sizes = []
    for i, box in enumerate(boxes, start=1):
        name = os.path.join(OUT, f'verb-{i:02d}.png')
        if box is None:
            print('VAZIO', i)
            continue
        transparent_bg(im.crop(box)).save(name)
        sizes.append((i, box[2] - box[0], box[3] - box[1]))

    print(f'{len(sizes)} recortes em {OUT}')
    print('menor largura', min(s[1] for s in sizes), 'menor altura', min(s[2] for s in sizes))
    print('maior largura', max(s[1] for s in sizes), 'maior altura', max(s[2] for s in sizes))

    if CONTACT:
        cw, ch, per = 90, 110, 10
        sheet = Image.new('RGB', (cw * per, ch * 10), (15, 23, 42))
        for i in range(1, 101):
            p = os.path.join(OUT, f'verb-{i:02d}.png')
            if not os.path.exists(p):
                continue
            th = Image.open(p).convert('RGBA')
            th.thumbnail((cw - 8, ch - 8))
            x = ((i - 1) % per) * cw + (cw - th.width) // 2
            y = ((i - 1) // per) * ch + (ch - th.height) // 2
            sheet.paste(th, (x, y), th)
        sheet.save(CONTACT)
        print('contato:', CONTACT)


main()
