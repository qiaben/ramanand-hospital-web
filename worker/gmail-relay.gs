/**
 * Sends the booking emails from the hospital's own Gmail. No domain or DNS setup is needed.
 *
 * Setup (once, signed in to the hospital Gmail account, for example ramanandhosp@gmail.com):
 *  1. Go to script.google.com, choose New project, and paste this whole file over the sample code.
 *  2. Project settings (gear icon), Script properties, Add script property:
 *       name SECRET, value a long random text you make up. Keep a copy.
 *  3. Choose Deploy, New deployment, type Web app. Execute as: Me. Who has access: Anyone. Deploy and allow access.
 *  4. Copy the Web app URL. It becomes MAIL_RELAY_URL, and the SECRET becomes MAIL_RELAY_SECRET (see worker/README.md).
 *
 * Gmail lets a free account send to about 100 recipients a day (a Google Workspace account about 1,500).
 * One booking uses about 3 recipients for the confirmation and about 2 for the reminder.
 */
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  if (d.secret !== PropertiesService.getScriptProperties().getProperty("SECRET")) return out({ ok: false });
  var opts = { to: d.to.join(","), subject: d.subject, htmlBody: d.html, name: d.name || "Ramanand Hospital" };
  if (d.replyTo) opts.replyTo = d.replyTo;
  MailApp.sendEmail(opts);
  return out({ ok: true });
}
function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
