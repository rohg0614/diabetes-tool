from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, 
    TableStyle, HRFlowable, PageBreak
)
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.graphics.charts.lineplots import LinePlot
from reportlab.graphics import renderPDF
from sqlalchemy.orm import Session
from backend.models.models import (
    PatientProfile, GlucoseLog, GlucoseEpisode,
    Medication, MedicationAdherence, User
)
from datetime import datetime, timedelta
from typing import Optional
import io

# ============================================================
# Color Palette
# ============================================================

BLUE = colors.HexColor('#1a73e8')
DARK = colors.HexColor('#1a1a2e')
RED = colors.HexColor('#d32f2f')
ORANGE = colors.HexColor('#f57c00')
GREEN = colors.HexColor('#2e7d32')
LIGHT_GRAY = colors.HexColor('#f5f5f5')
MID_GRAY = colors.HexColor('#e0e0e0')
TEXT_GRAY = colors.HexColor('#666666')

# ============================================================
# Styles
# ============================================================

def get_styles():
    styles = getSampleStyleSheet()

    styles.add(ParagraphStyle(
        name='ReportTitle',
        fontSize=22,
        fontName='Helvetica-Bold',
        textColor=DARK,
        spaceAfter=4
    ))
    styles.add(ParagraphStyle(
        name='SectionHeader',
        fontSize=13,
        fontName='Helvetica-Bold',
        textColor=BLUE,
        spaceBefore=16,
        spaceAfter=6
    ))
    styles.add(ParagraphStyle(
        name='SubHeader',
        fontSize=10,
        fontName='Helvetica-Bold',
        textColor=DARK,
        spaceAfter=4
    ))
    styles.add(ParagraphStyle(
        name='Body',
        fontSize=9,
        fontName='Helvetica',
        textColor=colors.black,
        spaceAfter=4
    ))
    styles.add(ParagraphStyle(
        name='Caption',
        fontSize=8,
        fontName='Helvetica',
        textColor=TEXT_GRAY,
        spaceAfter=2
    ))
    styles.add(ParagraphStyle(
        name='Disclaimer',
        fontSize=7,
        fontName='Helvetica-Oblique',
        textColor=TEXT_GRAY,
        spaceAfter=2
    ))
    return styles

# ============================================================
# Helper — Metric Table
# ============================================================

def metric_table(data: list, col_widths=None):
    style = TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), BLUE),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 9),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 9),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_GRAY]),
        ('GRID', (0, 0), (-1, -1), 0.5, MID_GRAY),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
    ])
    t = Table(data, colWidths=col_widths)
    t.setStyle(style)
    return t

# ============================================================
# Report Generator
# ============================================================

