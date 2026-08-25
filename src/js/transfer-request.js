/* Writ Large — closer-to-home transfer request builder.

   Fills the OFFICIAL BOP form BP-A0148 (Inmate Request to Staff), served from
   /forms/BP_A0148.pdf, obtained from bop.gov. The form is never redrawn,
   recreated, or altered — only its existing fillable fields are populated.
   Overflow narrative goes onto a plain continuation sheet, which the form
   itself contemplates ("Continue on back, if necessary").

   STAFF-ONLY FIELDS — never written to by this tool:
     'Disposition', 'Signature Staff Member', 'Date'
   Those belong to BOP staff and are left blank.

   Runs entirely in the browser. Nothing is transmitted unless the visitor
   supplies an email, in which case a lead is posted to the configured endpoint. */
(function () {
  'use strict';

  var LEAD_ENDPOINT = 'https://prisonerlegalaid.app.n8n.cloud/webhook/pla-transfer-lead';
  var FORM_URL = '/forms/BP_A0148.pdf';

  /* Text1 (the SUBJECT body) rect on the official form:
     [35.3, 346.9, 575.5, 544.8] -> 540.2 x 197.9 pt. Inset for padding. */
  var BODY_W = 528, BODY_H = 190, BODY_SIZE = 9, BODY_LEAD = 10.8;

  function $(id) { return document.getElementById(id); }
  function val(id) { var e = $(id); return e ? e.value.trim() : ''; }

  function today() {
    var d = new Date();
    return String(d.getMonth() + 1).padStart(2, '0') + '/' +
           String(d.getDate()).padStart(2, '0') + '/' + d.getFullYear();
  }

  /* ---- narrative assembled from the facts given. No claims are invented. ---- */
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

    if (d.family)  { p.push('Family circumstances. ' + d.family); }
    if (d.conduct) { p.push('Institutional conduct and programming. ' + d.conduct); }
    if (d.other)   { p.push('Additional considerations. ' + d.other); }
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

  /* ---- word wrap measured against the real embedded font ---- */
  function wrap(paras, font, size, width) {
    var out = [];
    paras.forEach(function (para, idx) {
      var words = para.split(/\s+/), line = '';
      words.forEach(function (w) {
        var trial = line ? line + ' ' + w : w;
        if (font.widthOfTextAtSize(trial, size) > width && line) {
          out.push(line); line = w;
        } else {
          line = trial;
        }
      });
      if (line) { out.push(line); }
      if (idx < paras.length - 1) { out.push(''); }
    });
    return out;
  }

  function setField(form, name, value) {
    try {
      form.getTextField(name).setText(value || '');
    } catch (e) { /* field absent on a revised form revision — skip, never crash */ }
  }

  /* ---- fill the official form ---- */
  function generate(d) {
    var PDFLib = window.PDFLib;
    var pdfDoc, form, helv, helvB;

    return fetch(FORM_URL).then(function (res) {
      if (!res.ok) { throw new Error('form fetch failed'); }
      return res.arrayBuffer();
    }).then(function (bytes) {
      return PDFLib.PDFDocument.load(bytes);
    }).then(function (doc) {
      pdfDoc = doc;
      form = pdfDoc.getForm();
      return pdfDoc.embedFont(PDFLib.StandardFonts.Helvetica);
    }).then(function (f) {
      helv = f;
      return pdfDoc.embedFont(PDFLib.StandardFonts.HelveticaBold);
    }).then(function (fb) {
      helvB = fb;

      /* Inmate-side header fields only. */
      setField(form, 'TOName and Title of Staff Member', d.to);
      setField(form, 'DATE', today());
      setField(form, 'FROM', d.name);
      setField(form, 'REGISTER NO', d.reg);
      setField(form, 'WORK ASSIGNMENT', d.work);
      setField(form, 'UNIT', d.unit);
      /* 'Disposition', 'Signature Staff Member', 'Date' are STAFF-ONLY. Untouched. */

      var subject = 'REQUEST FOR CLOSER-TO-HOME TRANSFER \u2014 18 U.S.C. \u00A7 3621(b)';
      var paras = [subject].concat(buildBody(d));
      var lines = wrap(paras, helv, BODY_SIZE, BODY_W);

      var maxLines = Math.floor(BODY_H / BODY_LEAD);
      var head = lines, rest = [];
      if (lines.length > maxLines) {
        head = lines.slice(0, maxLines - 1);
        rest = lines.slice(maxLines - 1);
        head.push('(Continued on attached page.)');
      }

      setField(form, 'Text1', head.join('\n'));
      try { form.getTextField('Text1').setFontSize(BODY_SIZE); } catch (e) {}

      /* Overflow onto a plain continuation sheet — not a form reproduction. */
      if (rest.length) {
        var page = pdfDoc.addPage([612, 792]);
        var y = 738;
        page.drawText('CONTINUATION \u2014 INMATE REQUEST TO STAFF',
          { x: 54, y: y, size: 11, font: helvB });
        y -= 15;
        page.drawText((d.name || '') + (d.reg ? ', Reg. No. ' + d.reg : ''),
          { x: 54, y: y, size: 9, font: helv });
        y -= 8;
        page.drawLine({ start: { x: 54, y: y }, end: { x: 558, y: y }, thickness: 0.8 });
        y -= 20;

        for (var i = 0; i < rest.length; i++) {
          if (y < 100) { page = pdfDoc.addPage([612, 792]); y = 738; }
          if (rest[i]) {
            page.drawText(rest[i], { x: 54, y: y, size: BODY_SIZE, font: helv });
          }
          y -= BODY_LEAD;
        }

        y -= 26;
        page.drawLine({ start: { x: 54, y: y }, end: { x: 304, y: y }, thickness: 0.6 });
        page.drawLine({ start: { x: 408, y: y }, end: { x: 558, y: y }, thickness: 0.6 });
        y -= 11;
        page.drawText('Signature of Requesting Inmate', { x: 54, y: y, size: 8, font: helv });
        page.drawText('Date', { x: 408, y: y, size: 8, font: helv });
      }

      /* Flatten so the completed form prints identically everywhere. Staff
         fields flatten as blank space, exactly as on a printed blank form. */
      form.flatten();
      return pdfDoc.save();
    }).then(function (outBytes) {
      var safe = (d.name || 'request').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '');
      var filename = 'Transfer-Request-' + safe + '.pdf';

      var blob = new Blob([outBytes], { type: 'application/pdf' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);

      var b64 = null;
      try {
        var bin = '', chunk = 0x8000;
        for (var k = 0; k < outBytes.length; k += chunk) {
          bin += String.fromCharCode.apply(null, outBytes.subarray(k, k + chunk));
        }
        b64 = btoa(bin);
      } catch (e) { b64 = null; }

      return { filename: filename, base64: b64 };
    });
  }

  /* ---- validation + wiring ---- */
  var REQUIRED = [
    ['f_name', 'the full name as the Bureau has it'],
    ['f_reg', 'the register number'],
    ['f_fac', 'the current facility'],
    ['f_home', 'the release city and state']
  ];

  function postLead(d, built) {
    var email = val('f_email');
    if (!email || !LEAD_ENDPOINT) { return; }
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

    if (!window.PDFLib || !window.PDFLib.PDFDocument) {
      err.textContent = 'The PDF builder is still loading. Give it a second and tap again.';
      err.hidden = false;
      return;
    }

    btn.disabled = true;
    btn.textContent = 'Building\u2026';

    generate(d).then(function (built) {
      btn.textContent = 'Downloaded \u2014 Build Another';
      btn.disabled = false;
      postLead(d, built);
    }).catch(function () {
      err.textContent = 'Something went wrong building the PDF. Try again, or call 786-408-5073 and we will prepare it by hand.';
      err.hidden = false;
      btn.textContent = 'Build My Transfer Request';
      btn.disabled = false;
      postLead(d, null);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var btn = $('tr-go');
    if (btn) { btn.addEventListener('click', run); }
  });
})();
