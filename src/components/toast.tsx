export function ToastComponent({ notification }) {
  if (notification) {
    return (
      <div className="toast toast-top toast-end mr-4">
        <div className="alert alert-success">
          <div>
            <span>{notification}</span>
          </div>
        </div>
      </div>
    )
  }
}
