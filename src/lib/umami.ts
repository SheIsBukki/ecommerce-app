import umami from "@umami/node";

umami.init({
  websiteId: "acceb3d5-ce18-47d4-a951-4e995ff0e4a6", // Your website id
  hostUrl: "https://cloud.umami.is", // URL to your Umami instance
});

export const umamiTrackCheckoutSuccessEvent = async (payload: {
  [key: string]: string | number | Date;
}) => {
  await umami.track("checkout_success", payload);
};

// umami.track({ url: "/home" });
