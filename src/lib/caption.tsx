import React from 'react';

/**
 * Splits a caption on *asterisk* runs and renders those in medium weight.
 *
 * The design emphasises a phrase that can sit anywhere in the sentence, not
 * just at the start, so this is a marker rather than a separate field.
 */
export function renderCaption(caption: string) {
  return caption
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith('*') && part.endsWith('*') ? (
        <strong key={i} className="font-medium text-foreground">
          {part.slice(1, -1)}
        </strong>
      ) : (
        // A span, not React.Fragment: the lovable-tagger plugin injects a
        // data-lov-id onto every JSX node and Fragment rejects extra props.
        <span key={i}>{part}</span>
      )
    );
}
