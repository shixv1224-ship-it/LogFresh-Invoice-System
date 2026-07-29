#!/usr/bin/env python3
"""Build the Chinese beginner user guide as a polished PDF.

The source stays in Markdown so it is easy to edit on GitHub. This script turns
that Markdown into a printable PDF with LogFresh styling, screenshots, headers,
footers, and page numbers.
"""

from __future__ import annotations

import html
import re
from datetime import date
from pathlib import Path
from typing import Iterable

from PIL import Image as PILImage
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.platypus import (
    HRFlowable,
    Image,
    KeepTogether,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)
from reportlab.pdfbase.ttfonts import TTFont


ROOT = Path(__file__).resolve().parents[1]
DOCS_DIR = ROOT / "docs"
SOURCE_MD = DOCS_DIR / "beginner-user-guide.zh-CN.md"
OUTPUT_PDF = DOCS_DIR / "LogFresh_Beginner_User_Guide_zh-CN.pdf"
LOGO_PATH = ROOT / "work" / "harvest_smart_logo_cropped.png"

BRAND_ORANGE = colors.HexColor("#f39a00")
BRAND_GREEN = colors.HexColor("#38a93c")
DARK = colors.HexColor("#2d3338")
MUTED = colors.HexColor("#666f76")
LIGHT_GREEN = colors.HexColor("#eef7ef")
LIGHT_ORANGE = colors.HexColor("#fff6e7")
LIGHT_GRAY = colors.HexColor("#f5f7f8")
RULE_GRAY = colors.HexColor("#dfe5e8")


def register_fonts() -> tuple[str, str]:
    """Register embedded fonts so the PDF renders reliably on other machines."""
    body_font = "ArialUnicode"
    heading_font = "STHeitiMedium"
    body_path = "/Library/Fonts/Arial Unicode.ttf"
    if not Path(body_path).exists():
        body_path = "/System/Library/Fonts/Supplemental/Arial Unicode.ttf"
    heading_path = "/System/Library/Fonts/STHeiti Medium.ttc"
    pdfmetrics.registerFont(TTFont(body_font, body_path))
    pdfmetrics.registerFont(TTFont(heading_font, heading_path, subfontIndex=0))
    return body_font, heading_font


BODY_FONT, HEADING_FONT = register_fonts()


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    styles: dict[str, ParagraphStyle] = {}

    styles["cover_title"] = ParagraphStyle(
        "CoverTitle",
        parent=base["Title"],
        fontName=HEADING_FONT,
        fontSize=27,
        leading=34,
        textColor=BRAND_ORANGE,
        alignment=TA_CENTER,
        spaceAfter=14,
    )
    styles["cover_subtitle"] = ParagraphStyle(
        "CoverSubtitle",
        parent=base["Normal"],
        fontName=BODY_FONT,
        fontSize=13,
        leading=20,
        textColor=DARK,
        alignment=TA_CENTER,
        spaceAfter=8,
    )
    styles["h1"] = ParagraphStyle(
        "Heading1",
        parent=base["Heading1"],
        fontName=HEADING_FONT,
        fontSize=19,
        leading=25,
        textColor=BRAND_ORANGE,
        spaceBefore=16,
        spaceAfter=8,
        keepWithNext=True,
    )
    styles["h2"] = ParagraphStyle(
        "Heading2",
        parent=base["Heading2"],
        fontName=HEADING_FONT,
        fontSize=15,
        leading=21,
        textColor=BRAND_GREEN,
        spaceBefore=14,
        spaceAfter=7,
        keepWithNext=True,
    )
    styles["h3"] = ParagraphStyle(
        "Heading3",
        parent=base["Heading3"],
        fontName=HEADING_FONT,
        fontSize=12.5,
        leading=17,
        textColor=DARK,
        spaceBefore=9,
        spaceAfter=5,
        keepWithNext=True,
    )
    styles["body"] = ParagraphStyle(
        "Body",
        parent=base["BodyText"],
        fontName=BODY_FONT,
        fontSize=10.2,
        leading=16.2,
        textColor=DARK,
        spaceAfter=5,
        wordWrap="CJK",
    )
    styles["small"] = ParagraphStyle(
        "Small",
        parent=styles["body"],
        fontSize=8.6,
        leading=12.2,
        textColor=MUTED,
    )
    styles["bullet"] = ParagraphStyle(
        "Bullet",
        parent=styles["body"],
        leftIndent=18,
        firstLineIndent=-10,
        bulletIndent=7,
        spaceAfter=3,
    )
    styles["code"] = ParagraphStyle(
        "Code",
        parent=styles["body"],
        fontName=BODY_FONT,
        fontSize=8.6,
        leading=12.5,
        textColor=colors.HexColor("#183a2a"),
        backColor=LIGHT_GRAY,
        borderColor=colors.HexColor("#e1e6e8"),
        borderWidth=0.25,
        borderPadding=6,
        wordWrap="CJK",
        spaceBefore=4,
        spaceAfter=7,
    )
    styles["table"] = ParagraphStyle(
        "TableCell",
        parent=styles["body"],
        fontSize=8.2,
        leading=11.2,
        wordWrap="CJK",
    )
    styles["table_header"] = ParagraphStyle(
        "TableHeader",
        parent=styles["table"],
        fontName=HEADING_FONT,
        textColor=colors.white,
    )
    styles["toc"] = ParagraphStyle(
        "TOC",
        parent=styles["body"],
        fontName=BODY_FONT,
        fontSize=10.5,
        leading=17,
        leftIndent=16,
        firstLineIndent=-10,
    )
    return styles


