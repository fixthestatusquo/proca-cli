export const getTwitter = async (org) => {
  const orgName = org.config.twitter?.screen_name || org.name;
  try {
    const res = await fetch(
      `https://twitter.proca.app/?screen_name=${orgName}`,
    );

    if (res.status >= 400) {
      throw new Error("Bad response from twitter.proca.app");
    }

    const twitter = await res.json();
    twitter.picture = twitter.profile_image_url_https;
    twitter.profile_image_url_https = undefined;
    if (twitter) org.config.twitter = twitter;
    if (!org.config.description) org.config.description = twitter.description;
    if (!org.config.location) org.config.location = twitter.location;
    if (!org.config.url) org.config.url = twitter.url;
    if (!org.title) org.title = twitter.name;
  } catch (err) {
    console.error(err);
  }
};
