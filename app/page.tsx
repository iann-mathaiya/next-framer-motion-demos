import AnimatedSlider from "./components/slider";
import AnimatedTabs from "./components/tabs";


export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-4 items-center justify-between bg-slate-900 p-24">
      <AnimatedTabs />
      <AnimatedSlider />
    </main>
  )
}
