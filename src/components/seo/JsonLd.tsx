export type JsonLdData = Record<string, unknown>

/** JSON for a script body: `<` and the two JS line separators escaped, so a value cannot end the tag. */
export function serializeJsonLd(data: JsonLdData | JsonLdData[]): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replaceAll(String.fromCharCode(0x2028), '\\u2028')
    .replaceAll(String.fromCharCode(0x2029), '\\u2029')
}

// The only raw-HTML injection of the site: the payload is our own object, serialized and escaped above.
export function JsonLd({ data }: { data: JsonLdData | JsonLdData[] }) {
  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: our own object, serialized and `<`-escaped above
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
