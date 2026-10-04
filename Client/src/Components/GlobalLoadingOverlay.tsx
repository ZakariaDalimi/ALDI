import { useEffect, useRef, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { useLocation, useNavigation } from "react-router";

const GlobalLoadingOverlay = () => {
  const location = useLocation();
  const navigation = useNavigation();
  const isNavigating = navigation.state !== "idle";
  const isFetching =
    useIsFetching({
      predicate: (query) => query.queryKey[0] !== "product-search",
    }) > 0;
  const [isSlowFetch, setIsSlowFetch] = useState(false);
  const [showNavigationFeedback, setShowNavigationFeedback] = useState(false);
  const previousLocationKey = useRef(location.key);

  useEffect(() => {
    if (previousLocationKey.current === location.key) return;

    previousLocationKey.current = location.key;
    setShowNavigationFeedback(true);

    const timeout = window.setTimeout(
      () => setShowNavigationFeedback(false),
      400,
    );
    return () => window.clearTimeout(timeout);
  }, [location.key]);

  useEffect(() => {
    if (!isFetching) {
      setIsSlowFetch(false);
      return;
    }

    const timeout = window.setTimeout(() => setIsSlowFetch(true), 180);
    return () => window.clearTimeout(timeout);
  }, [isFetching]);

  if (!isNavigating && !isSlowFetch && !showNavigationFeedback) return null;

  return (
    <div
      className="fixed inset-0 z-100 grid place-items-center bg-white/90 backdrop-blur-sm"
      role="status"
      aria-live="polite"
      aria-label="Seite wird geladen"
    >
      <div className="flex flex-col items-center gap-7 px-6">
        <img
          src="https://www.its-stuttgart.de/wp-content/themes/itschule/img/header/its_logo.svg"
          alt=""
          className="h-40 w-[min(88vw,42rem)] animate-pulse object-contain sm:h-48"
        />
        <span className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary motion-reduce:animate-none" />
        <span className="text-sm font-medium text-gray-700">
          Einen Moment bitte ...
        </span>
      </div>
    </div>
  );
};

export default GlobalLoadingOverlay;
