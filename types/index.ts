export type Package = 'basic' | 'standard' | 'premium'

export type ApplicationStatus =
  | 'pending'
  | 'review'
  | 'submitted'
  | 'accepted'
  | 'rejected'

export interface University {
  id: string
  name: string
  city: string
  abbr: string
  bg: string
  color: string
}

export interface Application {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  package: Package
  universities: string[]
  status: ApplicationStatus
  createdAt: string
  notes?: string
}

export const UNIVERSITIES: University[] = [
  { id: 'iu', name: 'Istanbul Üniversitesi', city: 'Istanbul', abbr: 'İÜ', bg: '#E6F1FB', color: '#0C447C' },
  { id: 'au', name: 'Ankara Üniversitesi', city: 'Ankara', abbr: 'AÜ', bg: '#EEEDFE', color: '#3C3489' },
  { id: 'eu', name: 'Ege Üniversitesi', city: 'Izmir', abbr: 'EÜ', bg: '#E1F5EE', color: '#085041' },
  { id: 'su', name: 'Selçuk Üniversitesi', city: 'Konya', abbr: 'SÜ', bg: '#FAEEDA', color: '#633806' },
  { id: 'mu', name: 'Marmara Üniversitesi', city: 'Istanbul', abbr: 'MÜ', bg: '#FAECE7', color: '#712B13' },
  { id: 'ku', name: 'Koç Üniversitesi', city: 'Istanbul', abbr: 'KÜ', bg: '#EAF3DE', color: '#27500A' },
  { id: 'hu', name: 'Hacettepe Üniversitesi', city: 'Ankara', abbr: 'HÜ', bg: '#FBEAF0', color: '#72243E' },
  { id: 'bu', name: 'Boğaziçi Üniversitesi', city: 'Istanbul', abbr: 'BÜ', bg: '#E6F1FB', color: '#185FA5' },
  { id: 'gu', name: 'Gazi Üniversitesi', city: 'Ankara', abbr: 'GÜ', bg: '#FCEBEB', color: '#791F1F' },
  { id: 'du', name: 'Dokuz Eylül Üniversitesi', city: 'Izmir', abbr: 'DÜ', bg: '#E1F5EE', color: '#0F6E56' },
  { id: 'ktu', name: 'Karadeniz Teknik Üniversitesi', city: 'Trabzon', abbr: 'KTÜ', bg: '#F1EFE8', color: '#444441' },
  { id: 'sau', name: 'Sakarya Üniversitesi', city: 'Sakarya', abbr: 'SAÜ', bg: '#FAEEDA', color: '#854F0B' },
]

export const PACKAGES = {
  basic: {
    name: 'Basic',
    price: 150,
    maxUnis: 1,
    days: 14,
    features: ['1 jaamacad codsi', 'Documents review', 'Status tracker', '14 maalin processing'],
  },
  standard: {
    name: 'Standard',
    price: 280,
    maxUnis: 3,
    days: 7,
    features: ['3 jaamacadood codsi', 'Documents translation', 'Status tracker', '7 maalin processing', 'WhatsApp support'],
  },
  premium: {
    name: 'Premium',
    price: 450,
    maxUnis: 5,
    days: 3,
    features: ['5 jaamacadood codsi', 'Documents + apostille', 'Visa guidance', '3 maalin processing', 'Hoy raadin Turkey', 'Airport pickup'],
  },
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Sugaya',
  review: 'Review',
  submitted: 'Diray',
  accepted: 'Qebilay',
  rejected: 'Diiday',
}
