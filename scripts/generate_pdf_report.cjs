#!/usr/bin/env node
/**
 * Marketing Report PDF Generator (Node.js / PDFKit)
 * Usage: node scripts/generate_pdf_report.js <data.json> <output.pdf>
 */

const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// ---------- Colors ----------
const C = {
  navy:      '#1B2A4A',
  blue:      '#2D5BFF',
  orange:    '#FF6B35',
  green:     '#00C853',
  amber:     '#FFB300',
  red:       '#FF1744',
  lightGray: '#F5F7FA',
  bodyText:  '#2C3E50',
  secondary: '#7F8C9B',
  border:    '#E0E6ED',
  white:     '#FFFFFF',
  purple:    '#7C3AED',
};

function scoreColor(s) {
  if (s >= 80) return C.green;
  if (s >= 60) return C.blue;
  if (s >= 40) return C.amber;
  return C.red;
}

function scoreGrade(s) {
  if (s >= 90) return 'A+';
  if (s >= 80) return 'A';
  if (s >= 70) return 'B';
  if (s >= 60) return 'C';
  if (s >= 50) return 'D';
  return 'F';
}

function severityColor(sev) {
  const m = { 'Critical': C.red, 'High': C.orange, 'Medium': C.amber, 'Low': C.blue };
  return m[sev] || C.secondary;
}

// ---------- Helpers ----------
function rect(doc, x, y, w, h, color, radius = 0) {
  doc.save().fillColor(color).roundedRect(x, y, w, h, radius).fill().restore();
}

function line(doc, x1, y1, x2, y2, color, width = 0.5) {
  doc.save().strokeColor(color).lineWidth(width).moveTo(x1, y1).lineTo(x2, y2).stroke().restore();
}

function headerBar(doc, text, y) {
  const pageW = doc.page.width;
  const margin = 50;
  rect(doc, margin, y, pageW - margin * 2, 28, C.navy, 4);
  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(11)
     .text(text, margin + 10, y + 8, { width: pageW - margin * 2 - 20 });
  return y + 38;
}

function scoreBar(doc, label, score, x, y, barW) {
  const trackH = 12;
  const filled = Math.round((score / 100) * barW);
  const color = scoreColor(score);

  doc.fillColor(C.bodyText).font('Helvetica').fontSize(9).text(label, x, y, { width: 160 });
  rect(doc, x + 165, y + 1, barW, trackH, C.border, 3);
  if (filled > 0) rect(doc, x + 165, y + 1, filled, trackH, color, 3);
  doc.fillColor(color).font('Helvetica-Bold').fontSize(9)
     .text(`${score}`, x + 165 + barW + 6, y + 1);
  return y + 22;
}

// ---------- Pages ----------
function drawCover(doc, data) {
  const pageW = doc.page.width;
  const margin = 50;
  const cx = pageW / 2;

  // Top accent bar
  rect(doc, 0, 0, pageW, 8, C.purple);

  // Title area
  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(28)
     .text('Marketing Audit Report', margin, 60, { align: 'center', width: pageW - margin * 2 });

  doc.fillColor(C.secondary).font('Helvetica').fontSize(11)
     .text(data.url, margin, 96, { align: 'center', width: pageW - margin * 2 });

  doc.fillColor(C.secondary).font('Helvetica').fontSize(10)
     .text(data.date, margin, 112, { align: 'center', width: pageW - margin * 2 });

  line(doc, margin, 134, pageW - margin, 134, C.border);

  // Score gauge (drawn with arcs via SVG-path style)
  const gaugeY = 170;
  const radius = 70;
  const score = data.overall_score;
  const color = scoreColor(score);
  const grade = scoreGrade(score);

  // Background arc circle
  doc.save()
     .circle(cx, gaugeY + radius, radius)
     .lineWidth(14).strokeColor(C.border).stroke()
     .restore();

  // Filled arc (approximate with PDF arc)
  const startAngle = -Math.PI;
  const endAngle = startAngle + (score / 100) * 2 * Math.PI;
  doc.save()
     .lineWidth(14)
     .strokeColor(color)
     .arc(cx, gaugeY + radius, radius, startAngle, endAngle)
     .stroke()
     .restore();

  // Score text inside
  doc.fillColor(color).font('Helvetica-Bold').fontSize(38)
     .text(String(score), cx - 30, gaugeY + radius - 22, { width: 60, align: 'center' });
  doc.fillColor(C.secondary).font('Helvetica').fontSize(10)
     .text('/ 100', cx - 20, gaugeY + radius + 18, { width: 40, align: 'center' });

  // Grade badge
  rect(doc, cx + radius + 12, gaugeY + radius - 18, 44, 36, color, 6);
  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(20)
     .text(grade, cx + radius + 12, gaugeY + radius - 12, { width: 44, align: 'center' });

  // Executive summary box
  const sumY = gaugeY + radius * 2 + 30;
  rect(doc, margin, sumY, pageW - margin * 2, 4, C.purple, 2);
  rect(doc, margin, sumY + 4, pageW - margin * 2, 100, C.lightGray, 4);

  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(11)
     .text('Sumario Executivo', margin + 14, sumY + 16);
  doc.fillColor(C.bodyText).font('Helvetica').fontSize(9.5)
     .text(data.executive_summary, margin + 14, sumY + 32,
           { width: pageW - margin * 2 - 28, lineGap: 3 });

  // Footer
  doc.fillColor(C.secondary).font('Helvetica').fontSize(8)
     .text('Gerado por AI Marketing Suite | Claude Code', margin, doc.page.height - 40,
           { align: 'center', width: pageW - margin * 2 });
}

