import React from 'react';
import { cn } from '@/lib/utils';

interface MaterialIconProps {
  /** Ligature name, e.g. "close". Must be in the subset in index.html. */
  name: 'chevron_left' | 'chevron_right' | 'close' | 'dark_mode' | 'wb_sunny';
  className?: string;
}

/**
 * A Material Symbols Rounded glyph.
 *
 * Rendered as a ligature rather than inline SVG so the shapes are Google's
 * own, at the axes the design calls for. Sized with text-* utilities, since
 * the glyph's size is its font-size, and coloured by currentColor.
 */
const MaterialIcon = ({ name, className }: MaterialIconProps) => (
  <span aria-hidden="true" className={cn('material-symbols-rounded select-none', className)}>
    {name}
  </span>
);

export default MaterialIcon;
