import "./ErrorNotice.css";
function ErrorNotice(props) {
  return (
    <div className="d-flex align-items-center container error-notice mt-4">
      <p className="text-danger m-0 p-2">{props.msg}</p>
    </div>
  );
}

export default ErrorNotice;
