import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";

interface IconButtonBaseProps {
  color: string;
  icon?: IconProp;
  text: string;
  image?: string;
}

interface IconButtonLinkProps extends IconButtonBaseProps {
  type?: "link";
  link: string;
  onClick?: never;
}

interface IconButtonButtonProps extends IconButtonBaseProps {
  type: "button";
  onClick: () => void;
  link?: never;
}

type IconButtonProps = IconButtonLinkProps | IconButtonButtonProps;

const IconButton = ({
  color,
  icon,
  text,
  link,
  image,
  type = "link",
  onClick = () => {},
}: IconButtonProps) => {
  const renderButtonContent = (
    <div className=" flex-center flex flex-wrap gap-1">
      {icon && (
        <FontAwesomeIcon color={color} width={16} height={16} icon={icon} />
      )}
      {image && (
        <Image src={image} alt="profile picture" width={16} height={16} />
      )}
      <span className="small-regular text-dark200_light900 line-clamp-1">{text}</span>
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

export default IconButton;