function drawScores(doc, data) {
  const pageW = doc.page.width;
  const margin = 50;
  const barW = 200;

  doc.addPage();
  rect(doc, 0, 0, pageW, 8, C.purple);

  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(20)
     .text('Pontuacao por Categoria', margin, 40);
  line(doc, margin, 66, pageW - margin, 66, C.border);

  let y = 80;
  const cats = Object.entries(data.categories);

  // Bar chart section
  y = headerBar(doc, 'Grafico de Desempenho', y);

  cats.forEach(([name, info]) => {
    y = scoreBar(doc, name, info.score, margin, y, barW);
  });

  y += 16;

  // Table section
  y = headerBar(doc, 'Tabela de Pontuacao', y);

  const colW = [200, 60, 60, 110];
  const headers = ['Categoria', 'Pontuacao', 'Peso', 'Status'];
  const tableX = margin;

  // Table header row
  rect(doc, tableX, y, pageW - margin * 2, 22, '#EEF2FF', 0);
  headers.forEach((h, i) => {
    const x = tableX + colW.slice(0, i).reduce((a, b) => a + b, 0);
    doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(9).text(h, x + 6, y + 7);
  });
  y += 22;

  cats.forEach(([name, info], idx) => {
    const rowColor = idx % 2 === 0 ? C.white : C.lightGray;
    rect(doc, tableX, y, pageW - margin * 2, 20, rowColor, 0);

    const color = scoreColor(info.score);
    const statuses = { green: 'Forte', blue: 'Adequado', amber: 'Atencao', red: 'Critico' };
    const statusKey = info.score >= 80 ? 'green' : info.score >= 60 ? 'blue' : info.score >= 40 ? 'amber' : 'red';
    const status = statuses[statusKey];

    const vals = [name, String(info.score), info.weight, status];
    vals.forEach((v, i) => {
      const x = tableX + colW.slice(0, i).reduce((a, b) => a + b, 0);
      if (i === 3) {
        rect(doc, x + 4, y + 4, 80, 13, color, 3);
        doc.fillColor(C.white).font('Helvetica-Bold').fontSize(8).text(v, x + 4, y + 6, { width: 80, align: 'center' });
      } else {
        const fc = i === 1 ? color : C.bodyText;
        const fw = i === 1 ? 'Helvetica-Bold' : 'Helvetica';
        doc.fillColor(fc).font(fw).fontSize(9).text(v, x + 6, y + 6);
      }
    });
    y += 20;
  });

  // Score legend
  y += 20;
  const legend = [
    { color: C.green, label: '80-100  Forte' },
    { color: C.blue, label: '60-79   Adequado' },
    { color: C.amber, label: '40-59   Atencao' },
    { color: C.red, label: '0-39    Critico' },
  ];
  doc.fillColor(C.secondary).font('Helvetica-Bold').fontSize(8).text('Legenda:', margin, y);
  y += 14;
  legend.forEach((l, i) => {
    const lx = margin + i * 115;
    rect(doc, lx, y, 10, 10, l.color, 2);
    doc.fillColor(C.bodyText).font('Helvetica').fontSize(8).text(l.label, lx + 14, y + 1);
  });
}

