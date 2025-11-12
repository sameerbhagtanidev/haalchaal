import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { FaUser } from "react-icons/fa";
import { IoSend } from "react-icons/io5";

export default function ChatWindow() {
    return (
        <div className="shadow-primary fixed top-[7.5dvh] left-[7.5dvw] h-[85dvh] w-[85dvw] rounded-lg bg-white shadow-[0_0_10px_2px] dark:bg-black">
            <div className="flex items-center justify-center gap-5 rounded-t-lg border-b-2 px-5 py-2 text-xl">
                <FaUser />
                <p className="w-full overflow-hidden text-nowrap text-ellipsis">
                    Other User
                </p>
            </div>

            <div className="absolute bottom-0 flex w-full items-center justify-center gap-2 px-5 py-3">
                <Input
                    type="text"
                    placeholder="Message..."
                    className="flex-1 text-lg"
                />
                <Button className="hover:text-primary" variant="ghost">
                    <IoSend className="size-6" />
                </Button>
            </div>
        </div>
    );
}