STYLES = make_styles()


def escape_inline(text: str) -> str:
    """Escape Markdown-ish inline text for ReportLab Paragraphs."""
    text = html.escape(text.strip())
    text = re.sub(
        r"`([^`]+)`",
        lambda m: f'<font name="{HEADING_FONT}" color="#207a31">{html.escape(m.group(1))}</font>',
        text,
    )
    text = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", text)
    text = text.replace(" -&gt; ", " → ")
    return text


def split_table_row(line: str) -> list[str]:
    line = line.strip()
    if line.startswith("|"):
        line = line[1:]
    if line.endswith("|"):
        line = line[:-1]
    return [cell.strip() for cell in line.split("|")]


def is_table_separator(line: str) -> bool:
    cells = split_table_row(line)
    return bool(cells) and all(re.fullmatch(r":?-{3,}:?", cell.strip()) for cell in cells)


def add_table(story: list, lines: list[str], max_width: float) -> None:
    rows = [split_table_row(line) for line in lines if not is_table_separator(line)]
    if not rows:
        return

    max_cols = max(len(row) for row in rows)
    rows = [row + [""] * (max_cols - len(row)) for row in rows]
    table_data = []
    for r, row in enumerate(rows):
        style = STYLES["table_header"] if r == 0 else STYLES["table"]
        table_data.append([Paragraph(escape_inline(cell), style) for cell in row])

    col_width = max_width / max_cols
    table = Table(table_data, colWidths=[col_width] * max_cols, repeatRows=1, hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BRAND_GREEN),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.35, RULE_GRAY),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 5),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#fbfcfc")]),
            ]
        )
    )
    story.extend([Spacer(1, 4), table, Spacer(1, 9)])


def add_image(story: list, image_path: Path, caption: str, max_width: float) -> None:
    if not image_path.exists():
        story.append(Paragraph(f"图片未找到：{escape_inline(str(image_path))}", STYLES["small"]))
        return

    with PILImage.open(image_path) as img:
        width_px, height_px = img.size
    width = min(max_width, 6.7 * inch)
    height = width * height_px / width_px
    max_height = 4.7 * inch
    if height > max_height:
        height = max_height
        width = height * width_px / height_px

    block = [
        Spacer(1, 6),
        Image(str(image_path), width=width, height=height, hAlign="CENTER"),
    ]
    if caption:
        block.append(Paragraph(escape_inline(caption), STYLES["small"]))
    block.append(Spacer(1, 9))
    story.append(KeepTogether(block))


