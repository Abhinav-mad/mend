// app/hooks/useInitUserId.ts
import { useEffect, useState } from "react";
import { initUserId } from "../../utils/userId";

export function useInitUserId() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initUserId()
      .then(() => setReady(true))
      .catch(() => setReady(true));
  }, []);

  return ready;
}
