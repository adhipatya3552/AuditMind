import os
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

pdf_filename = "sample-contract.pdf"
doc = SimpleDocTemplate(
    pdf_filename,
    pagesize=letter,
    rightMargin=54,
    leftMargin=54,
    topMargin=54,
    bottomMargin=54
)

styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'ContractTitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=16,
    leading=20,
    textColor=colors.HexColor('#0F172A'),
    alignment=1,
    spaceAfter=10
)

subtitle_style = ParagraphStyle(
    'ContractSubtitle',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=15,
    textColor=colors.HexColor('#475569'),
    alignment=1,
    spaceAfter=15
)

section_heading = ParagraphStyle(
    'SectionHeading',
    parent=styles['Normal'],
    fontName='Helvetica-Bold',
    fontSize=12,
    leading=16,
    textColor=colors.HexColor('#1E293B'),
    spaceBefore=12,
    spaceAfter=6
)

body_style = ParagraphStyle(
    'BodyText',
    parent=styles['Normal'],
    fontName='Helvetica',
    fontSize=9.5,
    leading=14,
    textColor=colors.HexColor('#334155'),
    spaceAfter=8
)

clause_highlight_style = ParagraphStyle(
    'ClauseHighlight',
    parent=styles['Normal'],
    fontName='Helvetica-Oblique',
    fontSize=9.5,
    leading=14,
    textColor=colors.HexColor('#1E293B'),
    spaceAfter=8,
    leftIndent=15
)

elements = []

elements.append(Paragraph("MASTER SAAS SUBSCRIPTION AGREEMENT", title_style))
elements.append(Paragraph("Agreement Reference: BS-2025-8849A &bull; Effective Date: October 1, 2025", subtitle_style))
elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#CBD5E1'), spaceAfter=15))

p1 = ("This Master SaaS Subscription Agreement (\"Agreement\") is entered into as of October 1, 2025 (\"Effective Date\"), "
      "by and between <b>BrightSoft Ltd</b>, a company registered under the laws of Delaware with offices at 100 Technology Plaza, San Francisco, CA 94105 (\"Vendor\"), "
      "and the subscriber customer entering into this Agreement (\"Customer\").")
elements.append(Paragraph(p1, body_style))

elements.append(Paragraph("1. Services and Scope", section_heading))
p2 = ("Vendor agrees to provide Customer access to its cloud-based project management software application (\"Service\") "
      "for up to fifteen (15) authorized user seats. Customer shall pay a monthly subscription fee of $89 per user seat, "
      "billed annually in advance (~$16,020 per annum, total term value approximately $32,040).")
elements.append(Paragraph(p2, body_style))

elements.append(Paragraph("2. Term and Auto-Renewal", section_heading))
p3 = ("The initial term of this Agreement shall be twenty-four (24) months starting from the Effective Date. "
      "<b>Section 2.2 (Automatic Renewal):</b> This Agreement shall automatically renew for successive twelve-month periods "
      "unless either party provides written notice of non-renewal at least sixty (60) days prior to the end of the then-current term.")
elements.append(Paragraph(p3, body_style))

elements.append(Paragraph("3. Price Adjustments", section_heading))
p4 = ("Vendor reserves the right to modify subscription fees and pricing models. "
      "<b>Section 3.4 (Fee Modification):</b> Vendor may adjust pricing upon thirty (30) days' written notice, "
      "and continued use after such notice constitutes acceptance of the new pricing.")
elements.append(Paragraph(p4, body_style))

elements.append(Paragraph("4. Service Access and Suspension", section_heading))
p5 = ("Customer agrees to comply with all acceptable use policies established by Vendor. "
      "<b>Section 4.1 (Suspension Right):</b> Vendor may suspend access to the Service if Customer breaches this Agreement "
      "or if Vendor determines, in its sole discretion, that Customer's use poses a risk.")
elements.append(Paragraph(p5, body_style))

elements.append(Paragraph("5. Limitation of Liability", section_heading))
p6 = ("TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE PARTIES AGREE TO LIMIT LIABILITY AS FOLLOWS: "
      "<b>Section 5.3 (Aggregate Cap):</b> In no event shall either party's aggregate liability exceed the total fees paid "
      "by Customer in the three (3) months preceding the claim. Neither party shall be liable for indirect, incidental, or consequential damages.")
elements.append(Paragraph(p6, body_style))

elements.append(Paragraph("6. Data Return and Termination Handling", section_heading))
p7 = ("Upon termination of this Agreement for any reason, Vendor will handle stored Customer data in accordance with standard operating procedures. "
      "<b>Section 6.2 (Data Handling):</b> Upon termination, Vendor shall return or delete Customer Data within a reasonable period.")
elements.append(Paragraph(p7, body_style))

elements.append(Paragraph("7. General Provisions", section_heading))
p8 = ("This Agreement constitutes the entire understanding between BrightSoft Ltd and Customer regarding the subject matter herein. "
      "This Agreement shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law principles.")
elements.append(Paragraph(p8, body_style))

elements.append(Spacer(1, 20))

sig_data = [
    [Paragraph("<b>BrightSoft Ltd (Vendor)</b>", body_style), Paragraph("<b>Customer</b>", body_style)],
    [Paragraph("By: ________________________", body_style), Paragraph("By: ________________________", body_style)],
    [Paragraph("Name: Sarah Jenkins", body_style), Paragraph("Name: ________________________", body_style)],
    [Paragraph("Title: VP of Commercial Sales", body_style), Paragraph("Title: ________________________", body_style)],
    [Paragraph("Date: October 1, 2025", body_style), Paragraph("Date: ________________________", body_style)]
]
t = Table(sig_data, colWidths=[250, 250])
t.setStyle(TableStyle([
    ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))
elements.append(t)

doc.build(elements)
print(f"Successfully generated {pdf_filename} with size {os.path.getsize(pdf_filename)} bytes")
