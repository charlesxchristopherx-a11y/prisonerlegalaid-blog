// ONE SWITCH for the Customer Service Line (645) 231-3957 ext. 101.
// Turned OFF 2026-11-27 at Chris's instruction: the RingCentral voicemail on that line is not
// working, so the sites show only the Family Help Line 786-408-5073 until it is fixed.
// To bring the line back: set customerServiceLine to true, and re-add this line to
// src/llms.txt under "## Contact" (llms.txt is copied as-is and cannot read this switch):
//   Customer Service Line: +1-645-231-3957 ext. 101
// Every other place (top strip, mobile call bar, contact block, article call-to-action,
// structured data, and the .blog footer) follows this switch automatically.
module.exports = {
  customerServiceLine: false,
};
