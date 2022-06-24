/// <reference types="react" />
import { Colors } from "./../Colors";
export declare enum LoaderSizes {
    FuckingTiny = "FuckingTiny",
    SuperSmall = "SuperSmall",
    VerySmall = "VerySmall",
    Small = "Small",
    Medium = "Medium",
    Large = "Large"
}
export default function Loader({ size, color, }: {
    size?: LoaderSizes | undefined;
    color?: Colors | undefined;
}): JSX.Element;
