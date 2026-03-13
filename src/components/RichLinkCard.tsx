import React, { useEffect, useState } from 'react';

interface OgMeta {
  title?: string;
  description?: string;
  image?: { url: string };
  publisher?: string;
  url?: string;
}

interface Props {
  url: string;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

const RichLinkCard: React.FC<Props> = ({ url }) => {
  const [meta, setMeta] = useState<OgMeta | null>(null);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;
    fetch(`https://api.microlink.io/?url=${encodeURIComponent(url)}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return;
        if (data.status === 'success') {
          setMeta(data.data);
          setStatus('done');
        } else {
          setStatus('error');
        }
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => { cancelled = true; };
  }, [url]);

  const domain = getDomain(url);

  if (status === 'loading') {
    return (
      <div className="flex gap-3 items-start w-full border border-border rounded-xl p-4 bg-muted/40 animate-pulse">
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
        <div className="w-20 h-20 rounded-lg bg-muted flex-shrink-0" />
      </div>
    );
  }

  if (status === 'error' || !meta) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 w-full border border-border rounded-xl px-4 py-3 bg-muted/40 hover:bg-muted transition-colors duration-150 group"
      >
        <span className="text-sm text-muted-foreground truncate flex-1">{domain}</span>
        <svg className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0 group-hover:text-foreground transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    );
  }

  const { title, description, image, publisher } = meta;
  const displayDomain = publisher || domain;
  // Google favicon service: always returns a crisp PNG, never fails
  const faviconUrl = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex gap-3 items-start w-full border border-border rounded-xl p-4 bg-muted/40 hover:bg-muted transition-colors duration-150 no-underline group"
    >
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Publisher / domain row */}
        <div className="flex items-center gap-1.5">
          <img
            src={faviconUrl}
            alt=""
            className="w-4 h-4 rounded-sm object-contain shrink-0 outline-none self-center !mb-0"
            loading="lazy"
          />
          <span className="text-xs text-muted-foreground truncate leading-none">{displayDomain}</span>
        </div>

        {/* Title */}
        {title && (
          <p className="text-sm font-semibold text-foreground leading-snug line-clamp-2 group-hover:underline decoration-1 underline-offset-2">
            {title}
          </p>
        )}

        {/* Description */}
        {description && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Preview image */}
      {image?.url && (
        <img
          src={image.url}
          alt={title ?? ''}
          className="w-20 h-20 rounded-lg object-cover flex-shrink-0 outline-none !mb-0"
          loading="lazy"
        />
      )}
    </a>
  );
};

export default RichLinkCard;
