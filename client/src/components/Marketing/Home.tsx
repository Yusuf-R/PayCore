import { Hero } from "./Hero";
import { Capabilities } from "./Capabilities";
import { HowItWorks } from "./HowItWorks";
import { Reveal } from "@/components/motion/Reveal";

export function Home() {
    return (
        <div>
            <Hero />
            <Reveal><Capabilities /></Reveal>
            <Reveal delay={0.1}><HowItWorks /></Reveal>
        </div>
    );
}