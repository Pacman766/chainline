'use client';
import { RichText } from '@payloadcms/richtext-lexical/react';

export function ProductDescription({ data }: { data: unknown }) {
  if (!data) return null;
  return <RichText data={data as never} />;
}