def add_code_block(story: list, code_lines: Iterable[str]) -> None:
    text = "<br/>".join(html.escape(line) for line in code_lines)
    if not text.strip():
        return
    story.append(Paragraph(text, STYLES["code"]))


def parse_markdown(md_path: Path, doc_width: float) -> list:
    lines = md_path.read_text(encoding="utf-8").splitlines()
    story: list = []
    paragraph_buffer: list[str] = []
    in_code = False
    code_buffer: list[str] = []
    i = 0

    def flush_paragraph() -> None:
        nonlocal paragraph_buffer
        if paragraph_buffer:
            text = " ".join(line.strip() for line in paragraph_buffer if line.strip())
            if text:
                story.append(Paragraph(escape_inline(text), STYLES["body"]))
            paragraph_buffer = []

    while i < len(lines):
        line = lines[i]
        stripped = line.strip()

        if stripped.startswith("```"):
            flush_paragraph()
            if in_code:
                add_code_block(story, code_buffer)
                code_buffer = []
                in_code = False
            else:
                in_code = True
            i += 1
            continue

        if in_code:
            code_buffer.append(line)
            i += 1
            continue

        if not stripped:
            flush_paragraph()
            story.append(Spacer(1, 3))
            i += 1
            continue

        if stripped == "---":
            flush_paragraph()
            story.append(Spacer(1, 4))
            story.append(HRFlowable(width="100%", thickness=0.5, color=RULE_GRAY, spaceBefore=4, spaceAfter=8))
            i += 1
            continue

        if stripped.startswith("|") and "|" in stripped[1:]:
            flush_paragraph()
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                table_lines.append(lines[i])
                i += 1
            add_table(story, table_lines, doc_width)
            continue

        image_match = re.fullmatch(r"!\[([^\]]*)\]\(([^)]+)\)", stripped)
        if image_match:
            flush_paragraph()
            alt, path = image_match.groups()
            image_path = (DOCS_DIR / path).resolve() if not Path(path).is_absolute() else Path(path)
            add_image(story, image_path, alt, doc_width)
            i += 1
            continue

        heading_match = re.match(r"^(#{1,4})\s+(.+)$", stripped)
        if heading_match:
            flush_paragraph()
            level = len(heading_match.group(1))
            text = heading_match.group(2)
            style_name = {1: "h1", 2: "h2", 3: "h3", 4: "h3"}[level]
            story.append(Paragraph(escape_inline(text), STYLES[style_name]))
            i += 1
            continue

        bullet_match = re.match(r"^[-*]\s+(.+)$", stripped)
        numbered_match = re.match(r"^(\d+)\.\s+(.+)$", stripped)
        if bullet_match:
            flush_paragraph()
            story.append(Paragraph(escape_inline(bullet_match.group(1)), STYLES["bullet"], bulletText="•"))
            i += 1
            continue
        if numbered_match:
            flush_paragraph()
            number, item = numbered_match.groups()
            story.append(Paragraph(escape_inline(item), STYLES["bullet"], bulletText=f"{number}."))
            i += 1
            continue

        paragraph_buffer.append(line)
        i += 1

    flush_paragraph()
    if code_buffer:
        add_code_block(story, code_buffer)
    return story


