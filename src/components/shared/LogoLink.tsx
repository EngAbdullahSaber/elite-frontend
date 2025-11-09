import Link from "next/link";
import { SideLogoIcon } from "./LogoIcon";


export default function LogoLink() {
    return (
        <div className="mx-auto">
            <Link href="/">
                <div className="flex items-center justify-center">
                    <div className="xl:block">
                        {/* <LogoIcon className="mb-2" /> */}
                        <SideLogoIcon className="mb-2" />
                    </div>

                </div>
            </Link>
        </div>

    )
}