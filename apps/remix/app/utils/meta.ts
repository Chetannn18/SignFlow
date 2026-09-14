import { NEXT_PUBLIC_WEBAPP_URL } from '@documenso/lib/constants/app';
import { i18n, type MessageDescriptor } from '@lingui/core';

export const appMetaTags = (title?: MessageDescriptor) => {
  const description =
    'Sign in now and enjoy a faster, smarter, and more beautiful document signing process with SignFlow.';

  return [
    {
      title: title ? `${i18n._(title)} - SignFlow` : 'SignFlow',
    },
    {
      name: 'description',
      content: description,
    },
    {
      name: 'keywords',
      content: 'SignFlow, document signing, fast signing, smart templates',
    },
    {
      name: 'author',
      content: 'SignFlow Technologies',
    },
    {
      name: 'robots',
      content: 'index, follow',
    },
    {
      property: 'og:title',
      content: 'SignFlow',
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: `${NEXT_PUBLIC_WEBAPP_URL()}/opengraph-image.jpg`,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    {
      name: 'twitter:site',
      content: '@SignFlow',
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:image',
      content: `${NEXT_PUBLIC_WEBAPP_URL()}/opengraph-image.jpg`,
    },
  ];
};
