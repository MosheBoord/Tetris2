import "./PauseMenuButton.css";

export default function PauseMenuButton({
  heightPercentage,
  width,
  attributes,
}) {
  return (
    <input
      className="pause-menu-button"
      style={{
        height: heightPercentage + "%",
      }}
      type={"button"}
      //   value={"Resume lskjfdlksjdaf;ljs some random text"}
      {...attributes}
    />
  );
}
