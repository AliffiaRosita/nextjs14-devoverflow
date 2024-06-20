import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface ContactButtonBaseProps {
  color: string;
  icon?: IconProp;
  text: string;
  image?: string;
}

interface ContactButtonLinkProps extends ContactButtonBaseProps {
  type?: "link";
  link: string;
  onClick?: never;
}

interface ContactButtonButtonProps extends ContactButtonBaseProps {
  type: "button";
  onClick: () => void;
  link?: never;
}

type ContactButtonProps = ContactButtonLinkProps | ContactButtonButtonProps;

const ContactButton = ({
  color,
  icon,
  text,
  link,
  image,
  type = "link",
  onClick = () => {},
}: ContactButtonProps) => {
  const renderButtonContent = (
    <div className=" flex-center flex flex-wrap gap-1">
      {icon && (
        <FontAwesomeIcon color={color} width={16} height={16} icon={icon} />
      )}
      {image && (
        <Image src={image} alt="profile picture" width={16} height={16} />
      )}
      <span className="small-regular line-clamp-1">{text}</span>
    </div>
  );

  const renderButton = () => {
    if (type === "button") {
      return (
        <a onClick={onClick} className="cursor-pointer">
          {renderButtonContent}
        </a>
      );
    }

    return (
      <a href={link} target="_blank">
        {renderButtonContent}
      </a>
    );
  };

  return <div className="relative">{renderButton()}</div>;
};

export default ContactButton;
