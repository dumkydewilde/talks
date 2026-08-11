import { createRoot } from "react-dom/client";
import yaml from "js-yaml";
import { Deck } from "../../deck/engine/Deck";
import { ArrangeView } from "../../deck/arrange/ArrangeView";
import { orderSlides } from "../../deck/engine/loadSlides";
import orderRaw from "./order.yaml?raw";
import configRaw from "./talk.yaml?raw";

const TALK_ID = "vibe-coding-weekend-2026-08";

const modules = import.meta.glob("./slides/*.mdx", { eager: true });
const order = (yaml.load(orderRaw) as string[]) ?? [];
const config = (yaml.load(configRaw) as Record<string, unknown>) ?? {};
const slides = orderSlides(modules, order);

const root = createRoot(document.getElementById("root")!);
const arrange = import.meta.env.DEV && new URLSearchParams(location.search).has("arrange");

root.render(arrange ? <ArrangeView talkId={TALK_ID} slides={slides} /> : <Deck slides={slides} config={config} />);
