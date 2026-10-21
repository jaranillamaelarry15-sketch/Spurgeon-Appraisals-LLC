// Sample orders used by the workspace replay. Every name, address and figure here is fictional.

export type PropertyKey = 'residential' | 'farm' | 'commercial'
export type PayMethod = 'link' | 'check'

export type Order = {
  label: string
  orderName: string
  address: string
  county: string
  client: string
  contact: string
  email: string
  phone: string
  intendedUse: string
  propertyType: string
  reportType: string
  due: string
  emailSubject: string
  emailBody: string
  facts: [string, string][]
  compsTitle: string
  comps: { what: string; price: string; dist: string }[]
  feeLines: { label: string; note?: string; amount: number }[]
  turnaround: string
  completion: string
  appraiser: { name: string; role: string; initials: string }
  ghlStage: string
  inspection: string
  deliverables: string[]
  invoiceNo: string
  defaultPay: PayMethod
}

export const ORDERS: Record<PropertyKey, Order> = {
  residential: {
    label: 'Residential',
    orderName: 'Single-Family Refinance',
    address: '1408 Elm Street, Kirksville, MO 63501',
    county: 'Adair, MO',
    client: 'Prairie Trust Bank',
    contact: 'Dana Whitfield, Loan Officer',
    email: 'dana.w@prairietrust.example',
    phone: '(660) 555-0142',
    intendedUse: 'Refinance (lender)',
    propertyType: 'Single-family residence',
    reportType: 'Form 1004 (URAR)',
    due: 'Nov 6',
    emailSubject: 'Appraisal request: 1408 Elm St, Kirksville',
    emailBody:
      'Hi Spurgeon team, we need a full interior appraisal for a refinance on 1408 Elm St. Borrower contact and the engagement letter are attached. Can you send your fee and turnaround?',
    facts: [
      ['Parcel ID', '02-4.0-17-003-012'],
      ['Site size', '0.28 ac'],
      ['Gross living area', '1,860 sq ft'],
      ['Year built', '1998'],
      ['Bed / bath', '3 / 2'],
      ['Zoning', 'R-1 Residential'],
    ],
    compsTitle: 'Comparable sales (last 12 mo.)',
    comps: [
      { what: '1312 Elm St · 1,790 sf', price: '$214,000', dist: '0.2 mi' },
      { what: '904 Hickory Ln · 1,920 sf', price: '$226,500', dist: '0.6 mi' },
      { what: '1720 Pine Ct · 1,840 sf', price: '$219,900', dist: '0.9 mi' },
    ],
    feeLines: [
      { label: 'Base fee', note: 'Adair County, Form 1004', amount: 475 },
      { label: 'Complexity fees', note: 'none checked', amount: 0 },
      { label: 'Additional opinions of value', note: '0 × $400', amount: 0 },
      { label: 'Processing fee', note: 'client portal', amount: 25 },
    ],
    turnaround: '10 business days',
    completion: 'Nov 4',
    appraiser: { name: 'J. Carter', role: 'Certified Residential Appraiser', initials: 'JC' },
    ghlStage: 'In Progress · New Order – Bank',
    inspection: 'Thu, Oct 24 · 10:00 AM',
    deliverables: ['Signed report (PDF)', 'MISMO XML for UCDP', 'Invoice attached to delivery'],
    invoiceNo: 'INV-24-1408',
    defaultPay: 'link',
  },
  farm: {
    label: 'Farm',
    orderName: 'Farm Estate Appraisal',
    address: '160 ac, Sec. 14 T65N R12W, Memphis, MO',
    county: 'Scotland, MO',
    client: 'Hayes & Morrow Law Office',
    contact: 'R. Morrow, Estate Attorney',
    email: 'rmorrow@hayesmorrow.example',
    phone: '(660) 555-0187',
    intendedUse: 'Estate settlement (date of death)',
    propertyType: 'Agricultural · row crop',
    reportType: 'Narrative farm report',
    due: 'Nov 22',
    emailSubject: 'Estate appraisal: 160 acres, Scotland County',
    emailBody:
      'Good morning. Our client’s estate includes 160 acres near Memphis with a machine shed and two grain bins. We need a retrospective value as of the date of death. Please quote your fee.',
    facts: [
      ['Total acres', '160.0 ac'],
      ['Tillable', '142.6 ac'],
      ['Timber / pasture', '15.1 ac'],
      ['Avg. soil PI', '71'],
      ['Buildings', 'Shed, 2 grain bins'],
      ['Tracts', '1 contiguous'],
    ],
    compsTitle: 'Land sales (last 24 mo.)',
    comps: [
      { what: '152 ac cropland', price: '$6,850 / ac', dist: '4.1 mi' },
      { what: '120 ac crop + timber', price: '$5,900 / ac', dist: '7.3 mi' },
      { what: '200 ac cropland', price: '$7,150 / ac', dist: '9.8 mi' },
    ],
    feeLines: [
      { label: 'Base cost', note: '120–200 acres', amount: 1600 },
      { label: 'Normal buildings', note: '1–3 buildings', amount: 150 },
      { label: 'Specialty buildings', note: 'bins under 150k bu', amount: 0 },
      { label: 'County / area surcharge', note: 'Scotland Co.', amount: 100 },
    ],
    turnaround: '4 weeks',
    completion: 'Nov 20',
    appraiser: { name: 'T. Hollis', role: 'Agricultural Appraiser, ARA', initials: 'TH' },
    ghlStage: 'In Progress · New Order',
    inspection: 'Tue, Oct 29 · 9:00 AM',
    deliverables: ['Narrative report (PDF)', 'Soil & aerial maps', 'Invoice attached to delivery'],
    invoiceNo: 'INV-24-0160',
    defaultPay: 'check',
  },
  commercial: {
    label: 'Commercial',
    orderName: 'Retail Building Loan',
    address: '215 N 5th Street, Quincy, IL 62301',
    county: 'Adams, IL',
    client: 'Riverbend Commercial Bank',
    contact: 'M. Ortega, Credit Analyst',
    email: 'mortega@riverbend.example',
    phone: '(217) 555-0119',
    intendedUse: 'Commercial loan',
    propertyType: 'Multi-tenant retail',
    reportType: 'Commercial narrative',
    due: 'Nov 15',
    emailSubject: 'RFP: appraisal of 215 N 5th St, Quincy',
    emailBody:
      'Hello, we are underwriting a loan on a 12,400 sf retail building with five suites. Rent roll and leases are in the shared folder. Please send your fee and earliest delivery date.',
    facts: [
      ['Gross building area', '12,400 sq ft'],
      ['Site size', '0.92 ac'],
      ['Year built', '1987'],
      ['Tenants', '5 suites'],
      ['Occupancy', '92%'],
      ['Zoning', 'C-2 Commercial'],
    ],
    compsTitle: 'Retail sales & cap rates',
    comps: [
      { what: 'Retail · 10,800 sf', price: '$86 / sf · 7.6%', dist: '1.2 mi' },
      { what: 'Strip center · 14,100 sf', price: '$92 / sf · 7.2%', dist: '2.8 mi' },
      { what: 'Retail · 11,950 sf', price: '$79 / sf · 7.9%', dist: '3.5 mi' },
    ],
    feeLines: [
      { label: 'Property type', note: 'multi-tenant retail', amount: 2500 },
      { label: 'Size', note: '10,000–20,000 sf', amount: 400 },
      { label: 'Rent roll & lease review', note: '5 leases', amount: 300 },
      { label: 'Processing fee', note: 'bank portal', amount: 25 },
    ],
    turnaround: '3–4 weeks',
    completion: 'Nov 13',
    appraiser: { name: 'K. Brandt', role: 'Certified General Appraiser', initials: 'KB' },
    ghlStage: 'In Progress · New Order – Bank',
    inspection: 'Mon, Oct 28 · 1:30 PM',
    deliverables: ['Narrative report (PDF)', 'Income & sales grids', 'Invoice attached to delivery'],
    invoiceNo: 'INV-24-0215',
    defaultPay: 'link',
  },
}

