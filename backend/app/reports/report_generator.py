from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
)
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics

from datetime import datetime
import html
import os
import uuid


# ============================================================
# Helper
# ============================================================

def clean_text(value):
    if value is None:
        return "Not available"

    return html.escape(str(value))


# ============================================================
# Footer
# ============================================================

def add_page_footer(canvas, doc):

    canvas.saveState()

    width, height = A4

    canvas.setStrokeColor(colors.HexColor("#CBD5E1"))
    canvas.line(
        20 * mm,
        15 * mm,
        width - 20 * mm,
        15 * mm,
    )

    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748B"))

    canvas.drawString(
        20 * mm,
        10 * mm,
        "SentinelX — AI-Powered Cyber Threat Intelligence Platform",
    )

    canvas.drawRightString(
        width - 20 * mm,
        10 * mm,
        f"Page {doc.page}",
    )

    canvas.restoreState()


# ============================================================
# Report Generator
# ============================================================

def generate_report(ip: str, analysis: str, threat_data=None):

    # --------------------------------------------------------
    # Report directory
    # --------------------------------------------------------

    os.makedirs("reports", exist_ok=True)

    report_id = str(uuid.uuid4())[:8].upper()

    filename = f"reports/SentinelX_Report_{report_id}.pdf"

    # --------------------------------------------------------
    # Document
    # --------------------------------------------------------

    doc = SimpleDocTemplate(
        filename,
        pagesize=A4,
        rightMargin=18 * mm,
        leftMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=22 * mm,
        title="SentinelX Threat Intelligence Report",
        author="SentinelX",
    )

    styles = getSampleStyleSheet()

    # --------------------------------------------------------
    # Custom styles
    # --------------------------------------------------------

    title_style = ParagraphStyle(
        "SentinelXTitle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#0F172A"),
        alignment=TA_CENTER,
        spaceAfter=8,
    )

    subtitle_style = ParagraphStyle(
        "SentinelXSubtitle",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=colors.HexColor("#64748B"),
        alignment=TA_CENTER,
        spaceAfter=18,
    )

    section_style = ParagraphStyle(
        "Section",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=16,
        textColor=colors.HexColor("#0F172A"),
        spaceBefore=12,
        spaceAfter=8,
    )

    body_style = ParagraphStyle(
        "Body",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=14,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6,
    )

    small_style = ParagraphStyle(
        "Small",
        parent=styles["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=colors.HexColor("#64748B"),
    )

    risk_style = ParagraphStyle(
        "Risk",
        parent=styles["Normal"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=colors.white,
        alignment=TA_CENTER,
    )

    # --------------------------------------------------------
    # Data
    # --------------------------------------------------------

    threat_data = threat_data or {}

    country = threat_data.get("country", "Not available")
    region = threat_data.get("region", "Not available")
    city = threat_data.get("city", "Not available")
    organization = threat_data.get(
        "organization",
        "Not available",
    )
    timezone = threat_data.get(
        "timezone",
        "Not available",
    )

    risk_level = threat_data.get(
        "risk_level",
        "AI assessed",
    )

    threat_summary = threat_data.get(
        "threat_summary",
        analysis,
    )

    attack_possibilities = threat_data.get(
        "attack_possibilities",
        "See AI Threat Analysis section.",
    )

    recommended_actions = threat_data.get(
        "recommended_actions",
        "Follow the security recommendations provided by the AI analysis.",
    )

    generated_at = datetime.now().strftime(
        "%d %B %Y, %H:%M:%S"
    )

    # --------------------------------------------------------
    # Story
    # --------------------------------------------------------

    story = []

    # ========================================================
    # Cover Header
    # ========================================================

    story.append(
        Paragraph(
            "SENTINELX",
            title_style,
        )
    )

    story.append(
        Paragraph(
            "AI-POWERED CYBER THREAT INTELLIGENCE",
            subtitle_style,
        )
    )

    story.append(
        Paragraph(
            "THREAT INCIDENT REPORT",
            section_style,
        )
    )

    # --------------------------------------------------------
    # Report metadata
    # --------------------------------------------------------

    metadata = [
        [
            Paragraph("<b>Report ID</b>", body_style),
            Paragraph(clean_text(report_id), body_style),
            Paragraph("<b>Generated</b>", body_style),
            Paragraph(clean_text(generated_at), body_style),
        ],
        [
            Paragraph("<b>IP Address</b>", body_style),
            Paragraph(clean_text(ip), body_style),
            Paragraph("<b>Risk Level</b>", body_style),
            Paragraph(clean_text(risk_level), body_style),
        ],
    ]

    metadata_table = Table(
        metadata,
        colWidths=[
            25 * mm,
            55 * mm,
            25 * mm,
            60 * mm,
        ],
    )

    metadata_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, -1),
                    colors.HexColor("#F8FAFC"),
                ),
                (
                    "BOX",
                    (0, 0),
                    (-1, -1),
                    0.7,
                    colors.HexColor("#CBD5E1"),
                ),
                (
                    "INNERGRID",
                    (0, 0),
                    (-1, -1),
                    0.4,
                    colors.HexColor("#E2E8F0"),
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
            ]
        )
    )

    story.append(metadata_table)

    story.append(Spacer(1, 12))

    # ========================================================
    # Threat Intelligence
    # ========================================================

    story.append(
        Paragraph(
            "1. THREAT INTELLIGENCE",
            section_style,
        )
    )

    intelligence_data = [
        ["Field", "Value"],
        ["IP Address", clean_text(ip)],
        ["Country", clean_text(country)],
        ["Region", clean_text(region)],
        ["City", clean_text(city)],
        ["Organization", clean_text(organization)],
        ["Timezone", clean_text(timezone)],
    ]

    intelligence_table = Table(
        intelligence_data,
        colWidths=[45 * mm, 120 * mm],
        repeatRows=1,
    )

    intelligence_table.setStyle(
        TableStyle(
            [
                (
                    "BACKGROUND",
                    (0, 0),
                    (-1, 0),
                    colors.HexColor("#0F172A"),
                ),
                (
                    "TEXTCOLOR",
                    (0, 0),
                    (-1, 0),
                    colors.white,
                ),
                (
                    "FONTNAME",
                    (0, 0),
                    (-1, 0),
                    "Helvetica-Bold",
                ),
                (
                    "FONTNAME",
                    (0, 1),
                    (0, -1),
                    "Helvetica-Bold",
                ),
                (
                    "BACKGROUND",
                    (0, 1),
                    (0, -1),
                    colors.HexColor("#F1F5F9"),
                ),
                (
                    "GRID",
                    (0, 0),
                    (-1, -1),
                    0.5,
                    colors.HexColor("#CBD5E1"),
                ),
                (
                    "VALIGN",
                    (0, 0),
                    (-1, -1),
                    "MIDDLE",
                ),
                (
                    "LEFTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "RIGHTPADDING",
                    (0, 0),
                    (-1, -1),
                    8,
                ),
                (
                    "TOPPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
                (
                    "BOTTOMPADDING",
                    (0, 0),
                    (-1, -1),
                    6,
                ),
            ]
        )
    )

    story.append(intelligence_table)

    # ========================================================
    # AI Threat Assessment
    # ========================================================

    story.append(
        Paragraph(
            "2. AI THREAT ASSESSMENT",
            section_style,
        )
    )

    story.append(
        Paragraph(
            clean_text(threat_summary).replace(
                "\n",
                "<br/>",
            ),
            body_style,
        )
    )

    # ========================================================
    # Attack Possibilities
    # ========================================================

    story.append(
        Paragraph(
            "3. ATTACK POSSIBILITIES",
            section_style,
        )
    )

    story.append(
        Paragraph(
            clean_text(attack_possibilities).replace(
                "\n",
                "<br/>",
            ),
            body_style,
        )
    )

    # ========================================================
    # Recommended Actions
    # ========================================================

    story.append(
        Paragraph(
            "4. RECOMMENDED SECURITY ACTIONS",
            section_style,
        )
    )

    story.append(
        Paragraph(
            clean_text(recommended_actions).replace(
                "\n",
                "<br/>",
            ),
            body_style,
        )
    )

    # ========================================================
    # Full AI Analysis
    # ========================================================

    story.append(
        Paragraph(
            "5. COMPLETE AI ANALYSIS",
            section_style,
        )
    )

    story.append(
        Paragraph(
            clean_text(analysis).replace(
                "\n",
                "<br/>",
            ),
            body_style,
        )
    )

    # ========================================================
    # Disclaimer
    # ========================================================

    story.append(Spacer(1, 12))

    story.append(
        Table(
            [
                [
                    Paragraph(
                        "<b>Security Notice</b><br/>"
                        "This report is generated by SentinelX "
                        "for authorized cybersecurity analysis. "
                        "AI-generated assessments should be "
                        "validated by a qualified security analyst "
                        "before critical decisions are made.",
                        small_style,
                    )
                ]
            ],
            colWidths=[165 * mm],
            style=TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, -1),
                        colors.HexColor("#EFF6FF"),
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        0.7,
                        colors.HexColor("#93C5FD"),
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        8,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        8,
                    ),
                ]
            ),
        )
    )

    # --------------------------------------------------------
    # Build PDF
    # --------------------------------------------------------

    doc.build(
        story,
        onFirstPage=add_page_footer,
        onLaterPages=add_page_footer,
    )

    return filename