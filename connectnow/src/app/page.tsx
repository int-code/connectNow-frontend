import AppFooter from "./components/AppFooter";
import HeroSection from "./components/HeroSection";
import Navigation from "./components/Navigation";
import AppHeader from "./components/appHeader";
import MainPageCaraousal from "./components/mainPageCaraousal";


export default function Home() {
  return (
    <div className="min-h-screen w-full">
      <AppHeader />
      <MainPageCaraousal />
      <HeroSection />
      <AppFooter />
    </div>
  );
}
