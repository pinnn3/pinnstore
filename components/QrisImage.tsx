import React from 'react';

export default function QrisImage({ className = '' }: { className?: string }) {
  return (
    <img
      src="/shop/qris.webp"
      alt="QRIS"
      className={className}
      style={{ maxWidth: '360px', width: '100%', height: 'auto' }}
    />
  );
}