export const total = (o: Order) => o.feeLines.reduce((s, l) => s + l.amount, 0)
export const money = (n: number) => '$' + n.toLocaleString('en-US')

export type Focus = 'all' | 'main' | 'side' | 'pipeline' | 'mainTop' | 'sideTop' | 'pay'

export const STEPS: { key: string; stage: string; title: string; text: string; focus: Focus }[] = [
  { key: 'intake', stage: 'Intake', title: 'Order intake', text: 'A request arrives by email or the client portal. I log the client, contact, property, intended use and due date as a new order.', focus: 'main' },
  { key: 'research', stage: 'Research', title: 'Property research', text: 'County assessor records, parcel maps, aerials and recent sales go into an organized workfile before anyone prices the job.', focus: 'main' },
  { key: 'fee', stage: 'Fee quote', title: 'Fee quote', text: 'The fee sheet for that property type sets the price: base fee, complexity, buildings, surcharges and portal fees.', focus: 'mainTop' },
  { key: 'assign', stage: 'Appraiser', title: 'Appraiser review', text: 'The order goes to the right appraiser’s queue. They confirm the fee and completion date, adjust it, or reroute it.', focus: 'sideTop' },
  { key: 'bid', stage: 'Bid sent', title: 'Bid sent to client', text: 'The fee and completion date go to the client with Front Desk copied, and every change is saved in the order history.', focus: 'mainTop' },
  { key: 'confirm', stage: 'Confirmed', title: 'Client confirms the order', text: 'The client says go ahead. Typing “Order Confirmed” moves the opportunity in GHL to In Progress automatically.', focus: 'mainTop' },
  { key: 'report', stage: 'Report', title: 'Inspection & report delivery', text: 'I schedule the inspection, track the due date and deliver the report in the format the client requires.', focus: 'mainTop' },
  { key: 'pay', stage: 'Paid', title: 'Invoice & payment', text: 'The invoice goes out with two ways to pay: a mailed check or a secure payment link. I watch the deposit and close the order.', focus: 'pay' },
]
