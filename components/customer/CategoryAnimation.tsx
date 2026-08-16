import HotDrinksAnimation from "./animations/HotDrinksAnimation";
import ColdDrinksAnimation from "./animations/ColdDrinksAnimation";
import SandwichesAnimation from "./animations/SandwichesAnimation";
import DessertsAnimation from "./animations/DessertsAnimation";

/**
 * Spec §6, decision B: stylized custom-coded animation per category,
 * swappable for a real video loop later without touching call sites.
 */
export default function CategoryAnimation({ animationKey }: { animationKey: string }) {
  switch (animationKey) {
    case "hot-drinks":
      return <HotDrinksAnimation />;
    case "cold-drinks":
      return <ColdDrinksAnimation />;
    case "sandwiches":
      return <SandwichesAnimation />;
    case "desserts":
      return <DessertsAnimation />;
    default:
      return null;
  }
}
