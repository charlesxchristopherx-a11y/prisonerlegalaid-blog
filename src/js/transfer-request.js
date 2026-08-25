/* Writ Large — closer-to-home transfer request builder.
   Generates a BP-A0148-style Inmate Request to Staff plus a continuation page.
   Runs entirely in the browser. Nothing is transmitted unless the visitor
   supplies an email, in which case a lead is posted to the configured endpoint. */
(function () {
  'use strict';

  var LEAD_ENDPOINT = 'https://prisonerlegalaid.app.n8n.cloud/webhook/pla-transfer-lead';

  var M = 54;             // page margin, points (0.75in)
  var PW = 612, PH = 792; // US Letter
  var RIGHT = PW - M;
  var LINE = 13.2;

  function $(id) { return document.getElementById(id); }
  function val(id) { var e = $(id); return e ? e.value.trim() : ''; }

  function today() {
    var d = new Date();
    return String(d.getMonth() + 1).padStart(2, '0') + '/' +
           String(d.getDate()).padStart(2, '0') + '/' + d.getFullYear();
  }

  // ---- narrative assembled from the facts given. No claims are invented. ----
  function buildBody(d) {
    var p = [];

    var opener = 'I respectfully request consideration for a transfer to a facility closer to my ' +
      'primary residence in ' + d.home + '.';
    if (d.miles) {
      opener += ' This facility is approximately ' + d.miles +
        ' driving miles from that address.';
    }
    p.push(opener);

    p.push('Section 601 of the First Step Act amended 18 U.S.C. \u00A7 3621(b) to direct the Bureau ' +
      'to place a prisoner in a facility as close as practicable to the prisoner\u2019s primary ' +
      'residence, and to the extent practicable, within 500 driving miles of that residence, ' +
      'subject to bed availability, security designation, programmatic needs, medical and mental ' +
      'health needs, faith-based requests, the recommendations of the sentencing court, and the ' +
      'Bureau\u2019s other security concerns. The statute further directs the Bureau to consider ' +
      'transferring a prisoner to a facility closer to the primary residence. I understand this ' +
      'request is subject to each of those considerations and that the designation decision ' +
      'rests with the Bureau.');

    if (d.family) {
      p.push('Family circumstances. ' + d.family);
    }
    if (d.conduct) {
      p.push('Institutional conduct and programming. ' + d.conduct);
    }
    if (d.other) {
      p.push('Additional considerations. ' + d.other);
    }
    if (d.pref) {
      p.push('If a transfer can be accommodated, the following facilities would be substantially ' +
        'closer to my release residence, listed in order of preference: ' + d.pref + '. I am ' +
        'willing to be considered for any appropriate facility nearer to that address.');
    }

    p.push('I would appreciate the opportunity to discuss this with my Unit Team, and I am ' +
      'available to provide any further information or documentation that would assist in ' +
      'evaluating this request. Thank you for your time and consideration.');

    return p;
  }

  // ---- form rendering ----
  function hr(doc, y) {
    doc.setLineWidth(0.8).line(M, y, RIGHT, y);
    return y;
  }

  function labeled(doc, x, y, w, label, value) {
    doc.setFont('helvetica', 'normal').setFontSize(7.5);
    doc.text(label.toUpperCase(), x + 2, y + 8);
    doc.setFont('helvetica', 'bold').setFontSize(10.5);
    doc.text(doc.splitTextToSize(value || '', w - 6)[0] || '', x + 2, y + 22);
    doc.setLineWidth(0.5).line(x, y + 26, x + w, y + 26);
  }

  function generate(d) {
    var doc = new window.jspdf.jsPDF({ unit: 'pt', format: 'letter' });
    var y = M;

    // masthead
    doc.setFont('helvetica', 'bold').setFontSize(13);
    doc.text('INMATE REQUEST TO STAFF', PW / 2, y, { align: 'center' });
    y += 15;
    doc.setFont('helvetica', 'normal').setFontSize(8.5);
    doc.text('Federal Bureau of Prisons', PW / 2, y, { align: 'center' });
    y += 12;
    hr(doc, y);
    y += 6;

    // header grid
    var half = (RIGHT - M) / 2;
    labeled(doc, M, y, half - 8, 'To (Name and Title of Staff Member)', d.to);
    labeled(doc, M + half + 8, y, half - 8, 'Date', today());
    y += 34;
    labeled(doc, M, y, half - 8, 'From (Last Name, First, Middle Initial)', d.name);
    labeled(doc, M + half + 8, y, half - 8, 'Register Number', d.reg);
    y += 34;
    labeled(doc, M, y, half - 8, 'Work Assignment', d.work);
    labeled(doc, M + half + 8, y, half - 8, 'Unit', d.unit);
    y += 34;
    labeled(doc, M, y, RIGHT - M, 'Institution', d.fac);
    y += 40;

    // subject
    doc.setFont('helvetica', 'bold').setFontSize(9.5);
    doc.text('SUBJECT:', M, y);
    doc.setFont('helvetica', 'normal').setFontSize(10);
    var subj = doc.splitTextToSize(
      'Request for Closer-to-Home Transfer \u2014 18 U.S.C. \u00A7 3621(b)', RIGHT - M - 58);
    doc.text(subj, M + 58, y);
    y += 12 + (subj.length - 1) * 12;
    hr(doc, y);
    y += 20;

    // body, paginating
    var paras = buildBody(d);
    var pageNo = 1;

    function newPage() {
      doc.setFont('helvetica', 'italic').setFontSize(8);
      doc.text('Page ' + pageNo, PW / 2, PH - 34, { align: 'center' });
      doc.addPage();
      pageNo++;
      var ny = M;
      doc.setFont('helvetica', 'bold').setFontSize(9.5);
      doc.text('CONTINUATION \u2014 ' + (d.name || '') +
               (d.reg ? ', Reg. No. ' + d.reg : ''), M, ny);
      ny += 8;
      hr(doc, ny);
      return ny + 20;
    }

    doc.setFont('helvetica', 'normal').setFontSize(10.5);
    for (var i = 0; i < paras.length; i++) {
      var lines = doc.splitTextToSize(paras[i], RIGHT - M);
      for (var j = 0; j < lines.length; j++) {
        if (y > PH - 150) { y = newPage(); doc.setFont('helvetica', 'normal').setFontSize(10.5); }
        doc.text(lines[j], M, y);
        y += LINE;
      }
      y += 9;
    }

    // signature block
    if (y > PH - 130) { y = newPage(); }
    y += 22;
    doc.setLineWidth(0.6).line(M, y, M + 250, y);
    doc.line(RIGHT - 150, y, RIGHT, y);
    y += 11;
    doc.setFont('helvetica', 'normal').setFontSize(8.5);
    doc.text('Signature of Requesting Inmate', M, y);
    doc.text('Date', RIGHT - 150, y);
    y += 30;

    doc.setFont('helvetica', 'italic').setFontSize(7.5);
    var note = doc.splitTextToSize(
      'Prepared as a document-preparation service by Writ Large, a service of Prisoner Legal Aid ' +
      'LLC, at the request of the family. Not legal advice. No attorney-client relationship. ' +
      'Placement and transfer decisions rest with the Bureau of Prisons. Sign and date before ' +
      'submitting.', RIGHT - M);
    doc.text(note, M, y);

    doc.setFont('helvetica', 'italic').setFontSize(8);
    doc.text('Page ' + pageNo, PW / 2, PH - 34, { align: 'center' });

    var safe = (d.name || 'request').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
    var filename = 'Transfer-Request-' + safe + '.pdf';
    doc.save(filename);

    // Base64 copy of the exact same PDF, for the optional email-a-copy step below.
    // This does not change or delay the local download above in any way.
    var pdfBase64 = null;
    try {
      var dataUri = doc.output('datauristring');
      pdfBase64 = dataUri.split(',')[1] || null;
    } catch (e) { pdfBase64 = null; }

    return { filename: filename, base64: pdfBase64 };
  }

  // ---- validation + wiring ----
  var REQUIRED = [
    ['f_name', 'the full name as the Bureau has it'],
    ['f_reg', 'the register number'],
    ['f_fac', 'the current facility'],
    ['f_home', 'the release city and state']
  ];

  function run() {
    var err = $('tr-err'), btn = $('tr-go');
    var missing = [];

    REQUIRED.forEach(function (r) {
      var el = $(r[0]);
      if (!el) return;
      if (!el.value.trim()) { missing.push(r[1]); el.classList.add('bad'); }
      else { el.classList.remove('bad'); }
    });

    if (missing.length) {
      err.textContent = 'Still needed: ' + missing.join(', ') + '.';
      err.hidden = false;
      var first = document.querySelector('.bad');
      if (first) {
        try { first.focus(); } catch (e) {}
        if (typeof first.scrollIntoView === 'function') {
          try { first.scrollIntoView({ block: 'center' }); } catch (e) {}
        }
      }
      return;
    }
    err.hidden = true;

    var d = {
      to: val('f_to') || 'Unit Team',
      name: val('f_name'), reg: val('f_reg'), unit: val('f_unit'),
      work: val('f_work'), fac: val('f_fac'), home: val('f_home'),
      miles: val('f_miles'), pref: val('f_pref'), family: val('f_family'),
      conduct: val('f_conduct'), other: val('f_other')
    };

    if (!window.jspdf || !window.jspdf.jsPDF) {
      err.textContent = 'The PDF builder is still loading. Give it a second and tap again.';
      err.hidden = false;
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Building\u2026';
    var built = null;
    try {
      built = generate(d);
      btn.textContent = 'Downloaded \u2014 Build Another';
    } catch (e) {
      err.textContent = 'Something went wrong building the PDF. Try again, or call 786-408-5073 and we will prepare it by hand.';
      err.hidden = false;
      btn.textContent = 'Build My Transfer Request';
    }
    btn.disabled = false;

    var email = val('f_email');
    if (email && LEAD_ENDPOINT) {
      try {
        fetch(LEAD_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: 'transfer-request',
            email: email,
            requester: val('f_yourname'),
            phone: val('f_phone'),
            inmate_name: d.name,
            reg_no: d.reg,
            facility: d.fac,
            home: d.home,
            miles: d.miles,
            source: location.pathname,
            referrer: document.referrer || '',
            utm: location.search || '',
            pdf_filename: built ? built.filename : null,
            pdf_base64: built ? built.base64 : null
          })
        }).catch(function () {});
      } catch (e) { /* never block the download */ }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = $('tr-go');
    if (btn) btn.addEventListener('click', run);
  });
})();
