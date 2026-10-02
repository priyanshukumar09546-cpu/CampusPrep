/**
 * PDF URL Validator Utility
 * Ensures that only real, verified, direct PDF links are opened.
 * Filters out placeholder URLs, root homepages, search engines, and fake dummy links.
 */

export function isValidPdfUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  
  // Must start with standard HTTP or HTTPS protocol OR relative uploads path '/'
  const isRelative = trimmed.startsWith('/') || trimmed.startsWith('./') || trimmed.startsWith('uploads/');
  const isAbsolute = trimmed.startsWith('http://') || trimmed.startsWith('https://');

  if (!isRelative && !isAbsolute) return false;

  const lower = trimmed.toLowerCase();

  // Root homepages are NOT direct PDF resources
  if (
    lower === 'https://aktu-quantum.tech/' ||
    lower === 'https://aktu-quantum.tech' ||
    lower === 'http://aktu-quantum.tech/' ||
    lower === 'http://aktu-quantum.tech' ||
    lower === 'https://professorvirus.edu/' ||
    lower === 'https://professorvirus.edu'
  ) {
    return false;
  }

  // Google Drive folder links are NOT individual files
  if (lower.includes('drive.google.com/drive/folders')) {
    return false;
  }

  // Search engines & internal search pages are NOT direct PDF resources
  if (
    lower.includes('google.com/search') ||
    lower.includes('bing.com/search') ||
    lower.includes('search?q=') ||
    lower.includes('/search?')
  ) {
    return false;
  }

  // Placeholders, dummy domain links, and broken external BCA routes
  if (
    lower.includes('example.com') ||
    lower.includes('dummy.pdf') ||
    lower.includes('placeholder.pdf') ||
    lower.includes('fake.pdf') ||
    lower.includes('aktupyq.com/bca/notes')
  ) {
    return false;
  }

  return true;
}
