import React from 'react';
import { Helmet } from 'react-helmet';

const SEO = ({ title, description, image, url }) => {
  return (
    <Helmet>
      <title>{title || 'Drone Research Lab'}</title>
      <meta name="description" content={description || 'Advanced drone research laboratory'} />
      <meta property="og:title" content={title || 'Drone Research Lab'} />
      <meta property="og:description" content={description || 'Advanced drone research laboratory'} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title || 'Drone Research Lab'} />
      <meta name="twitter:description" content={description || 'Advanced drone research laboratory'} />
    </Helmet>
  );
};

export default SEO;