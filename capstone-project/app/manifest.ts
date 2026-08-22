import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Words Matter",
    short_name: "My Words Matter",
    description:
      "A picture-based communication app that helps individuals express themselves through PEC cards, schedules, and more.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0b5fb0",
    icons: [
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
