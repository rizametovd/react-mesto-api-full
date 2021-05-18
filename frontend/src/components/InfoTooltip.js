import success from "../images/success.svg";
import fail from "../images/fail.svg";

function InfoTooltip(props) {
  return (
    <div className={`popup ${props.status && "popup_opened"}`}>
      <div className="popup__container popup__container_img">
        <button
          className="popup__close-button button"
          type="button"
          aria-label="Закрыть попап"
          onClick={props.onClose}
        ></button>
        <img
          className="popup__img-status"
          src={`${props.status === "success" ? success : fail}`}
          alt={`${
            props.status === "success"
              ? "Успешная регистрация"
              : "Что-то пошло не так"
          }`}
        />
        <h2 className="popup__title popup__title_img">{`${
          props.status === "success"
            ? "Вы успешно зарегистрировались!"
            : "Что-то пошло не так! Попробуйте еще раз."
        }`}</h2>
      </div>
    </div>
  );
}

export default InfoTooltip;
