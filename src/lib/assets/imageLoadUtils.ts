import type { Picture } from "@sveltejs/enhanced-img";

type PictureLoader = () => Promise<Picture>;

export async function loadCachedPicture(
  loaders: Record<string, PictureLoader>,
  cache: Map<string, Picture>,
  inFlight: Map<string, Promise<Picture | null>>,
  fullPath: string,
): Promise<Picture | null> {
  const cached = cache.get(fullPath);
  if (cached) return cached;

  const pending = inFlight.get(fullPath);
  if (pending) return pending;

  const loader = loaders[fullPath];
  if (!loader) return null;

  const promise = loader()
    .then((picture) => {
      if (picture) cache.set(fullPath, picture);
      return picture;
    })
    .catch(() => null)
    .finally(() => {
      inFlight.delete(fullPath);
    });

  inFlight.set(fullPath, promise);
  return promise;
}
