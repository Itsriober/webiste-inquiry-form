import emailjs from '@emailjs/browser';
import type { BriefFormData } from '../types/brief';

export async function sendBriefEmail(data: BriefFormData): Promise<void> {
  const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
  const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
  const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    console.warn('EmailJS environment variables are missing. Form will be saved locally but no email will be sent.');
    return;
  }

  await emailjs.send(
    serviceId,
    templateId,
    {
      client_name: data.clientName,
      client_email: data.clientEmail,
      client_company: data.clientCompany || '—',
      client_phone: data.clientPhone || '—',
      business_type: data.businessType === 'Other' ? `Other (${data.businessTypeOther})` : data.businessType,
      existing_site: data.hasExistingSite,
      purpose: data.websitePurpose.map(p => p === 'Other' ? `Other (${data.websitePurposeOther})` : p).join(', '),
      audience: data.targetAudience,
      pages: data.pagesNeeded.map(p => p === 'Other' ? `Other (${data.pagesNeededOther})` : p).join(', '),
      content_source: data.contentSource,
      features: data.featuresNeeded.map(p => p === 'Other' ? `Other (${data.featuresNeededOther})` : p).join(', '),
      needs_cms: data.needsCMS,
      brand_status: data.brandStatus,
      design_style: data.designStyle,
      reference_urls: data.referenceUrls || '—',
      timeline: data.timeline,
      budget: data.budgetRange,
      notes: data.additionalNotes || '—',
      submitted_at: new Date().toLocaleString('en-KE', {
        timeZone: 'Africa/Nairobi',
      }),
    },
    import.meta.env.VITE_EMAILJS_PUBLIC_KEY
  );
}
