# AI Fee Proposal Automation – Handoff (Spurgeon Appraisals)

Paste this into the new session so it can pick up where we left off.

## Goal
When a new order comes in on the Spurgeon website with a SharePoint/OneDrive folder link, AI reads every file in the folder, calculates the proposed fee using the company fee rules, and sends the proposal to the right person in Microsoft Teams (no manual work by Larry).

## Decisions so far
- Mason is the Microsoft 365 admin; Make.com could NOT get folder access without his admin approval ("Need admin approval").
- Zapier already has approved Microsoft connections (larry@ and mason@spurgeonappraisals.com), so Zapier reads the folders.
- Make account is on the FREE plan: Make AI cannot read PDFs/images (paid only); text-only free model.
- Recommendation: do the whole flow in Zapier (paid plan) – AI by Zapier reads the files, prices the order, and sends the Teams message. Must first test that AI by Zapier can read PDFs/images on this plan.
- Do NOT use Claude API (Larry's personal account).

## Built so far
### Zapier – "AI Fee Proposal - Read Order Folder (TEST)" (draft, not published; saved in folder "Austin Clubb (...)")
1. Webhooks by Zapier – Catch Hook: https://hooks.zapier.com/hooks/catch/26501729/4mo56ee/ (expects order_name, folder_link)
2. Code by Zapier (Python) – turns any folder link into a Graph URL:
   ```
   import base64
   u = input_data['link'].strip().split('?')[0]
   enc = base64.urlsafe_b64encode(u.encode()).decode().rstrip('=')
   output = {'graph_url': 'https://graph.microsoft.com/v1.0/shares/u!' + enc + '/driveItem/children', 'clean_link': u}
   ```
3. OneDrive – API Request (Beta), account mason@spurgeonappraisals.com, GET {{graph_url}} – TESTED OK (status 200, lists files incl. "@microsoft.graph.downloadUrl" per file)
4. Webhooks by Zapier – POST (JSON) to Make: https://hook.us2.make.com/02t64fj8mp4bxnl8h06m3aanqvvbsf9z with order_name, folder_link (clean link), files_json (step 3 Response Body) – TESTED OK. (Not needed if everything moves to Zapier.)

### Make – "AI Fee Proposal (TEST)" (scenario 6410367, inactive)
- Custom webhook "Zapier - Order Folder Files" + a placeholder Simple Text Prompt module. Can be deleted if the flow moves to Zapier.
- Live scenario "Integration Webhooks" (6299109) was NOT changed. It has a pending "Recover unsaved changes" prompt from Sep 25 – left untouched for Larry/Mason to decide.

### How Teams messages work today (live Make scenario)
- Data store "Order ID Map - Artifact to GHL" (id 157942), key "appraiser-<Full Name>", field teamsEmail:
  Stan Choate – stan@ | Matt Dutton – matt@ | Matthew Roberts – matthew@ | Mason Spurgeon – mason@ | Zach Petzoldt – zach@ | Darren Ryals – darren@ (all @spurgeonappraisals.com)
- Teams: POST /v1.0/chats (oneOnOne, larry@ + person), then POST /v1.0/chats/{id}/messages (HTML).

## Routing rules
- Residential -> Stan Choate (Residential Fees for Stan v7.3 rules).
- Farm -> Mason / Zach / Darren (Farm Pricing Guide v4.5). Zach: Adair, Chariton, Knox, Linn, Macon, Putnam, Schuyler, Scotland, Sullivan MO. Otherwise Mason (Darren only if named – Darren's counties still needed).
- Commercial -> Matthew Roberts, no AI fee ("to be set by appraiser"). Matt Dutton: no AI fee.
- Inspector rule (applies to EVERY appraiser, incl. Stan and Matthew Roberts): if the order has an inspector assigned, the inspector gets the proposal first and the appraiser gets it right after (both sent immediately – Larry chose option A). The inspector gives the fee, same as the current Make setup. No inspector = straight to the appraiser.
- The full AI pricing prompt is in the separate file prompt.txt.

## Open questions for Larry
1. (Answered: option A – both immediately, inspector first.) Still confirm what "inspector gives the fee" means for the message content.
2. Send Teams messages automatically with no review, or to Larry first? Send from larry@ account?
3. Who receives the end-to-end test message?
4. Darren's farm counties.
5. Website change still needed: the order form must send folder_link (+ appraiser, inspector) to the Zapier webhook.

## Next steps
1. Test AI by Zapier on a PDF (e.g. Wilson parcel PDF 21-01-12-000-000-003.000.pdf) – read only, no messages.
2. If it works: Looping by Zapier over files -> AI reads each -> AI prices with prompt.txt rules -> look up Teams email -> Teams chat message (inspector-first rule).
3. Update the website to post orders to the Zapier hook.
4. Test with "26 OCT Spurgeon Testing" folder, then publish the zap.

Test folders: 26 OCT Spurgeon Testing, 26 OCT Wollgast, 26 OCT Wilson Pur (all in Mason's OneDrive > Workfiles - Appraisals > 2026 Appraisals > 1 26 Pending).
