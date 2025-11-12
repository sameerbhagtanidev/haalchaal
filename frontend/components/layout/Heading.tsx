import Image from "next/image";
import logoImg from "@/assets/logo.svg";

export default function Heading() {
    return (
        <div className="flex items-center justify-center gap-2">
            <Image src={logoImg} alt="Logo" className="size-17 md:size-22" />
            <h1 className="text-primary font-poetsen-one text-4xl md:text-5xl">
                HaalChaal
            </h1>
        </div>
    );
}
