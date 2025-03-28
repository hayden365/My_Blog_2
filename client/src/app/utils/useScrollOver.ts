import { useEffect, useState } from "react";

function useScrollOver(threshold: number) {
  const [over, setOver] = useState(false);

  useEffect(() => {
    const handle = () => setOver(window.scrollY > threshold);
    window.addEventListener("scroll", handle);
    return () => window.removeEventListener("scroll", handle);
  }, [threshold]);

  return over;
}

export default useScrollOver;
