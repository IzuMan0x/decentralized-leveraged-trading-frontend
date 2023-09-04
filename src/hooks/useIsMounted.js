import { useEffect, useState } from "react";

//This hooks is used to prevent hydration error
export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
