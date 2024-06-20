import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface ContactButtonProps {
    color: string;
    icon?: IconProp;
    text: string;
    link: string;
    image?: string;
}

const ContactButton = ({
    color,
    icon,
    text,
    link,
    image,
}: ContactButtonProps) => {
    return (
        <div className="relative">
            <a href={link} target="_blank">
                <div className=" flex flex-wrap flex-center gap-1">
                    {icon && (
                        <FontAwesomeIcon
                            color={color}
                            width={16}
                            height={16}
                            icon={icon}
                        />
                    )}
                    {image && (
                        <Image
                            src={image}
                            alt="profile picture"
                            width={16}
                            height={16}
                        />
                    )}
                    <span className=" small-regular line-clamp-1 undefined">
                        {text}
                    </span>
                </div>
            </a>
        </div>
    );
};
export default ContactButton;
