from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Paragraph
from reportlab.lib.styles import getSampleStyleSheet
import os
import uuid


def generate_report(ip: str, analysis: str):

    os.makedirs("reports", exist_ok=True)

    filename = f"reports/{uuid.uuid4()}.pdf"

    doc = SimpleDocTemplate(filename, pagesize=A4)

    styles = getSampleStyleSheet()

    story = []

    story.append(Paragraph("<b>SentinelX Threat Intelligence Report</b>", styles["Title"]))

    story.append(Paragraph("<br/><b>IP Address</b>", styles["Heading2"]))
    story.append(Paragraph(ip, styles["BodyText"]))

    story.append(Paragraph("<br/><b>AI Threat Analysis</b>", styles["Heading2"]))
    story.append(Paragraph(analysis.replace("\n", "<br/>"), styles["BodyText"]))

    doc.build(story)

    return filename