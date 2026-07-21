"""Generate the synthetic COA PDF used for browser extraction testing."""

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "examples" / "illustrative-coa.pdf"


def main() -> None:
    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        rightMargin=0.7 * inch,
        leftMargin=0.7 * inch,
        topMargin=0.65 * inch,
        bottomMargin=0.65 * inch,
        title="Illustrative Flower Spectrum COA",
    )
    story = [
        Paragraph("Illustrative Certificate of Analysis", styles["Title"]),
        Paragraph("Synthetic format fixture - not a real laboratory result", styles["BodyText"]),
        Spacer(1, 0.25 * inch),
        Paragraph("Sample: FS-COA-PDF-001 &nbsp;&nbsp; Product: Illustrative Flower", styles["BodyText"]),
        Spacer(1, 0.25 * inch),
    ]
    data = [
        ["Analyte", "LOD", "LOQ", "Result (%)"],
        ["Beta-Caryophyllene", "0.003", "0.010", "0.740"],
        ["D-Limonene", "0.003", "0.010", "0.610"],
        ["Beta-Myrcene", "0.003", "0.010", "0.420"],
        ["Alpha-Humulene", "0.003", "0.010", "0.240"],
        ["Linalool", "0.003", "0.010", "0.180"],
        ["(E)-Beta-Ocimene", "0.003", "0.010", "0.090"],
        ["trans-Nerolidol", "0.003", "0.010", "0.070"],
        ["1,8-Cineole", "0.003", "0.010", "0.050"],
        ["Caryophyllene Oxide", "0.003", "0.010", "0.040"],
        ["Total Terpenes", "", "", "3.040"],
    ]
    table = Table(data, colWidths=[3.05 * inch, 0.8 * inch, 0.8 * inch, 1.25 * inch])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#20201d")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("ALIGN", (1, 1), (-1, -1), "RIGHT"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#B8B3A8")),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#F2F0EA")]),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    story.extend([table, Spacer(1, 0.2 * inch), Paragraph("Aroma classification input fixture only.", styles["BodyText"])])
    doc.build(story)


if __name__ == "__main__":
    main()