def cover_story() -> list:
    story: list = []
    story.append(Spacer(1, 0.45 * inch))
    if LOGO_PATH.exists():
        with PILImage.open(LOGO_PATH) as img:
            width_px, height_px = img.size
        width = 4.2 * inch
        height = width * height_px / width_px
        story.append(Image(str(LOGO_PATH), width=width, height=height, hAlign="CENTER"))
        story.append(Spacer(1, 0.35 * inch))

    story.append(Paragraph("LogFresh 订单与发票系统", STYLES["cover_title"]))
    story.append(Paragraph("新手完整操作教程", STYLES["cover_title"]))
    story.append(Paragraph("Beginner User Guide for Order Confirmation and Invoice Workflows", STYLES["cover_subtitle"]))
    story.append(Spacer(1, 0.35 * inch))

    intro = (
        "本教程适合只会基础电脑操作的使用者。按步骤操作即可完成订单录入、"
        "Order Confirmation、Invoice、shipping 信息更新、邮件确认和 Drive 文件查询。"
    )
    callout = Table(
        [[Paragraph(escape_inline(intro), STYLES["body"])]],
        colWidths=[5.7 * inch],
        hAlign="CENTER",
    )
    callout.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), LIGHT_GREEN),
                ("BOX", (0, 0), (-1, -1), 0.7, BRAND_GREEN),
                ("LEFTPADDING", (0, 0), (-1, -1), 14),
                ("RIGHTPADDING", (0, 0), (-1, -1), 14),
                ("TOPPADDING", (0, 0), (-1, -1), 12),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 12),
            ]
        )
    )
    story.append(callout)
    story.append(Spacer(1, 0.35 * inch))

    quick = [
        ["最常用入口", "Form 1 销售订单表单、Google Sheet 后台、内部提醒邮件按钮"],
        ["常用流程", "Invoice Only、Invoice Only - Needs Shipping Info、Confirmation First"],
        ["重要提醒", "客户确认按钮不需要登录 Google；测试模式只发 mcp@logfresh.net"],
        ["版本日期", date.today().strftime("%m/%d/%Y")],
    ]
    table = Table(
        [[Paragraph(escape_inline(a), STYLES["table_header"]), Paragraph(escape_inline(b), STYLES["table"])] for a, b in quick],
        colWidths=[1.45 * inch, 4.25 * inch],
        hAlign="CENTER",
    )
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), BRAND_ORANGE),
                ("BACKGROUND", (1, 0), (1, -1), LIGHT_ORANGE),
                ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#ead8b9")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.append(table)
    story.append(PageBreak())
    return story


def draw_header_footer(canvas, doc) -> None:
    canvas.saveState()
    page = doc.page
    width, height = letter

    if page > 1:
        canvas.setStrokeColor(RULE_GRAY)
        canvas.setLineWidth(0.4)
        canvas.line(doc.leftMargin, height - 0.55 * inch, width - doc.rightMargin, height - 0.55 * inch)
        canvas.setFont(HEADING_FONT, 8.5)
        canvas.setFillColor(BRAND_GREEN)
        canvas.drawString(doc.leftMargin, height - 0.42 * inch, "LogFresh 订单与发票系统新手教程")
        canvas.setFillColor(MUTED)
        canvas.setFont(BODY_FONT, 8)
        canvas.drawRightString(width - doc.rightMargin, height - 0.42 * inch, "Harvest Smart · LogFresh")

    canvas.setStrokeColor(RULE_GRAY)
    canvas.setLineWidth(0.4)
    canvas.line(doc.leftMargin, 0.55 * inch, width - doc.rightMargin, 0.55 * inch)
    canvas.setFont(BODY_FONT, 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(doc.leftMargin, 0.36 * inch, "Generated from GitHub Markdown source")
    canvas.drawRightString(width - doc.rightMargin, 0.36 * inch, f"Page {page}")
    canvas.restoreState()


def build() -> None:
    OUTPUT_PDF.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=letter,
        rightMargin=0.62 * inch,
        leftMargin=0.62 * inch,
        topMargin=0.75 * inch,
        bottomMargin=0.78 * inch,
        title="LogFresh 订单与发票系统新手完整教程",
        author="LogFresh Biotechnology Co., LTD",
    )
    story = cover_story()
    story.extend(parse_markdown(SOURCE_MD, doc.width))
    doc.build(story, onFirstPage=draw_header_footer, onLaterPages=draw_header_footer)
    print(OUTPUT_PDF)


if __name__ == "__main__":
    build()
