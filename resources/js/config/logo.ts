export const LOGO_PATH = '/images/newlogo.jpeg';

// Helper function to get responsive logo size
export const getResponsiveLogoSize = (isMobile: boolean, type: 'navbar' | 'footer') => {
  if (type === 'navbar') {
    return {
      width: isMobile ? 45 : 150,
      height: isMobile ? 45 : 150,
      objectFit: 'contain' as const,
    };
  } else {
    return {
      width: isMobile ? 80 : 150,
      height: isMobile ? 80 : 150,
      objectFit: 'contain' as const,
    };
  }
};

// Navbar Logo Config
export const navbarLogoConfig = {
  src: LOGO_PATH,
  alt: 'CloudTravel',
  desktop: { width: 150, height: 150 },
  mobile: { width: 45, height: 45 },
  objectFit: 'contain' as const,
};

// Footer Logo Config
export const footerLogoConfig = {
  src: LOGO_PATH,
  alt: 'CloudTravel',
  desktop: { width: 60, height: 60 },
  mobile: { width: 40, height: 40 },
  objectFit: 'contain' as const,
};

// Backward compatibility
export const logoConfig = navbarLogoConfig;