function drawFindings(doc, data) {
  const pageW = doc.page.width;
  const margin = 50;

  doc.addPage();
  rect(doc, 0, 0, pageW, 8, C.purple);

  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(20)
     .text('Principais Descobertas', margin, 40);
  line(doc, margin, 66, pageW - margin, 66, C.border);

  let y = 80;
  y = headerBar(doc, 'Problemas Identificados (por Prioridade)', y);

  data.findings.forEach((f) => {
    const sColor = severityColor(f.severity);

    // Check if we need a new page
    if (y > doc.page.height - 80) {
      doc.addPage();
      rect(doc, 0, 0, pageW, 8, C.purple);
      y = 40;
    }

    rect(doc, margin, y, pageW - margin * 2, 4, sColor, 2);
    rect(doc, margin, y + 4, pageW - margin * 2, 38, '#FAFBFF', 0);

    // Severity badge
    rect(doc, margin + 8, y + 10, 58, 16, sColor, 3);
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(8)
       .text(f.severity, margin + 8, y + 14, { width: 58, align: 'center' });

    // Finding text
    doc.fillColor(C.bodyText).font('Helvetica').fontSize(9)
       .text(f.finding, margin + 80, y + 10, { width: pageW - margin * 2 - 96, lineGap: 2 });

    y += 50;
  });
}

function drawActionPlan(doc, data) {
  const pageW = doc.page.width;
  const margin = 50;

  doc.addPage();
  rect(doc, 0, 0, pageW, 8, C.purple);

  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(20)
     .text('Plano de Acao Priorizado', margin, 40);
  line(doc, margin, 66, pageW - margin, 66, C.border);

  let y = 80;

  const sections = [
    { title: 'Quick Wins — Esta Semana', items: data.quick_wins, color: C.green, icon: '>>>' },
    { title: 'Medio Prazo — 1-3 Meses', items: data.medium_term, color: C.blue, icon: '>>>' },
    { title: 'Estrategico — 3-6 Meses', items: data.strategic, color: C.purple, icon: '>>>' },
  ];

  sections.forEach((section) => {
    if (y > doc.page.height - 120) {
      doc.addPage();
      rect(doc, 0, 0, pageW, 8, C.purple);
      y = 40;
    }

    y = headerBar(doc, section.title, y);

    section.items.forEach((item, i) => {
      if (y > doc.page.height - 60) {
        doc.addPage();
        rect(doc, 0, 0, pageW, 8, C.purple);
        y = 40;
      }

      rect(doc, margin, y, 22, 22, section.color, 11);
      doc.fillColor(C.white).font('Helvetica-Bold').fontSize(9)
         .text(String(i + 1), margin, y + 7, { width: 22, align: 'center' });

      const textH = doc.heightOfString(item, { width: pageW - margin * 2 - 36, lineGap: 2, fontSize: 9 });
      const rowH = Math.max(28, textH + 12);

      rect(doc, margin + 26, y, pageW - margin * 2 - 26, rowH, i % 2 === 0 ? C.lightGray : C.white, 3);
      doc.fillColor(C.bodyText).font('Helvetica').fontSize(9)
         .text(item, margin + 34, y + (rowH - textH) / 2,
               { width: pageW - margin * 2 - 50, lineGap: 2 });

      y += rowH + 4;
    });

    y += 14;
  });
}