def generate_patient_report(
    db: Session,
    user: User,
    patient: PatientProfile,
    days: int = 30
) -> bytes:

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=1.8*cm,
        leftMargin=1.8*cm,
        topMargin=2*cm,
        bottomMargin=2*cm
    )

    styles = get_styles()
    story = []
    W = A4[0] - 3.6*cm  # usable width

    since = datetime.utcnow() - timedelta(days=days)

    # --------------------------------------------------------
    # Header
    # --------------------------------------------------------
    story.append(Paragraph("Diabetes Management Report", styles['ReportTitle']))
    story.append(Spacer(1, 6))
    story.append(Paragraph(
        f"Generated: {datetime.utcnow().strftime('%B %d, %Y at %H:%M UTC')}",
        styles['Caption']
    ))
    story.append(Spacer(1, 4))
    story.append(HRFlowable(width=W, thickness=2, color=BLUE, spaceAfter=12))
    
    # --------------------------------------------------------
    # Patient Information
    # --------------------------------------------------------
    story.append(Paragraph("Patient Information", styles['SectionHeader']))

    dob = patient.date_of_birth.strftime('%B %d, %Y') if patient.date_of_birth else 'N/A'
    bmi = round(patient.weight_kg / ((patient.height_cm/100)**2), 1) \
          if patient.weight_kg and patient.height_cm else 'N/A'

    patient_data = [
        ['Field', 'Value', 'Field', 'Value'],
        ['Full Name', user.full_name, 
         'Diabetes Type', patient.diabetes_type.value.replace('_', ' ').title()],
        ['Date of Birth', dob, 
         'Gender', patient.gender.title()],
        ['Weight', f"{patient.weight_kg} kg" if patient.weight_kg else 'N/A',
         'Height', f"{patient.height_cm} cm" if patient.height_cm else 'N/A'],
        ['BMI', str(bmi),
         'Attending Physician', patient.doctor_name or 'N/A'],
        ['Target Glucose Min', f"{patient.target_glucose_min} mg/dL",
         'Target Glucose Max', f"{patient.target_glucose_max} mg/dL"],
    ]
    story.append(metric_table(patient_data, 
                              col_widths=[W*0.2, W*0.3, W*0.2, W*0.3]))
    story.append(Spacer(1, 12))

    # --------------------------------------------------------
    # Glucose Summary
    # --------------------------------------------------------
    story.append(Paragraph(
        f"Glucose Summary — Last {days} Days", styles['SectionHeader']
    ))

    logs = db.query(GlucoseLog).filter(
        GlucoseLog.patient_id == patient.id,
        GlucoseLog.logged_at >= since
    ).order_by(GlucoseLog.logged_at.desc()).all()

    if logs:
        values = [l.glucose_value for l in logs]
        avg = round(sum(values)/len(values), 1)
        high = max(values)
        low = min(values)
        in_range = sum(
            1 for v in values 
            if patient.target_glucose_min <= v <= patient.target_glucose_max
        )
        time_in_range = round(in_range/len(values)*100, 1)

        # Estimated HbA1c (Nathan formula)
        hba1c_est = round((avg + 46.7) / 28.7, 1)

        summary_data = [
            ['Metric', 'Value', 'Metric', 'Value'],
            ['Total Readings', str(len(logs)),
             'Average Glucose', f"{avg} mg/dL"],
            ['Highest Reading', f"{high} mg/dL",
             'Lowest Reading', f"{low} mg/dL"],
            ['Time in Range', f"{time_in_range}%",
             'Est. HbA1c*', f"{hba1c_est}%"],
        ]
        story.append(metric_table(summary_data,
                                  col_widths=[W*0.2, W*0.3, W*0.2, W*0.3]))
        story.append(Spacer(1, 4))
        story.append(Paragraph(
            "* Estimated HbA1c is a mathematical approximation based on average glucose. "
            "It is not a substitute for a laboratory HbA1c test.",
            styles['Disclaimer']
        ))
        story.append(Spacer(1, 8))

        # Glucose readings table
        story.append(Paragraph("Recent Glucose Readings", styles['SubHeader']))
        reading_data = [['Date', 'Time', 'Value (mg/dL)', 'Context', 'Notes']]
        for log in logs[:20]:  # last 20 readings
            status = ''
            if log.glucose_value < patient.target_glucose_min:
                status = ' (LOW)'
            elif log.glucose_value > patient.target_glucose_max:
                status = ' (HIGH)'
            reading_data.append([
                log.logged_at.strftime('%Y-%m-%d'),
                log.logged_at.strftime('%H:%M'),
                f"{log.glucose_value}{status}",
                log.context.value.replace('_', ' ').title(),
                (log.notes or '')[:40]
            ])

        t = Table(reading_data, 
                  colWidths=[W*0.15, W*0.1, W*0.2, W*0.2, W*0.35])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), BLUE),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 8),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, LIGHT_GRAY]),
            ('GRID', (0, 0), (-1, -1), 0.5, MID_GRAY),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
            ('LEFTPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(t)
    else:
        story.append(Paragraph("No glucose readings recorded in this period.", 
                               styles['Body']))

    story.append(Spacer(1, 12))

    # --------------------------------------------------------
    # Episodes
    # --------------------------------------------------------
    story.append(Paragraph(
        f"Glucose Episodes — Last {days} Days", styles['SectionHeader']
    ))

    episodes = db.query(GlucoseEpisode).filter(
        GlucoseEpisode.patient_id == patient.id,
        GlucoseEpisode.occurred_at >= since
    ).order_by(GlucoseEpisode.occurred_at.desc()).all()

    if episodes:
        hypo = [e for e in episodes if e.episode_type.value == 'hypoglycemia']
        hyper = [e for e in episodes if e.episode_type.value == 'hyperglycemia']

        ep_summary = [
            ['Episode Type', 'Count', 'Most Recent', 'Worst Severity'],
            [
                'Hypoglycemia (Low)',
                str(len(hypo)),
                hypo[0].occurred_at.strftime('%Y-%m-%d') if hypo else 'None',
                max((e.severity for e in hypo), default='None')
            ],
            [
                'Hyperglycemia (High)',
                str(len(hyper)),
                hyper[0].occurred_at.strftime('%Y-%m-%d') if hyper else 'None',
                max((e.severity for e in hyper), default='None')
            ],
        ]
        story.append(metric_table(ep_summary,
                                  col_widths=[W*0.3, W*0.15, W*0.25, W*0.3]))
    else:
        story.append(Paragraph(
            "No episodes detected in this period. Glucose levels remained within target range.",
            styles['Body']
        ))

    story.append(Spacer(1, 12))

    # --------------------------------------------------------
    # Medications & Adherence
    # --------------------------------------------------------
    story.append(Paragraph("Medications & Adherence", styles['SectionHeader']))

    meds = db.query(Medication).filter(
        Medication.patient_id == patient.id,
        Medication.is_active == True
    ).all()

    if meds:
        med_data = [['Medication', 'Dosage', 'Frequency', 
                     'Scheduled', 'Adherence Rate']]
        for med in meds:
            total = db.query(MedicationAdherence).filter(
                MedicationAdherence.medication_id == med.id
            ).count()
            taken = db.query(MedicationAdherence).filter(
                MedicationAdherence.medication_id == med.id,
                MedicationAdherence.was_taken == True
            ).count()
            rate = f"{round(taken/total*100, 1)}%" if total > 0 else "No data"
            med_data.append([
                med.name,
                med.dosage,
                med.frequency,
                med.scheduled_time or 'N/A',
                rate
            ])
        story.append(metric_table(med_data,
                                  col_widths=[W*0.2, W*0.15, W*0.2, 
                                              W*0.2, W*0.25]))
    else:
        story.append(Paragraph("No active medications recorded.", styles['Body']))

    story.append(Spacer(1, 16))

    # --------------------------------------------------------
    # Footer Disclaimer
    # --------------------------------------------------------
    story.append(HRFlowable(width=W, thickness=1, color=MID_GRAY, spaceAfter=8))
    story.append(Paragraph(
        "IMPORTANT DISCLAIMER: This report is generated by an AI-assisted diabetes "
        "management platform for informational purposes only. It does not constitute "
        "medical advice, diagnosis, or treatment. All clinical decisions should be "
        "made in consultation with a qualified healthcare professional. Estimated "
        "HbA1c values are mathematical approximations and are not equivalent to "
        "laboratory results.",
        styles['Disclaimer']
    ))
    story.append(Paragraph(
        f"Report Period: Last {days} days | "
        f"Generated: {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')} | "
        f"Platform Version: 1.0.0",
        styles['Caption']
    ))

    doc.build(story)
    buffer.seek(0)
    return buffer.getvalue()