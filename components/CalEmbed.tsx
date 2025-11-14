'use client';

import { useEffect } from 'react';

export default function CalEmbed() {
  useEffect(() => {
    // Load Cal.com embed script
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div
      data-cal-link="coeurdelom"
      data-cal-config='{"layout":"month_view"}'
      style={{ width: '100%', height: '100%', overflow: 'scroll' }}
    ></div>
  );
}