function drawCompetitors(doc, data) {
  if (!data.competitors || data.competitors.length === 0) return;

  const pageW = doc.page.width;
  const margin = 50;

  doc.addPage();
  rect(doc, 0, 0, pageW, 8, C.purple);

  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(20)
     .text('Analise Competitiva', margin, 40);
  line(doc, margin, 66, pageW - margin, 66, C.border);

  let y = 80;
  y = headerBar(doc, 'Comparativo de Mercado', y);

  const numCols = data.competitors.length + 1;
  const tableW = pageW - margin * 2;
  const colW = tableW / numCols;
  const rows = ['positioning', 'pricing', 'social_proof', 'content'];
  const rowLabels = { positioning: 'Posicionamento', pricing: 'Preco', social_proof: 'Prova Social', content: 'Conteudo' };

  // Header row
  rect(doc, margin, y, tableW, 24, C.navy, 0);
  doc.fillColor(C.white).font('Helvetica-Bold').fontSize(9)
     .text(data.brand_name, margin + 6, y + 8, { width: colW - 10 });
  data.competitors.forEach((comp, i) => {
    doc.fillColor(C.white).font('Helvetica-Bold').fontSize(9)
       .text(comp.name, margin + colW * (i + 1) + 6, y + 8, { width: colW - 10 });
  });
  y += 24;

  rows.forEach((row, ri) => {
    const rowH = 36;
    const bgColor = ri % 2 === 0 ? C.lightGray : C.white;
    rect(doc, margin, y, tableW, rowH, bgColor, 0);

    // Row label in first cell
    doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(8)
       .text(rowLabels[row], margin + 6, y + 4, { width: colW - 10 });
    doc.fillColor(C.bodyText).font('Helvetica').fontSize(7.5)
       .text('(nosso site)', margin + 6, y + 14, { width: colW - 10 });

    // Competitor cells
    data.competitors.forEach((comp, i) => {
      const val = comp[row] || '-';
      doc.fillColor(C.bodyText).font('Helvetica').fontSize(8)
         .text(val, margin + colW * (i + 1) + 6, y + 8,
               { width: colW - 12, lineGap: 1 });
    });

    // Grid lines
    for (let ci = 1; ci <= numCols; ci++) {
      line(doc, margin + colW * ci, y, margin + colW * ci, y + rowH, C.border, 0.5);
    }
    line(doc, margin, y + rowH, margin + tableW, y + rowH, C.border, 0.5);

    y += rowH;
  });
}

function drawMethodology(doc) {
  const pageW = doc.page.width;
  const margin = 50;

  doc.addPage();
  rect(doc, 0, 0, pageW, 8, C.purple);

  doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(20)
     .text('Metodologia', margin, 40);
  line(doc, margin, 66, pageW - margin, 66, C.border);

  let y = 80;
  y = headerBar(doc, 'Como as Pontuacoes sao Calculadas', y);

  const items = [
    { cat: 'Content & Messaging (25%)', desc: 'Qualidade da copy, proposta de valor, clareza do headline, voz da marca.' },
    { cat: 'Conversion Optimization (20%)', desc: 'Prova social, design de formulario, posicionamento do CTA, urgencia.' },
    { cat: 'SEO & Discoverability (20%)', desc: 'Title tags, meta descriptions, headers, schema, velocidade.' },
    { cat: 'Competitive Positioning (15%)', desc: 'Diferenciacao, clareza de preco, consciencia de mercado.' },
    { cat: 'Brand & Trust (10%)', desc: 'Qualidade do design, badges de confianca, aparencia profissional.' },
    { cat: 'Growth & Strategy (10%)', desc: 'Captura de leads, estrategia de conteudo, canais de aquisicao.' },
  ];

  items.forEach((item) => {
    rect(doc, margin, y, pageW - margin * 2, 36, C.lightGray, 4);
    doc.fillColor(C.navy).font('Helvetica-Bold').fontSize(9)
       .text(item.cat, margin + 10, y + 8);
    doc.fillColor(C.bodyText).font('Helvetica').fontSize(8.5)
       .text(item.desc, margin + 10, y + 20, { width: pageW - margin * 2 - 20 });
    y += 44;
  });

  y += 10;
  doc.fillColor(C.secondary).font('Helvetica').fontSize(8)
     .text('Gerado por AI Marketing Suite for Claude Code', margin, y, { align: 'center', width: pageW - margin * 2 });
}

// ---------- Main ----------
function main() {
  const args = process.argv.slice(2);
  const jsonFile = args[0];
  const outFile = args[1] || 'MARKETING-REPORT-sample.pdf';

  if (!jsonFile) {
    console.error('Usage: node scripts/generate_pdf_report.js <data.json> <output.pdf>');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(jsonFile, 'utf8'));

  const doc = new PDFDocument({ size: 'A4', margins: { top: 50, bottom: 50, left: 50, right: 50 } });
  const stream = fs.createWriteStream(outFile);
  doc.pipe(stream);

  drawCover(doc, data);
  drawScores(doc, data);
  drawFindings(doc, data);
  drawActionPlan(doc, data);
  drawCompetitors(doc, data);
  drawMethodology(doc);

  doc.end();

  stream.on('finish', () => {
    const stats = fs.statSync(outFile);
    const kb = Math.round(stats.size / 1024);
    console.log(`PDF gerado: ${outFile} (${kb} KB)`);
  });
}

main();
